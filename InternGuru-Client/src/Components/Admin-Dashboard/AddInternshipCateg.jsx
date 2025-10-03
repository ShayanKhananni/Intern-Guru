import React from "react";
// import { useAddInternshipCategMutation } from "../../Store/admin-api-slice";
import { useNavigate } from "react-router-dom";
import DynamicAddForm from "./DynamicAddForm";
import { useAddInternshipCategMutation } from "../../Store/app-api-slice";


const AddInternshipCateg = () => {


    const [addInternshipCateg,{isLoading}] = useAddInternshipCategMutation()
    const navigate = useNavigate(); 

  const categoryFields = [
    { name: "image", type: "image", required: true },
    { name: "title", type: "text", placeholder: "Category Title", required: true },   
  ];
 
  const handleOnSubmit = async (data) => {
    console.log("Form data:", data);
    try {
      await addInternshipCateg(data).unwrap(); // Waits for the actual resolved value
      navigate("/"); // Only runs if the above doesn't throw
    } catch (err) {
      console.log("Error while adding category:", err);
      // You can optionally show a toast or error message here
    }
  };
  
  return (
    <>
      <DynamicAddForm
        fields={categoryFields} title={"Add Internship Categories"}
        handleOnSubmit={handleOnSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default AddInternshipCateg;
