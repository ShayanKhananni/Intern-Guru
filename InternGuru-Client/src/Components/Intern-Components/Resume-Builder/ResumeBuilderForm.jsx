import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import Spinner from "../../Spinner";
import MultiValueComp from "./MultiValueComp";

const ResumeBuilderForm = ({
  fields,
  customStyle,
  title,
  handleOnSubmit,
  isLoading,
  btn,
}) => {
  const [educationState, setEducationState] = useState([]);
  const [experienceState, setExperienceState] = useState([]);

  const [skillState, setSkillState] = useState(null);



  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "image" ? null : "";
    return acc;
  }, {});


  const validationSchema = Yup.object(
    fields.reduce((schema, field) => {
      if (field.required) {
        switch (field.type) {


          case "email":
            schema[field.name] = Yup.email()
              .email("Invalid email")
              .required("Email is Required");
            break;

          case "multiValue":
            schema[field.name] = Yup.array()
              .min(1, `${field.label || field.name} is required`)
              .required(`${field.label || field.name} is required`);
            break;

          default:
            schema[field.name] = Yup.string().required(
              `${field.name} is required`
            );
            break;
        }
      }
      return schema;
    }, {})
  );



  const handleSubmit = (values) => {
    const formData = new FormData();
  
    for (const key in values) {
      const value = values[key];
  
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value)); // serialize objects/arrays
      } else {
        formData.append(key, value); // primitive values
      }
    }
    handleOnSubmit(formData);
  };
  



  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
          <h1 className="text-center font-bold text-3xl text-gray-800">
            {title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map((field, index) => {
              if (field.type === "textarea") {
                return (
                  <div key={index} className="col-span-full">
                    <label
                      htmlFor={field.name}
                      className="block text-lg font-medium text-gray-700"
                    >
                      {field.label || field.name}
                    </label>
                    <Field
                      as="textarea"
                      name={field.name}
                      id={field.name}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name={field.name}>
                      {(msg) => (
                        <div className="text-red-500 text-sm">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>
                );
              }

              if (field.type === "multi-valued") {
                return (
                  <>
                    <MultiValueComp field={field} />
                  </>
                );
              }

              // Default case: input field
              return (
                <div key={index}>
                  <label
                    htmlFor={field.name}
                    className="block text-lg font-medium text-gray-700"
                  >
                    {field.label || field.name}
                  </label>
                  <Field
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder || ""}
                    className={
                      field.className ||
                      customStyle?.input ||
                      "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }
                  />
                  <ErrorMessage name={field.name}>
                    {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
                  </ErrorMessage>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className={
              customStyle?.button ||
              "bg-green-600 ms-auto block text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
            }
          >
            {isLoading ? (
              <Spinner styling="w-5 h-5 fill-white dark:text-gray-300" />
            ) : (
              <span>{btn || "Submit"}</span>
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ResumeBuilderForm;
