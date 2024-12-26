const mongoose = require('mongoose');
const {customError} = require('../middlewares/errorhandler.middleware')
const userServices = require('./user.services')
const bookingSchema = require('../models/booking.model');
const rideServices = require('./ride.services');

const Booking = mongoose.model("Booking", bookingSchema);
const bookingServices = {
    // Book a Ride
    bookRide: async (userId, bookingData)=>{
        try {
            // Check if user exists
            const isValidUser = (await userServices.findByUserId(userId)).user;
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            // Check if Ride exists
            const ride = (await rideServices.getRideById(bookingData.rideId)).ride;
            if (!ride) {
                throw new customError(404, "Ride not found");
            }
            if (ride.passengers.find((passenger)=>passenger.primaryPassenger==userId)) {
                throw new customError(400, "Booking already present for this ride");
            }
            // Create booking using booking data
            const booking = new Booking(bookingData);
            if(!booking._id){
                booking._id = new mongoose.Types.ObjectId();
            }
            // set create and update date
            booking.createdDate = new Date();
            booking.updatedDate = new Date();
            // set passenger id
            booking.passengerId = userId;
            booking.status = 'confirmed';
            // update Ride with passenger info
            await rideServices.updatePassengers(userId, bookingData.rideId, booking.allPassengers);
            // Save booking to database
            const createdBooking = await booking.save();
            // return created booking
            return {success: true, booking: createdBooking};
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while creating a booking');
        }
    },
    // Update a Booking
    updateBooking: async(userId, bookingId, updateData)=>{
        try {
            // Check if user exists
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            // Check if booking exists
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new customError(404, "Booking not found");
            }
            // Check if booking owner is making update
            if (booking.passengerId != userId) {
                throw new customError(403, "Only booking owner can update booking details")
            }
            // Update Booking
            const updatedBooking = Object.assign(booking, updateData);
            await Booking.updateOne({_id: bookingId}, updatedBooking);
            // update Ride with passenger info
            await rideServices.updatePassengers(userId, updatedBooking.rideId, updatedBooking.allPassengers);
            // return updated booking
            return {success: true, booking: updatedBooking};
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while updating a booking');
        }
    },
    // get Booking by Booking Id
    getBookingById: async(bookingId)=>{
        try {
            // Check if booking exists
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new customError(404, "Booking not found");
            }
            return {success: true, booking: booking}
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while fetching a booking');
        }
    },
    // get Booking by passenger Id
    getBookingsByPassengerId: async(userId)=>{
        try {
            // Check if user exists
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            // Find booking using userId
            const bookings = await Booking.find({passengerId: userId});
            return {success: true, bookings: bookings};
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while fetching bookings');
        }
    },
    // Cancel a Booking
    cancelBooking: async (userId, bookingId)=>{
        try {
            // Check if user exists
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            // Check if booking exists
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new customError(404, "Booking not found");
            }
            // Check if booking owner is making update
            if (booking.passengerId != userId) {
                throw new customError(403, "Only booking owner can update booking details")
            }
            // Update Booking status
            booking.status = 'cancelled';
            
            // Update Ride
            await rideServices.removePassenger(booking.rideId, userId);
            // update booking details
            await Booking.updateOne({_id: booking._id},booking);
            return {success: true, cancelledBooking: booking }
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while canceling a booking');
        }
    }
}
module.exports = bookingServices;