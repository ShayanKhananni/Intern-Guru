import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DynamicAddForm from "./DynamicAddForm";
import { useAddCourseMutation, useAddInternshipMutation } from "../../Store/app-api-slice";

const AddCourse = () => {

  const [addCourse,{isLoading}] = useAddCourseMutation();

  const navigate = useNavigate();
    const { id } = useParams();

    const courseFields = [
      { name: "image", type: "image", required: true },
      { name: "title", type: "text", placeholder: "Add Course Title", required: true },
      { name: "price", type: "number", placeholder: "Add Price",},
      { name: "price_id", type: "text", placeholder: "Add Stripe Price Id",},
      { name: "link", type: "text", placeholder: "Add Redirect Link", required: true},
    ];
    
    const handleOnSubmit = async (data) => {

      data.append("internship_id", id);
      
      // Log all form data entries
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
      try {
        await addCourse(data).unwrap();
        navigate(`/admin/view/courses/${id}`);
      } catch (err) {
        console.log("Error while adding category:", err);
      }
    };
    

  return (
    <>
      <DynamicAddForm
        title={"Add Courses"}
        fields={courseFields}
        handleOnSubmit={handleOnSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default AddCourse;
