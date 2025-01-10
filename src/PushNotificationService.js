const io = require("socket.io-client");

class PushNotificationService {
  constructor(serverUrl, userId) {
    this.socket = io(serverUrl); // Connect to the server
    this.userId = userId; // Unique user identifier
  }

  subscribe() {
    this.socket.emit("subscribe", this.userId);
    console.log(`Subscribed user: ${this.userId}`);
  }

  onNotification(callback) {
    this.socket.on("notification", (message) => {
      callback(message);
    });
  }

  sendNotification(message) {
    this.socket.emit("send-notification", { userId: this.userId, message });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

module.exports = PushNotificationService;
