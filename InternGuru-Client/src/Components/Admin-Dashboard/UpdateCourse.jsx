import React from "react";
import DynamicUpdateForm from "./DynamicUpdateForm";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAdminCoursesQuery, useGetInternshipCategQuery, useUpdateCourseMutation, useUpdateInternshipCategMutation } from "../../Store/app-api-slice";

const UpdateCourse = () => {
  const { id, internship_id } = useParams();
  const navigate = useNavigate()
  const {
    data: courses = [],
    isLoading,
    error,
  } = useGetAdminCoursesQuery(internship_id);
  
  console.log(courses);
  const [updateCourse] = useUpdateCourseMutation()

  const course = courses.find((course) => course._id === id);

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
    {
      name: "price_id",
      type: "text",
    },

    {
      name: "price",
      type: "number",
    },

  ];
    
const { title, image_url, price, price_id } = {...course};

const initialValues = {
  title: title || "",
  image: image_url || "",
  price: price || "",
  price_id: price_id || ""
};


  const handleOnSubmit = async (formData) => {
    const updatedFormData = new FormData();
    updatedFormData.append("internship_id", internship_id);
    updatedFormData.append("id", id);
    
    for (const [key, value] of formData.entries()) {
      if (key === "image") {
        if (value instanceof File && value !== initialValues.image) {
          updatedFormData.append("image", value);
        }
      } else if (value !== initialValues[key]) {
        updatedFormData.append(key, value);
      }
    }
    try {
      await updateCourse(updatedFormData).unwrap();
      navigate(`/admin/view/courses/${internship_id}`);
    } catch (err) {
      console.log("Error while Updaing Course:", err);

    }
  };


  return (
    <>
      <DynamicUpdateForm
        initValues={initialValues}
        fields={fields}
        title={"Update Course"}
        handleOnSubmit={handleOnSubmit}
      />
    </>
  );
};

export default UpdateCourse ;
