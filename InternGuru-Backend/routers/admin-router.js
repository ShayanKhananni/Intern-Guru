import express from 'express';
import { createInternship,createInternshipCateg, getApplications, getApplicationDetails, updateApplication, getAllInterns, getInternsByInternship, createInternshipTask, getAllInternshipTasks, updateInternshipTask, deleteInternshipTask, deleteInternshipAndCascade, getInternDetails, getAllUsers, getTaskDetails, deleteInternshipCateg, updateInternshipCateg, updateInternship, updateFeedback, testJob, testEmail, testPurchase, getCoursesByInternship, createCourse, deleteCourse, updateCourse} from '../controllers/admin-controller.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage:storage});
const adminRouter = express.Router();


// adminRouter.use(validateAdminToken)

/// Internship-Category Routes

adminRouter.post('/internship-categories',upload.single('image'),createInternshipCateg);
adminRouter.delete('/internship-categories/:id',deleteInternshipCateg,);
adminRouter.put('/internship-categories',upload.single('image'),updateInternshipCateg);


/// Internship + Task Module Api's


/// Internship-Routes
adminRouter.post('/internship',upload.single('image'),createInternship);
adminRouter.delete('/internship/:id',deleteInternshipAndCascade);
adminRouter.put('/internship',upload.single('image'),updateInternship);



/// Task-Routes
adminRouter.post('/task',upload.none(),createInternshipTask);
adminRouter.get('/task/:id',getAllInternshipTasks);
adminRouter.put('/task',upload.none(),updateInternshipTask);
adminRouter.delete('/task/:id',deleteInternshipTask);


/// Application Routes
adminRouter.get('/application/:id',getApplications);
adminRouter.get('/application-details/:id',getApplicationDetails);
adminRouter.put('/application',updateApplication);


// Admin-Intern-Routes
adminRouter.get('/intern',getAllInterns);
adminRouter.get('/intern/:id',getInternsByInternship);
adminRouter.get('/intern-details/:id',getInternDetails)
// adminRouter.get('/intern-task/:intern_id/:internship_id',getTaskDetails)
adminRouter.get('/intern-task/:intern_id/:internship_id',getTaskDetails)
adminRouter.put('/intern/task',upload.none(),updateFeedback)


adminRouter.get('/users',getAllUsers)

adminRouter.get('/test/email',testEmail);


adminRouter.post('/test/purchase',testPurchase);




// Admin-Course Routes
adminRouter.get('/course/:id',getCoursesByInternship)
adminRouter.post('/course',upload.single('image'),createCourse)
adminRouter.put('/course',upload.single('image'),updateCourse)
adminRouter.delete('/course/:id',deleteCourse)


export default adminRouter;

