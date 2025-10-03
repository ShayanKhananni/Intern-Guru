import React from "react";
import DynamicUpdateForm from "./DynamicUpdateForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetInternshipQuery, useGetTasksByInternshipQuery, useUpdateTaskMutation } from "../../Store/app-api-slice";

const UpdateTask = () => {
  const { id, internship_id } = useParams();
  const navigate = useNavigate()



  const {
    data: tasks = [],
    isLoading,
    error,
  } = useGetTasksByInternshipQuery(internship_id);


 const [updateTask] = useUpdateTaskMutation()

 const initialTask = tasks.find((task) => task._id === id);
 
 
  const fields = [
     {
      name: "title",
      type: "text",
      required: true,
    },

    {
      name: "description",
      type: "textarea",
      required: true,
    },
    

  ];
  
const { title, description } = {...initialTask};

const initialValues = {
  title: title || "",
  description: description || ""
};


const handleOnSubmit = async (data) => {
  data.append("id",id);
  data.append("internship_id",internship_id);
  try {
    await updateTask(data);
    navigate(`/admin/view/tasks/${internship_id}`);
  } catch (err) {
    console.log("Error while adding category:", err);
  }
};


  return (
    <>
      <DynamicUpdateForm
        initValues={initialValues}
        fields={fields}
        title={"Update Internship Task"}
        handleOnSubmit={handleOnSubmit}
      />
    </>
  );
};

export default UpdateTask;
