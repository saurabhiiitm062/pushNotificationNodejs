require("dotenv").config(); // Load environment variables
const cors = require("cors");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./models/notificationModel"); // Assuming a separate model file
const { matchesGlob } = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for testing; secure in production
    methods: ["GET", "POST"],
  },
});
app.use(cors());
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Push Notification Server",
  });
});

// WebSocket setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("subscribe", async (userId) => {
    console.log(`User subscribed with ID: ${userId}`);
    // Save socket ID and user subscription logic
  });

  socket.on("send-notification", async ({ userId, message }) => {
    console.log(`Notification to user ${userId}: ${message}`);
    // Send real-time notification logic
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Handle user disconnection
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
