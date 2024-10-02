const mongoose = require('mongoose');
const userSchema = require('./../models/user.model.js');
const { customError } = require('../middlewares/errorhandler.middleware.js');


const User = mongoose.model('User', userSchema);
const userServices = {
    signup: async(userData)=>{
        try {
            const user = new User(userData);
            if(!user?._id){
                user._id = new mongoose.Types.ObjectId();
            }
            user.createdDate = new Date();
            user.updatedDate = new Date();
            const createdUser = await user.save();
            return {success: true, user: createdUser};
        } catch (error) {
            throw new customError(400, error.message || 'Error while creating user');
        }
    },
    findByEmail: async(email)=>{
        try {
            const existingUser = await User.findOne({email:email});
            if (existingUser) {
                return {success: true, user: existingUser}
            }else{
                throw new customError(404, 'User not found');
            }
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while fetching user by email');
        }
    },
    findByUserId: async(userId)=>{
        try {
            const user = await User.findById(userId);
            if (user) {
                return {success: true, user: user}
            } else {
                throw new customError(404, 'User not found');
            }
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while fetching user by id');
        }
    }
}

module.exports = userServices;