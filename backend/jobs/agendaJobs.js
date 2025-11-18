const nodemailer = require("nodemailer");
const User = require("../models/user");
const { sendToken } = require("../services/fcm");

module.exports = (agenda) => {
  agenda.define("todo reminder", async (job) => {
    const { todo, user: { id, email } } = job.attrs.data;

    console.log(`🔔 Reminder: Todo "${todo.title}" for ${email}`);

    // ---------------- EMAIL REMINDER ----------------
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log("📨 Attempting to send email to:", email);

      const mailOptions = {
        from: `"Todo Reminder" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `⏰ Reminder: ${todo.title}`,
        text: `Hey ${email.split("@")[0]}, just a reminder for your todo: "${todo.title}"!`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully:", info.response);

    } catch (error) {
      console.error("❌ Email sending failed:", error);
    }

    // ---------------- PUSH NOTIFICATION BLOCK ----------------
    try {
      const dbUser = await User.findById(id).lean();   // ❌ You wrote findbyId (wrong)
      const tokens = dbUser?.devices || [];

      if (!tokens.length) {
        console.log("ℹ️ No device tokens found for user; skipping push");
        return;
      }

      const title = "⏰ Todo Reminder";
      const body = `It's time: ${todo.title}`;

      for (const token of tokens) {
        try {
          await sendToken(token, {
            title,
            body,
            data: { todoTitle: String(todo.title || "") },
          });

          console.log("📲 Push sent to", token.slice(0, 10) + "…");

        } catch (err) {
          console.error("❌ Push error:", err?.message || err);

          // If token is invalid → Remove from database
          if (
            err?.errorInfo?.code ===
            "messaging/registration-token-not-registered"
          ) {
            await User.findByIdAndUpdate(id, {
              $pull: { devices: token },
            });

            console.log("🗑️ Removed invalid token");
          }
        }
      }
    } catch (e) {
      console.error("❌ Push block error:", e);
    }
  });
};
