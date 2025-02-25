// controllers/notificationController.js
exports.getNotifications = async (req, res) => {
    // retrieve notifications for user
    return res.json({ notifications: [] });
  };
  
  exports.markNotificationsRead = async (req, res) => {
    // mark notifications as read
    return res.json({ message: "Notifications marked read" });
  };
  