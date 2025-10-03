import mongoose from "mongoose";
import Application from "../models/application_model.js";
import Enrollment from "../models/enrollment_model.js";
import InternshipCat from "../models/internship_cat_model.js";
import Internship from "../models/internships_model.js";
import Task from "../models/task-model.js";
import TaskSubmission from "../models/task_submission_model.js";
import User from "../models/user-model.js";
import { customError, imageUploder, stripe, successResponseBuilder } from "../utils/utils.js";
import nodemailer from 'nodemailer';
import Course from "../models/course_model.js";
import PurchasedCourse from "../models/purchased_course.model.js";


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



/// Internship Api's

export const createInternshipCateg = async (req, res, next) => {
  try {

    const { title } = req.body;

    const imgUrl = await imageUploder(req);

    const internshipCat = await InternshipCat.create({
      title,
      image_url: imgUrl
    });
    return res.status(200).json(internshipCat);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};


export const updateInternshipCateg = async (req, res, next) => {
  try {
    const { cat_id, title } = req.body;

    const updateData = { title };

    if (req.file) {
      const imgUrl = await imageUploder(req);
      updateData.image_url = imgUrl;
    }

    const updatedInternshipCat = await InternshipCat.findByIdAndUpdate(
      cat_id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInternshipCat) {
      return next(customError(404, "Internship category not found"));
    }

    return res
      .status(200)
      .json(updatedInternshipCat);
  } catch (err) {
    return next(err);
  }
};




export const deleteInternshipCateg = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Deleting category with ID:', id);

    const internships = await Internship.find({ cat_id: id });
    if (internships.length > 0) {
      return next(customError(400, 'Cannot delete category. It contains internships.'));
    }

    const result = await InternshipCat.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    return next(err); 
  }
};




export const createInternship = async (req, res, next) => {
  try {
    const { title, cat_id, duration_unit, duration_value } = req.body;
    const imgUrl = await imageUploder(req);


    const newInternship = await Internship.create({
      title,
      image_url: imgUrl,
      cat_id,
      duration: {
        unit: duration_unit,
        value: duration_value
      }
    });

    if (!newInternship) {
      return next(customError(500, "Internship not created!!"));
    }

    return res.status(200).json(newInternship);
  } catch (err) {
    return next(err);
  }
};


export const updateInternship = async (req, res, next) => {
  try {
    const { id, title } = req.body;

    const updateData = { title, id };

    if (req.file) {
      const imgUrl = await imageUploder(req);
      updateData.image_url = imgUrl;
    }

    const updatedInternshipCat = await Internship.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInternshipCat) {
      return next(customError(404, "Internship  not found"));
    }

    return res
      .status(200)
      .json(updatedInternshipCat);
  } catch (err) {
    return next(err);
  }
};


export const deleteInternshipAndCascade = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;


    const enrollments = await Enrollment.find({ internship_id: id }).session(session);

    if (enrollments.length > 0) {
      return next(customError(400, 'Cannot delete internship, Interns are enrolled!'));
    }

    await Task.deleteMany({ internship_id: id }).session(session);
    await TaskSubmission.deleteMany({ internship_id: id }).session(session);



    const deletedInternship = await Internship.findByIdAndDelete(id).session(session);

    if (!deletedInternship) {
      throw new Error('Internship not found');
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Internship and related data deleted successfully' });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
};























/// Application Api's

export const getApplications = async (req, res, next) => {
  try {
    const { id } = req.params;

    const applications = await Application.find({ internship_id: id })
      .populate('intern_id')
      .populate('internship_id', 'title');
    if (applications.length === 0) {
      return next(customError(404, 'No Applications in this category exist'));
    }

    const formatted = applications.map(app => ({
      id: app._id,
      internship_title: app.internship_id?.title || '',
      internship_id: app.internship_id?._id || '',
      status: app.status,
      intern: {
        id: app.intern_id._id,
        username: app.intern_id?.username || '',
        email: app.intern_id?.email || '',
        university: app.intern_id?.university || '',
        program: app.intern_id?.program || '',
        contact: app.intern_id?.contact || '',
        address: app.intern_id?.address || '',
        photoURL: app.intern_id?.photoURL || '',
      }
    }));

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
};



export const getApplicationDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const applicationDetails = await Application.find({ intern_id: id })
      .populate('intern_id', '-password')
    res.status(200).json(applicationDetails);
  }
  catch (err) {
    next(err);
  }
}

export const updateApplication = async (req, res, next) => {
  try {
    const { id, intern_id, internship_id, status, feedback } = req.body;


    const updateData = {};
    if (status) updateData.status = status;
    if (feedback) updateData.feedback = feedback;

    // Update the application
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedApplication) {
      return next(customError(404, 'Application Not Found'));
    }

    // Create enrollment only if approved
    if (status === 'approved') {
      await Enrollment.create({
        intern_id,
        internship_id,
      });
    }

    await Application.findByIdAndDelete(id);

    res.status(200).json(updatedApplication);
  } catch (err) {
    next(err);
  }
};










/// Intern-Info Api's


export const getAllInterns = async (req, res, next) => {
  try {
    const interns = await Enrollment.find()
      .populate('intern_id', 'username')
      .populate('internship_id', 'title')

    if (interns.length === 0) {
      return next(customError(404, 'No Interns Found'));
    }

    return res.status(200).json(interns);
  }
  catch (err) {
    return next(err);
  }
}

export const getInternsByInternship = async (req, res, next) => {
  try {
    const { id } = req.params;

    const interns = await Enrollment.find({ internship_id: id })
      .populate('intern_id', 'username email  photoURL')
      .populate('internship_id', 'title duration')

    const formatedInterns = interns.map((intern) => {

      return {
        id: intern._id,
        internship_id: intern.internship_id._id,
        internship_title: intern.internship_id.title,
        intern_id: intern.intern_id._id,
        username: intern.intern_id.username,
        start_date: intern.start_date,
        photoURL: intern.intern_id.photoURL,
        email: intern.intern_id.email,
        internship_duraiton: intern.internship_id.duration,
      }
    })

    if (interns.length === 0) {
      return next(customError(404, 'No Interns Enrolled in this Internship'));
    }

    return res.status(200).json(formatedInterns);
  }
  catch (err) {
    return next(err);
  }
}

export const getInternDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const internDetails = await Enrollment.findById(id)
      .populate("intern_id", "name email contact address skills university program")
      .populate("internship_id", "title");

    if (!internDetails) {
      return next(customError(404, 'Details Not Found'));
    }

    return res.status(200).json(internDetails);
  }
  catch (err) {
    return next(err);
  }
}


export const getTaskDetails = async (req, res, next) => {
  try {
    const { intern_id, internship_id } = req.params;

    const submittedTasks = await TaskSubmission.find({ intern_id })
      .select('github_link deployed_link task_id');

    const assignedTasks = await Task.find({ internship_id, isDeleted: false });

    if (!assignedTasks.length && !submittedTasks.length) {
      return next(customError(404, 'Not Found'));
    }

    const submittedTaskIds = submittedTasks
      .filter(task => task.task_id)
      .map(task => task.task_id.toString());

    const tasksWithStatus = assignedTasks.map(task => {
      return {
        ...task.toObject(),
        isSubmitted: submittedTaskIds.includes(task._id.toString()),
        submittedData: submittedTasks.find(t => t.task_id?.toString() === task._id.toString()) || null,
      };
    });

    return res.status(200).json(tasksWithStatus);
  } catch (err) {
    return next(err);
  }
};


export const updateFeedback = async (req, res, next) => {
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









export const testJob = async (req, res, next) => {
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

        const currentDate = new Date(taskDeadline);  
        currentDate.setDate(currentDate.getDate() - 5); 

        // const currentDate = new Date();   /// Current Date  

        const daysLeft = Math.ceil((taskDeadline - currentDate) / (1000 * 60 * 60 * 24));
        const isSubmitted = submittedTaskIds.includes(taskId);

         if (daysLeft < 7 && !isSubmitted) {
          console.log(`Send Email to ${internEmail} for task ${task.title}`);
        }
      }
    }

    res.status(200).json({ message: "Checked all tasks" });
  } catch (err) {
    next(err);
  }
};


export const testEmail = async (req, res, next) => {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change the email service (e.g., 'gmail', 'yahoo', 'outlook')
      auth: {
        user: 'internguruu@gmail.com',
        pass: process.env.APP_PASSWORD
      },
    });

    const info = await transporter.sendMail({
      from: 'internguruu@gmail.com',
      to:'shani.khanani@gmail.com',
      subject:"Check",
      text:"Check"
    });
    console.log('Email sent to successfully!!', info.messageId);
    return info;
  }
  catch (err) {
    console.log(err)
  }
}

export const testPurchase = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', 
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/course/success',
      cancel_url: 'http://localhost:5173/course/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};








/// Task-Api's


export const createInternshipTask = async (req, res, next) => {

  try {

    const { title, internship_id, description, collab } = req.body;

    const newTask = await Task.create({
      title,
      description,
      internship_id,
      collab
    });

    if (!newTask) {
      return next(customError(500, "Task not created!!"));
    }

    return res.status(200).json(newTask);

  } catch (err) {
    return next(err);
  }
};


export const getAllInternshipTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ internship_id: id });
    if (tasks.length === 0) {
      return next(customError(404, "Tasks not found"));
    }
    return res.status(200).json(tasks);
  }
  catch (err) {
    next(err);
  }
}


export const updateInternshipTask = async (req, res, next) => {
  try {

    const { id, ...updateTask } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateTask,
      { new: true }
    );

    if (!updatedTask) {
      return next(customError(404, "Task not found!!"));
    }

    return res.status(200).json(updatedTask);

  } catch (err) {
    return next(err);
  }
};


export const deleteInternshipTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return next(customError(404, "Task not found!!"));
    }

    return res.status(200).json({ message: "Task deleted successfully" });

  } catch (err) {
    return next(err);
  }
}



export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})

    if (users.length === 0) {
      return next(customError(404, 'No Users Found '));
    }
    res.status(200).json(users);
  }
  catch (err) {
    next(err);
  }
}





/// Admin Course Controllers

export const createCourse = async (req, res, next) => {
  try {

    const { title, internship_id, price, price_id, link} = req.body;
    const imgUrl = await imageUploder(req);
  

    const course = {
      title,
      image_url: imgUrl,
      internship_id,
      link,
    }

    if (price && price_id) {
      course.price = price;
      course.price_id = price_id;
      course.type = 'paid'
    }

    const newCourse = await Course.create({
      ...course
    });

    if (!newCourse) {
      return next(customError(500, "Internship not created!!"));
    }
    return res.status(200).json(newCourse);
  } catch (err) {
    return next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const {id,...updateData} = req.body;

    if (req.file) {
      const imgUrl = await imageUploder(req);
      updateData.image_url = imgUrl;
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedCourse) {
      return next(customError(404, "Course not found"));
    }

    return res
      .status(200)
      .json(updatedCourse);
  } catch (err) {
    return next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    // const enrollledCourses = await PurchasedCourse.find({course_id:id})

    // if(enrollledCourses.length > 0) 
    // {
    //   return next(customError(400, 'Interns are enrolled!!!'))
    // }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return next(customError(404, "Course not found!!"));
    }

    return res.status(200).json({ message: "Course Deleted successfully" });

  } catch (err) {
    return next(err);
  }
}

export const getCoursesByInternship = async (req, res, next) => {
  try {
    const { id } = req.params;

    const courses = await Course.find({ internship_id: id });

    if (courses.length === 0) {
      return next(customError(404, 'No Courses in this internship exists!!'));
    }
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};









