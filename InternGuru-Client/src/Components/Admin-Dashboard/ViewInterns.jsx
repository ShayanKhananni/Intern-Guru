import React from "react";
import ApplicationCard from "./ApplicationCard";
import GridContainer from "../Utils-Comp/GridContainer";
import { useParams } from "react-router-dom";
import { useGetApplicationsQuery, useGetInternsQuery, useUpdateApplicationMutation } from "../../Store/app-api-slice";
import InternCard from "./InternCard";


const ViewInterns = () => {


  const { id } = useParams();

  const {
    data: interns = [],
    isLoading,
    error,
  } = useGetInternsQuery(id);


  console.log(interns)


  if (isLoading) return <p>Loading Interns....</p>;
  if (error) return <p>{error.data.message}</p>;

  return (
    <>
      <GridContainer cols="lg:grid-cols-2 gap-4">
        {interns.map((intern) => {
          return (
            <InternCard intern={intern}  />
          );
        })}
      </GridContainer>
    </>
  );
};

export default ViewInterns;
