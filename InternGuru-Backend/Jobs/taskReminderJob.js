import { sendTaskReminders } from "../utils/SendReminder.js";
import cron from "node-cron";

cron.schedule('4 1 * * *', async () => {
  console.log('Running task reminder job at 11:20 PM...');
  await sendTaskReminders();
});

