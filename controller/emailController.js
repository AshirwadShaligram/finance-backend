import User from "../models/User.js";
import sendEmail from "../utils/email.js";

const generateDailyReport = (user) => {
  return `
    Hello ${user.name},

    Here is your daily report for ${new Date().toLocaleDateString()}.

    - You can customize this content with user-specific data.

    Thanks,
    Finance Tracker Team
  `;
};

export const sendDailyReports = async (req, res) => {
  try {
    const users = await User.find({});

    const emailPromises = users.map((user) =>
      sendEmail({
        email: user.email,
        subject: "📊 Your Daily Report",
        message: generateDailyReport(user),
      })
    );

    await Promise.all(emailPromises);

    res
      .status(200)
      .json({ message: "Daily reports sent successfully to all users." });
  } catch (error) {
    console.error("Error sending daily reports:", error);
    res.status(500).json({ message: "Failed to send daily reports.", error });
  }
};
