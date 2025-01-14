const socketio = require("socket.io");
const setUpSocket = (server) => {
  const io = new socketio.Server(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);
    // Join particular group related to ride.
    socket.on("joinRoom", (rideId) => {
      socket.join(rideId);
      console.log(`User with socketId ${socket.id} joined Ride ${rideId}`);
    });
    // Listen/Receive updated coords
    socket.on("locationUpdate", ({ rideId, lat, lng, name }) => {
      // emit/broadcast to particular group of ride
      socket.broadcast.to(rideId).emit("newLocation", { id: socket.id, lat, lng, name });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
  return io
};
module.exports = { setUpSocket };