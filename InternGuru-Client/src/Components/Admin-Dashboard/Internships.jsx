import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetAllInternshipQuery,
  useGetInternshipQuery,
} from "../../Store/app-api-slice";

import AdminControl from "../Admin-Dashboard/AdminControl";
import GridContainer from "../Utils-Comp/GridContainer";
import InternshipCard from "../Utils-Comp/InternshipCard";

const Internships = ({ tasks, interns, applications, courses }) => {
  const { user } = useSelector((state) => state.auth);

  const {
    data: internships = [],
    isLoading,
    error,
  } = useGetAllInternshipQuery();

  return (
    <>
      {error && error.status === 404 ? (
        <h1 className="text-center">{error.data.message}</h1>
      ) : (
        <GridContainer direction="row">
          {internships.map((internship) => (
            <InternshipCard
              key={internship._id}
              internshipId={internship._id}
              title={internship.title}
              img_url={internship.image_url}
            >
              {user.role === "admin" && (
                <AdminControl
                  removeEdit={true}
                  internshipId={internship._id}
                  interns={interns}
                  applications={applications}
                  tasks={tasks}
                  courses={courses}
                />
              )}
            </InternshipCard>
          ))}
        </GridContainer>
      )}
    </>
  );
};

export default Internships;
