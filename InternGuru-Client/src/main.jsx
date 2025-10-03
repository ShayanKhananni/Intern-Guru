import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ProtectedRoute from "./Middlewares/ProtectedRoute";
import AuthRoutes from "./Middlewares/AuthRoutes";
import Profile from "./Pages/Profile";
import AdminRoutes from "./Middlewares/AdminRoutes";
import AddInternshipCateg from "./Components/Admin-Dashboard/AddInternshipCateg";
import AddInternship from "./Components/Admin-Dashboard/AddInternship";
import AddTask from "./Components/Admin-Dashboard/AddTask";
import InternshipsCat from "./Components/Utils-Comp/InternshipsCat";
import UpdateInternshipCat from "./Components/Admin-Dashboard/UpdateInternshipCat";
import UpdateInternship from "./Components/Admin-Dashboard/UpdateInternship";
import Options from "./Components/Admin-Dashboard/Options";
import InternshipsByCat from "./Components/Utils-Comp/InternshipsByCat";
import Internships from "./Components/Admin-Dashboard/Internships";
import ViewTasks from "./Components/Admin-Dashboard/ViewTasks";
import UpdateTask from "./Components/Admin-Dashboard/UpdateTask";
import ViewApplications from "./Components/Admin-Dashboard/ViewApplications";
import InternViewTasks from "./Components/Intern-Components/InternViewTask";
import ViewInterns from "./Components/Admin-Dashboard/ViewInterns";
import ViewProgress from "./Components/Admin-Dashboard/ViewProgress";
import CourseSuccess from "./Components/Intern-Components/CourseSuccess";
import CourseFailure from "./Components/Intern-Components/CourseFailure";
import AdminViewCourses from "./Components/Admin-Dashboard/AdminViewCourses";
import AddCourse from "./Components/Admin-Dashboard/AddCourse";
import UpdateCourse from "./Components/Admin-Dashboard/UpdateCourse";
import InternViewCourses from "./Components/Intern-Components/InternViewCourses";
import CollabSpace from "./Components/Intern-Components/Collabrative-Space/CollabSpace";
import CollabSpaceBoard from "./Components/Intern-Components/Collabrative-Space/CollabSpaceBoard";
import { CollabProvider } from "./Components/Intern-Components/Collabrative-Space/CollabProvider";
import ResumeBuilder from "./Components/Intern-Components/Resume-Builder/ResumeBuilder";
import PortfolioBuilder from "./Components/Intern-Components/Portfolio-Builder/PortfolioBuilder";
import Portfolio from "./Components/Intern-Components/Portfolio-Builder/Portfolio";

const routes = [
  {
    
    element: <CollabProvider>
    <App/>
    </CollabProvider>,
    children: [
      
      { path: "/portfolio/:id", element: <Portfolio /> },
      
      {
        element: <AuthRoutes />,
        children: [
          { path: "/signin", element: <SignIn /> },
          { path: "/signup", element: <SignUp /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          
          { path: "/portfolio/builder", element: <PortfolioBuilder /> },
          { path: "/", element: <InternshipsCat /> },
          { path: "/profile", element: <Profile /> },
          { path: "/internships/:id", element: <InternshipsByCat /> },
          { path: "/view/courses/:id", element: <InternViewCourses /> },
          
          { path: "collab/space", element: <CollabSpace /> },
          { path: "collab/board/:id", element: <CollabSpaceBoard /> },

          { path: "/view/tasks/:id", element: <InternViewTasks /> },
          { path: "/payment/success", element: <CourseSuccess /> },
          { path: "/payment/cancel", element: <CourseFailure /> },
          { path: "/resume", element: <ResumeBuilder/> },

        ],
      },

      {
        element: <AdminRoutes />,
        children: [
          {
            path: "/admin/add/internship-categ",
            element: <AddInternshipCateg />,
          },
          {
            path: "/admin/update-category/:id",
            element: <UpdateInternshipCat />,
          },

          {
            path: "/admin/update-internship/:id/:cat_id",
            element: <UpdateInternship />,
          },
          { path: "/admin/add/internship/:id", element: <AddInternship /> },
          { path: "/admin/add/task/:id", element: <AddTask /> },
          { path: "/admin/option/:id", element: <Options /> },

          {
            path: "/admin/applications",
            element: <Internships applications={true} />,
          },
          {
            path: "/admin/view/applications/:id",
            element: <ViewApplications />,
          },

          { path: "/admin/interns", element: <Internships interns={true} /> },
          { path: "/admin/view/interns/:id", element: <ViewInterns /> },
          {
            path: "/admin/view/intern/progress/:intern_id/:internship_id",
            element: <ViewProgress />,
          },

          { path: "/admin/tasks", element: <Internships tasks={true} /> },
          { path: "/admin/view/tasks/:id", element: <ViewTasks /> },
          { path: "/admin/add/task/:id", element: <AddTask /> },
          {
            path: "/admin/update/task/:id/:internship_id",
            element: <UpdateTask />,
          },

          { path: "/admin/courses", element: <Internships courses={true} /> },
          { path: "/admin/view/courses/:id", element: <AdminViewCourses /> },
          { path: "/admin/add/course/:id", element: <AddCourse /> },
          {
            path: "/admin/update/course/:id/:internship_id",
            element: <UpdateCourse />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
