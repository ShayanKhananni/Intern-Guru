import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApplicationDialog from "./AppplicationDialog"; // fixed name
import { useApplyForInternshipMutation } from "../../Store/app-api-slice";
import TaskSubDialog from "../Intern-Components/TaskSubDialog";
import UpdatePofDialog from "../Intern-Components/UpdatProfDialog";
import TaskUpdateDialog from "../Intern-Components/TaskUpdateDialog";

const Control = ({ application, internshipId, submitTask, updateTask, taskDetails, internId }) => {


  const [updateProfileState, setUpdateProfileState] = useState(false);
  const [applicationState, setApplicationState] = useState(false);
  const [activeDialog, setActiveDialogState] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const [applyForInternship] = useApplyForInternshipMutation();

  const apply = () => {
    const requiredFields = [
      "username",
      "email",
      "contact",
      "fathername",
      "address",
      "university",
      "program",
    ];
    const allExist = requiredFields.every((field) => user?.[field]);

    if (allExist) {
      setApplicationState(true);
    } else {
      setUpdateProfileState(true);
    }
  };

  const handleApply = async () => {
    const application = JSON.stringify({
      internship_id: internshipId,
      intern_id: user._id,
    });
    try {
      await applyForInternship(application);
      setApplicationState(false);
    } catch (err) {
      setApplicationState(false);
    }
  };


  return (
    <>
      {user.role === "intern" && (
        <>
          {application && (
            <>
              <button
                onClick={apply}
                className="bg-green-700 w-full text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-all"
              >
                Apply
              </button>

              <UpdatePofDialog
                handleCancel={() => setUpdateProfileState(false)}
                open={updateProfileState}
                setOpen={setUpdateProfileState}
              />

              <ApplicationDialog
                open={applicationState}
                setOpen={setApplicationState}
                title="Confirm Application"
                fields={[
                  { label: "Name", key: "username" },
                  { label: "Email", key: "email" },
                  { label: "Program", key: "program" },
                ]}
                primaryActionLabel="Apply"
                primaryActionHandler={handleApply}
                secondaryActionLabel="Edit"
                secondaryActionHandler={setUpdateProfileState}
              />
            </>
          )}

          {submitTask && (
            <>
              <button
                type="button"
                onClick={() => setActiveDialogState(true)}
                className="bg-green-700 text-white h-10 my-auto mx-4 px-4 py-2 rounded hover:bg-green-800 transition duration-200"
              >
                Submit
              </button>

              <TaskSubDialog
                taskId={taskDetails._id}
                handleCancel={() => setActiveDialogState(false)}
                setOpen={setActiveDialogState}
                open={activeDialog}
              />
            </>
          )}

          {updateTask && (
            <>
              <button
                type="button"
                onClick={() => setActiveDialogState(true)}
                className="bg-green-700 text-white h-10 my-auto mx-4 px-4 py-2 rounded hover:bg-green-800 transition duration-200"
              >
                Edit
              </button>

              <TaskUpdateDialog
                handleCancel={() => setActiveDialogState(false)}
                setOpen={setActiveDialogState}
                open={activeDialog}
                taskDetails={taskDetails} 
                internId={internId}
              />
            </>
          )}

        </>
      )}
    </>
  );
};

export default Control;
