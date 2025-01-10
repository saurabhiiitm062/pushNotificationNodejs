# Push Notification Service

A real-time push notification service using WebSockets (Socket.io) for frontend-backend communication. This service allows sending and receiving notifications to/from users in real-time.

## Features

- Real-time notifications via WebSockets.
- Subscription system for users to receive notifications.
- Can be integrated with any frontend project like React.js, Angular, etc.
- Supports custom notifications for specific users.

## Installation

### 1. **Backend Setup (Node.js)**

Clone this repository to your local machine:

```bash
git clone https://github.com/yourusername/pushNotificationNodejs.git
cd pushNotificationNodejs

npm install

MONGO_URI=your_mongo_connection_string
PORT=8000
npm start


## frontend integration
Install the package   npm install web-pushNotification-bySaurabh

Import and use the PushNotificationService class in your frontend project
import PushNotificationService from 'web-pushNotification-bySaurabh';

// Initialize service with backend server URL and unique user ID
const pushService = new PushNotificationService('https://pushnotificationnodejs.onrender.com', 'user123');

// Subscribe the user to receive notifications
pushService.subscribe();

// Listen for notifications
pushService.onNotification((message) => {
  console.log('Received notification:', message);
});

// Send a notification to the user
pushService.sendNotification('Hello, this is a push notification!');

```
