import expresss from "express";
import { addKanban, applyForInternship, deleteKanban, enrollIntern, generateResume, getCollaborativeTasks,getInternCourses, getInternsTasks, getKanbans, getPurcahseSession, purchaseCourse, submitTask, updateKanban, updateTaskSubmission } from "../controllers/intern-controller.js";
import multer from "multer";
import { validateAccessToken } from "../Middlewares.js";

const internRouter = expresss.Router();
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

// internRouter.use(validateAccessToken)

internRouter.post('/application',applyForInternship)
internRouter.post('/task',upload.none(),submitTask)
internRouter.get('/task/:internship_id/:intern_id',getInternsTasks)
internRouter.put('/task',upload.none(),updateTaskSubmission)
internRouter.get('/course/:internship_id/:intern_id',getInternCourses)
internRouter.post('/course/purchase',purchaseCourse)
internRouter.get('/payment/course/:sessionId',getPurcahseSession)
internRouter.post('/enroll',enrollIntern)
internRouter.get('/collab/:id',getCollaborativeTasks)

internRouter.post('/kanban', addKanban);
internRouter.get('/kanban', getKanbans);
internRouter.put('/kanban/:id', updateKanban);
internRouter.delete('/kanban/:id', deleteKanban);

internRouter.post('/resume',upload.none(),generateResume);








export default internRouter;