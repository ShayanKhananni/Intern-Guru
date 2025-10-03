import React from "react";
import ApplicationCard from "./ApplicationCard";
import GridContainer from "../Utils-Comp/GridContainer";
import { useParams } from "react-router-dom";
import { useGetApplicationsQuery, useUpdateApplicationMutation } from "../../Store/app-api-slice";


const ViewApplications = () => {
  const { id } = useParams();

  const {
    data: applications = [],
    isLoading,
    error,
  } = useGetApplicationsQuery(id);


  const [updateApplication] = useUpdateApplicationMutation();


  console.log(applications);

  const handleApplication = async ({id,intern_id,internship_id,status}) =>
  {
    const updatedApplicaiton = JSON.stringify({
      id,
      intern_id,
      internship_id,
      status
    })


    await updateApplication(updatedApplicaiton);
  }


  if (isLoading) return <p>Loading applications...</p>;
  if (error) return <p>{error.data.message}</p>;

  return (
    <>
      <GridContainer cols="lg:grid-cols-2 gap-4">
        {applications.map((application) => {

          return (
            <ApplicationCard
              key={application._id}
              name={application.intern.username}
              email={application.intern.email}
              university={application.intern.university}
              contact={application.intern.contact}
              address={application.intern.address}
              photoURL={application.intern.photoURL}
              title={application.internship_title}
              status={application.status}
              onApprove={() =>
                handleApplication({
                  id: application.id,
                  intern_id: application.intern.id,
                  internship_id: application.internship_id,
                  status:"approved"
                })
              }
              
              onReject={() =>
                handleApplication({
                  id: application.id,
                  intern_id: application.intern.id,
                  internship_id: application.internship_id,
                  status:"rejected"
                })}
            >
            </ApplicationCard>
          );
        })}
      </GridContainer>
    </>
  );
};

export default ViewApplications;
