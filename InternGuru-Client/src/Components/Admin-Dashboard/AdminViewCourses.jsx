import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AddButton from "../Utils-Comp/AddButton";
import GridContainer from "../Utils-Comp/GridContainer";
import Control from "../Utils-Comp/Control";

import TaskCard from "./TaskCard";
import AdminControl from "../Admin-Dashboard/AdminControl";
import {
  useDeleteCourseMutation,
  useDeleteTaskMutation,
  useGetAdminCoursesQuery,
  useGetTasksByInternshipQuery,
} from "../../Store/app-api-slice";
import CourseCard from "../Utils-Comp/AdminCourseCard";
import AdminCourseCard from "../Utils-Comp/AdminCourseCard";

const AdminViewCourses = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);


  const { data: courses = [], isLoading, error } = useGetAdminCoursesQuery(id);


  const [deleteCourse] = useDeleteCourseMutation();

  return (
    <>
      <AddButton text={"Add Courses"} to={`/admin/add/course/${id}`} />

      <GridContainer direction="row">
        {courses.map((course) => (
          <AdminCourseCard
            key={course._id}
            internshipId={id}
            title={course.title}
            img_url={course.image_url}
            type={course.type}
            price={course.price}
            link={course.link}
          >
            <AdminControl
              deleteFunction={() => 
              {
                deleteCourse({id: course._id, internship_id: id})
              }}
              updateLink={`/admin/update/course/${course._id}/${id}`}
              editStyle={"w-full"}
            />
          </AdminCourseCard>
        ))}
      </GridContainer>
    </>
  );
};

export default AdminViewCourses;
