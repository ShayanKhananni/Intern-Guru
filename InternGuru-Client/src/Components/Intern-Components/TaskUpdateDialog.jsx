import React, { useState } from "react";
import DynamicDialgForm from "../Utils-Comp/DynamicDialgForm";
import { useUpdateTaskSubmissionMutation } from "../../Store/app-api-slice";

const TaskUpdateDialog = ({ open, setOpen, handleCancel, taskDetails, internId }) => {
  const [updateTaskSubmission] = useUpdateTaskSubmissionMutation();



  const handleOnSubmit = async (data) => {
    try {
      data.append("id",taskDetails.submission_id)
      data.append("intern_id",internId)
      data.append("status",'pending')
      
      await updateTaskSubmission(data).unwrap(); // Don't forget to `await`!
      handleCancel();
    } catch (err) {
      console.error("Submission error:", err);
      handleCancel();
    }
  };


  const fields = [
    { name: "github_link", type: "text", required: true },
    { name: "deployed_link", type: "text" },
  ];

  const { github_link, deployed_link } = taskDetails;

  return (
    <>
      <DynamicDialgForm
        title={"Update Task"}
        handleOnSubmit={handleOnSubmit}
        handleCancel={handleCancel}
        open={open}
        setOpen={setOpen}
        fields={fields}
        btn={"Eidt Task "}
      />
    </>
  );
};

export default TaskUpdateDialog;
