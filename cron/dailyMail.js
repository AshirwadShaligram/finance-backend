import cron from "node-cron";
import axios from "axios";

// Run daily at 8:00 AM server time
cron.schedule("0 8 * * *", async () => {
  try {
    await axios.post(`${process.env.BACKEND_URL}/api/email/send-daily-reports`);
  } catch (error) {
    console.error("Failed to send daily reports:", error.message);
  }
});
