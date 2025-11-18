const express = require("express");
const auth = require("../middleware/authMiddleware");
const User = require("../models/user");
const { sendToken } = require("../services/fcm");

const router = express.Router();



router.post("/save-token", auth, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ msg: "token required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { devices: token } },  // 👈 store in devices[]
      { new: true }
    );

    console.log(
      "✅ Saved FCM token for user:",
      updatedUser.email,
      updatedUser.devices
    );

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;

/**
 * POST /api/notifications/test
 * Body: { title, body }
 * Sends a test notification to all tokens for the logged-in user.
 */
router.post("/test", auth, async (req, res) => {
  try {
    const { title = "Test", body = "This is a test notification" } = req.body;
    const user = await User.findById(req.user.id).lean();

    if (!user?.deviceTokens?.length) {
      return res.status(400).json({ msg: "No device tokens saved." });
    }

    const results = [];
    for (const token of user.devices) {
      try {
        const id = await sendToToken(token, { title, body });
        results.push({ token, status: "sent", id });
      } catch (err) {
        // If token is invalid/unregistered, remove it
        if (
          err?.errorInfo?.code === "messaging/registration-token-not-registered"
        ) {
          await User.findByIdAndUpdate(req.user.id, {
            $pull: { devices: token },
          });
          results.push({ token, status: "removed-invalid" });
        } else {
          results.push({ token, status: "error", error: err.message });
        }
      }
    }

    res.json({ results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;