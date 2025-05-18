import expresss from "express";
import { applyForInternship, enrollIntern, getInternCourses, getInternsTasks, getPurcahseSession, purchaseCourse, submitTask, updateTaskSubmission } from "../controllers/intern-controller.js";
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



export default internRouter;