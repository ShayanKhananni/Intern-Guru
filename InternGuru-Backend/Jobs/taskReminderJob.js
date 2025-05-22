import { sendTaskReminders } from "../utils/SendReminder.js";
import cron from "node-cron";

/// Cron-Job For Sending Email to Interns
// Changing time to 5:06 PM
cron.schedule('6 17 * * *', async () => {
  console.log('Running task reminder job at 4:30 PM...');
  await sendTaskReminders();
});






