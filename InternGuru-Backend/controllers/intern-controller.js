import Application from "../models/application_model.js";
import Course from "../models/course_model.js";
import Enrollment from "../models/enrollment_model.js";
import Kanban from "../models/kanban_model.js";
import PurchasedCourse from "../models/purchased_course.model.js";
import Task from "../models/task-model.js";
import TaskSubmission from "../models/task_submission_model.js";
import { customError, resumeBuilder, stripe, successResponseBuilder } from "../utils/utils.js";



// const dummyController = (req,res,next) =>
// {
//   try
//   {
//     const {} = req.body;
//   }
//   catch(err)
//   { 
// next(err);
//   }
// }



export const applyForInternship = async (req, res, next) => {
  try {
    const { internship_id, intern_id } = req.body;

    const existingApplication = await Application.findOne({ intern_id });

    if (existingApplication) {
      return next(customError(400, "You have already applied for an internship. Please wait for the response."));
    }

    const isEnrolled = await Enrollment.findOne({ intern_id });

    if (isEnrolled) {
      return next(customError(400, "Can not enroll in multiple internship at a time"));
    }


    const application = await Application.create({ intern_id, internship_id });

    if (!application) {
      return next(customError(500, "Failed to send application. Please try again."));
    }

    return res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};


export const submitTask = async (req, res, next) => {
  try {

    const task = await TaskSubmission.create(req.body);

    if (!task) {
      return next(customError(500, "Task Not Send"));
    }
    return res.status(200).json(task);
  }
  catch (err) {
    next(err);
  }
}



export const updateTaskSubmission = async (req, res, next) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedTask = await TaskSubmission.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return next(customError(404, "Task not found  not found"));
    }

    return res
      .status(200)
      .json({ messgae: "Task Updated Successfully", updatedTask });
  } catch (err) {
    return next(err);
  }
};









export const getInternsTasks = async (req, res, next) => {
  try {
    const { internship_id, intern_id } = req.params;

    const submittedTasks = await TaskSubmission.find({ intern_id }).lean();
    const assignedTasks = await Task.find({ internship_id }).lean();

    if (submittedTasks.length === 0) {
      const cleanedTasks = assignedTasks.map(task => ({
        ...task,
        submitted: false,
        github_link: null,
        deployed_link: null,
      }));
      return res.status(200).json(cleanedTasks);
    }

    const submittedIds = submittedTasks.map(task => task.task_id.toString());

    const mergedTasks = assignedTasks.map(task => {

      const isSubmitted = submittedIds.includes(task._id.toString());
      const submission = isSubmitted
        ? submittedTasks.find(sub => sub.task_id.toString() === task._id.toString())
        : null;

      const { createdAt, updatedAt, ...cleanTask } = task;

      return isSubmitted
        ? {
            ...cleanTask,
            submitted: true,
            status: submission.status,
            github_link: submission.github_link,
            deployed_link: submission.deployed_link,
            feedback: submission.feedback,
            submission_id: submission._id,
          }
        : {
            ...cleanTask,
            submitted: false,
            github_link: null,
            deployed_link: null,
          };
    });

    res.status(200).json(mergedTasks);
  } catch (err) {
    next(err);
  }
};




export const getInternCourses = async (req, res, next) => {
  try {

    const { intern_id, internship_id } = req.params;


    const courses = await Course.find({ internship_id });
  

    const purchasedCourses = await PurchasedCourse.find({ intern_id });


    if (!purchasedCourses || purchasedCourses.length === 0) {
      return res.status(200).json(
        courses.map(course => ({
          ...course.toObject(),
        }))
      );
    }

    const purchasedIds = purchasedCourses.map(course =>
      course.course_id.toString()
    );


    const internCourses = courses.map(course => {
      const courseObj = course.toObject();
      const isPurchased = purchasedIds.includes(course._id.toString());


      return {
        ...courseObj,
        ...(course.type === 'paid' && isPurchased && { purchased: true }),
      };
    });


    res.status(200).json(internCourses);
  } catch (err) {
    console.error("Failed to fetch intern courses", err);
    res.status(500).json({ message: "Server Error" });
  }
};


export const purchaseCourse = async (req, res) => {
  try {
    const { price_id, course_id, internship_id, intern_id } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    success_url: `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5173/payment-cancel`,
    metadata: {
       course_id,
       internship_id,
       intern_id,
    },
  });

  res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getPurcahseSession = async (req,res,next) =>
{ 
    try {
      const {sessionId} = req.params
      console.log(sessionId);

      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      
      const { intern_id, course_id, internship_id } = session.metadata;
      
      res.status(200).json({ intern_id, course_id, internship_id });
    } catch (err) {
      console.error("Error fetching session:", err.message);
      next(err)
    }
  
}


export const enrollIntern = async (req, res, next) => {
  try {
    const { intern_id, course_id } = req.body;

    const enrollment = await PurchasedCourse.create({
      intern_id,
      course_id,
    });

    if (!enrollment) {
      return next(customError(500, "Something went wrong while enrolling"));
    }

    return res.status(200).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment,
    });
  } catch (err) {
    next(err);
  }
};



export const getCollaborativeTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collabTasks = await Task.find(
      { internship_id: id, collab: true },
    ).select('title internship_id')

    if (collabTasks.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(collabTasks);
  } catch (err) {
    next(err);
  }
};









export const addKanban = (req, res, next) => {
  try {
    const {title,status}  = req.body;
    const task = Kanban.create({
      title,
      status
    });
    if (!task) {
      return next(customError(500, 'Task Not Created'));
    }

    return res.status(200).json(task);
  }
  catch (err) {
    next(err);
  }
}



export const getKanbans = async (req, res, next) => {
  try {
    const tasks = await Kanban.find({});
    if (tasks.lengt === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(tasks);

  } catch (err) {
    next(err);
  }
};



export const updateKanban = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await Kanban.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return next(customError(404, "Task not found"));
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
};



export const deleteKanban = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTask = await Kanban.findByIdAndDelete(id);

    if (!deletedTask) {
      return next(customError(404, "Task not found"));
    }

    res.status(200).json({ message: "Task deleted", task: deletedTask });
  } catch (err) {
    next(err);
  }
};








// Main Express handler
export const generateResume = async (req, res, next) => {
  try {
    const data = req.body;

    // Parse JSON strings into objects/arrays
    const resumeData = {
      ...data,
      education: JSON.parse(data.education),
      experience: JSON.parse(data.experience),
      skills: JSON.parse(data.skills),
    };

    // Generate PDF buffer
    const resume = await resumeBuilder(resumeData);

    // Set headers and send PDF buffer as response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
      'Content-Length': resume.length,
    });

    res.end(resume);

  } catch (err) {
    console.error('Error generating resume:', err);
    next(err);
  }
};













