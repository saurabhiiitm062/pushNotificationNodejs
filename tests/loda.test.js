const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const socketClient = require("socket.io-client");
const Notification = require("../models/notificationModel"); // Your notification model

jest.setTimeout(80000); // Set global timeout for tests
jest.mock("../models/notificationModel", () => {
  return {
    findOne: jest.fn(),
  };
});

describe("Socket.io server tests", () => {
  let server;
  let io;
  let clientSocket;
  const PORT = 9000;

  beforeAll((done) => {
    // Setup the server and socket.io
    server = http.createServer();
    io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      socket.on("subscribe", async (userId) => {
        // Mock behavior for subscribe event
        Notification.findOne.mockResolvedValueOnce({
          socketId,
          isOnline: true,
        });

        if (notification) {
          notification.isOnline = true;
          await notification.save();
        } else {
          const newNotification = new Notification({ userId, isOnline: true });
          await newNotification.save();
        }
      });

      socket.on("send-notification", async (data) => {
        const { socketId, message } = data;

        const notification = await Notification.findOne({ socketId });
        if (notification && notification.isOnline) {
          socket.to(notification.socketId).emit("notification", message);
        }
      });
    });

    // Start server
    server.listen(PORT, done);
  }, 10000); // Set timeout for this beforeAll to 10 seconds

  beforeEach(() => {
    // Connect the client socket before each test
    clientSocket = socketClient(`http://localhost:${PORT}`);
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    }
  });

  test("should connect and subscribe user", (done) => {
    const userId = "user123"; // Dummy user ID

    clientSocket.on("connect", () => {
      clientSocket.emit("subscribe", userId); // Emit subscribe event with userId

      // Mock the Notification model's behavior
      Notification.findOne.mockResolvedValueOnce(null); // No notification exists yet

      clientSocket.emit("subscribe", userId);
    });

    // Simulate database response for the subscription
    Notification.findOne.mockResolvedValueOnce(null);
    done();
  });

  test("should send notification to connected user", (done) => {
    const userId = "user123";
    const socketId = "socketId123";
    const message = "Test notification message";

    // Mock the notification model to simulate a connected user
    Notification.findOne.mockResolvedValueOnce({ socketId, isOnline: true });

    clientSocket.on("connect", () => {
      // Simulate sending notification
      clientSocket.emit("send-notification", { socketId, message });

      // Listen for the notification
      clientSocket.on("notification", (msg) => {
        expect(msg).toBe(message); // Expect the message to be received
        done();
      });
    });
  });

  test("should not send notification if user is offline", (done) => {
    const socketId = "socketId123";
    const message = "Test notification message";

    // Mock the notification model to simulate an offline user
    Notification.findOne.mockResolvedValueOnce({ socketId, isOnline: false });

    clientSocket.on("connect", () => {
      // Simulate sending notification to an offline user
      clientSocket.emit("send-notification", { socketId, message });

      // Ensure no notification is sent
      clientSocket.on("notification", (msg) => {
        expect(msg).not.toBeDefined(); // Expect no message to be sent
        done();
      });
    });
  });

  test("should handle disconnection event", (done) => {
    const socketId = "socketId123";

    // Mock the Notification model's behavior for user disconnection
    Notification.findOne.mockResolvedValueOnce({ socketId, isOnline: true });

    clientSocket.on("connect", () => {
      clientSocket.emit("subscribe", socketId); // Subscribe user

      // Now simulate disconnection event
      clientSocket.disconnect();

      // Check that the server properly handled disconnection
      expect(Notification.findOne).toHaveBeenCalledWith({ socketId });
      done();
    });
  });
});
