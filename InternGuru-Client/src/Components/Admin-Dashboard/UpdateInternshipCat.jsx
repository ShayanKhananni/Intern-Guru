import React from "react";
import DynamicUpdateForm from "./DynamicUpdateForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetInternshipCategQuery, useUpdateInternshipCategMutation } from "../../Store/app-api-slice";

const UpdateInternshipCat = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const {
    data: categories = [],
    isLoading,
    error,
  } = useGetInternshipCategQuery();

  const [updateInternshipCateg] = useUpdateInternshipCategMutation()
  
  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error fetching data</p>;

  const updateCategory = categories.find((category) => category._id === id);

  if (!updateCategory) return <p>Category not found</p>;


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
  
const { title, image_url } = {...updateCategory};

const initialValues = {
  title: title || "",
  image: image_url || ""
};


const handleOnSubmit = async (data) => {
  data.append("cat_id", id);
  try {
    await updateInternshipCateg(data).unwrap();
    navigate(`/`);
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

export default UpdateInternshipCat;
