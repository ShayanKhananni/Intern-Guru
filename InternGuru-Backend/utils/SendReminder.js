import Enrollment from "../models/enrollment_model.js";
import Task from "../models/task-model.js";
import TaskSubmission from "../models/task_submission_model.js";
import { customError, sendEmail } from "./utils.js";



/// Function to Calculate Get Pending Tasks and Send Email to Interns

export const sendTaskReminders = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .select('intern_id internship_id start_date')
      .populate('intern_id', 'email')
      .populate('internship_id', 'duration')
      .lean();

    const allTasks = await Task.find({}).lean();
    const allSubmissions = await TaskSubmission.find({}).lean();

    for (const enrollment of enrollments) {
      const internId = enrollment.intern_id?._id?.toString(); 
      const internshipId = enrollment.internship_id?._id?.toString(); 
      const internEmail = enrollment.intern_id?.email;
      const durationInMonths = enrollment.internship_id?.duration?.value;
      const startDate = new Date(enrollment.start_date);

      const assignedTasks = allTasks.filter(task =>
        task.internship_id?.toString() === internshipId
      );

      const submittedTaskIds = allSubmissions
        .filter(sub => sub.intern_id?.toString() === internId)
        .map(sub => sub.task_id?.toString());

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationInMonths);

      const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const daysPerTask = totalDays / assignedTasks.length;

      for (let i = 0; i < assignedTasks.length; i++) {
        const task = assignedTasks[i];
        const taskId = task._id?.toString();

        const taskDeadline = new Date(startDate);
        const offset = Math.round(daysPerTask * (i + 1));
        taskDeadline.setDate(taskDeadline.getDate() + offset);


        /// Hard-Coded Current-Date as Date 5 Days Before every Pending Task Deadline
        const currentDate = new Date(taskDeadline);  
        currentDate.setDate(currentDate.getDate() - 5); 
        
        // const currentDate = new Date();   /// Current Date  
        const daysLeft = Math.ceil((taskDeadline - currentDate) / (1000 * 60 * 60 * 24));
        const isSubmitted = submittedTaskIds.includes(taskId);

         /// If lesser then 7 days for task deadline are left send email to interns
         if (daysLeft < 7 && !isSubmitted) {
          const text = `Please Submit Your Task ${task.title}, as soon as possible its deadline is ${taskDeadline}`
          sendEmail(internEmail,'Task Reminder',text)
        }
      }
    }

    res.status(200).json({ message: "Checked all tasks" });
  } catch (err) {
    console.log(err)
  }
};