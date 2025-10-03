import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DynamicAddForm from "./DynamicAddForm";
import { useAddInternshipMutation } from "../../Store/app-api-slice";

const AddInternship = () => {
  const [addInternship,{isLoading}] = useAddInternshipMutation();
  const navigate = useNavigate();
    const { id } = useParams();

    const internshipFields = [
      { name: "image", type: "image", required: true },
      { name: "title", type: "text", placeholder: "Add Internship Title", required: true },
      { name: "duration_value", type: "number", placeholder: "Add Duration Value", required: true },
      {
        name: "duration_unit",
        type: "select",
        label: "unit",
        required: true,
        options: [
          { label: "months", value: "months" },
        ]
      }
    ];
    
    const handleOnSubmit = async (data) => {
      data.append("cat_id", id);
    
      // Log all form data entries
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
    
      try {
        await addInternship(data).unwrap();
        navigate(`/internships/${id}`);
      } catch (err) {
        console.log("Error while adding category:", err);
      }
    };
    
  return (
    <>
      <DynamicAddForm
        title={"Add Internship"}
        fields={internshipFields}
        handleOnSubmit={handleOnSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default AddInternship;
