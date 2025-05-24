import express from "express";
import { getAllInternship, getAllInternshipCateg, getInternshipByCateg, getInternshipDuration, getUserName,  } from "../controllers/app-controller.js";

import { validateAccessToken } from "../Middlewares.js";

const appRouter = express.Router();


appRouter.get('/internship-categories',getAllInternshipCateg);
appRouter.get('/internship/:id',getInternshipByCateg);
appRouter.get('/all/internship',getAllInternship);
appRouter.get('/internship/duration/:id',getInternshipDuration);
appRouter.get('/getUsername/:id',getUserName);


export default appRouter;