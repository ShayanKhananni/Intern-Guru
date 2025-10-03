import React from "react";
// import { useAddInternshipCategMutation } from "../../Store/admin-api-slice";
import { Form, useNavigate, useParams } from "react-router-dom";
import DynamicAddForm from "./DynamicAddForm";
import { useAddTaskMutation } from "../../Store/app-api-slice";


const AddTask = () => {

    const [addTask,{isLoading}] = useAddTaskMutation()
    const navigate = useNavigate(); 
    const {id} = useParams();

  const categoryFields = [
    { name: "title", type: "text", placeholder: "Category Title", required: true },
    { name: "description", type: "textarea", placeholder: "Category Title", required: true },
    { name: "collab", type:"checkbox", placeholder:'Collabrative', }
  ];

  const handleOnSubmit = async (data) => {
    data.append("internship_id",id);
    try {
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
      await addTask(data).unwrap()
      navigate(`/admin/view/tasks/${id}`); // Only runs if the above doesn't throw
    } catch (err) {
      console.log("Error while adding category:", err);
    }
  };
  
  return (
    <>
      <DynamicAddForm
        fields={categoryFields} title={"Add Internship Task"}
        handleOnSubmit={handleOnSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default AddTask;
