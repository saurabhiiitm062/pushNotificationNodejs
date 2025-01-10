const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  socketId: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
