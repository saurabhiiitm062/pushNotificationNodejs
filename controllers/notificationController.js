const Notification = require("../models/notificationModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("subscribe", async (userId) => {
      try {
        let notification = await Notification.findOne({ userId });

        if (notification) {
          notification.socketId = socket.id;
          notification.isOnline = true;
          await notification.save();
          console.log(`User ${userId} is online`);
        } else {
          notification = new Notification({
            userId,
            socketId: socket.id,
            isOnline: true,
          });
          await notification.save();
          console.log(`New user ${userId} created and marked as online`);
        }
      } catch (error) {
        console.error("Error subscribing user:", error);
      }
    });

    socket.on("send-notification", async ({ socketId, message }) => {
      try {
        let notification = await Notification.findOne({ socketId });

        if (notification && notification.isOnline) {
          socket.to(notification.socketId).emit("notification", message);
          console.log(`Notification sent to ${socketId}: ${message}`);
        } else {
          console.log(`User with socketId ${socketId} is offline.`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        console.log("A user disconnected", socket.id);
        const user = await Notification.findOne({ socketId: socket.id });
        if (user) {
          user.isOnline = false;
          await user.save();
          console.log(`User with socket ID ${socket.id} is now offline`);
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });
};
