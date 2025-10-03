import React from "react";
import DynamicUpdateForm from "./DynamicUpdateForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetInternshipQuery, useUpdateInternshipMutation } from "../../Store/app-api-slice";

const UpdateInternship = () => {
  const { id, cat_id } = useParams();
  const navigate = useNavigate()

  const {
    data: internships = [],
    isLoading,
    error,
  } = useGetInternshipQuery(cat_id);


  const [updateInternship] = useUpdateInternshipMutation()

 const initialInternship = internships.find((internship) => internship._id === id);

  const fields = [
    {
      name: "image",
      type: "image",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
  ];
  
const { title, image_url } = {...initialInternship};

const initialValues = {
  title: title || "",
  image: image_url || ""
};



const handleOnSubmit = async (data) => {
  data.append("id",id);
  data.append("cat_id",cat_id);
  try {
    await updateInternship(data).unwrap();
    navigate(`/internships/${cat_id}`);

  } catch (err) {
    console.log("Error while Updating category:", err);
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

export default UpdateInternship;
