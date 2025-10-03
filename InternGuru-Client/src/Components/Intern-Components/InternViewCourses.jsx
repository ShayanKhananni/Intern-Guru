import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import GridContainer from "../Utils-Comp/GridContainer";
import {
  useGetInternCoursesQuery,
} from "../../Store/app-api-slice"
;
import CourseCard from "./CourseCard";

const InternViewCourses = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);


    const {
      data: courses = [],
      isLoading,
      error,
    } = useGetInternCoursesQuery({ intern_id: user._id, internship_id: id });


  return (
    <>
      <GridContainer direction="row">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            internshipId={id}
            title={course.title}
            img_url={course.image_url}
            type={course.type}
            price_id={course.price_id}
            price={course.price}
            link={course.link}
            isPurchased={course.purchased}
          ></CourseCard>
        ))}
      </GridContainer>
    </>
  );
};

export default InternViewCourses;
