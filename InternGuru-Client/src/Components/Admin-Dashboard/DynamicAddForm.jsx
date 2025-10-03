import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../Spinner";

const DynamicAddForm = ({
  fields,
  customStyle,
  title,
  handleOnSubmit,
  isLoading,
  btn,
}) => {

  const [imgPreview, setImgPreview] = useState(null);

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

          case "number":
            schema[field.name] = Yup.number()
              .typeError("Must be a number")
              .moreThan(0, "Must be greater than 0")
              .required(`${field.label || field.name} is required`);
            break;

          case "image":
            schema[field.name] = Yup.mixed().required("Image is required");
            break;

          case "select":
            schema[field.name] = Yup.string()
              .required(`${field.label || field.name} is required`)
              .oneOf(
                field.options?.map((opt) => opt.value),
                "Invalid selection"
              );
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
      formData.append(key, values[key]);
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
        <Form className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-xl mx-auto">
          <h1 className="text-center font-bold text-2xl">{title}</h1>
          
          {fields.map((field, index) => {
            
            if (field.type === "image") {
              return (
                <div
                  key={index}
                  className="items-center justify-center w-full mx-auto"
                >
                  {imgPreview ? (
                    <div className="w-full my-4 relative">
                      <img
                        src={imgPreview}
                        alt="Preview"
                        className="w-full h-64 object-contain"
                      />
                      <button
                        onClick={() => {
                          setImgPreview(null);
                          setFieldValue(field.name, null);
                        }}
                        className="absolute top-0 right-0 lg:right-10 text-white p-1 bg-red-600"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={field.name}
                      className="flex flex-col items-center justify-center w-full mx-auto h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG, or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id={field.name}
                        name={field.name}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImgPreview(URL.createObjectURL(file));
                            setFieldValue(field.name, file);
                          }
                        }}
                      />
                    </label>
                  )}
                  <ErrorMessage name={field.name}>
                    {(msg) => (
                      <div className="text-red-500 text-sm mt-2 text-center">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              );
            }

            if (field.type === "textarea") {
              return (
                <div key={index} className="space-y-2">
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
                    {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
                  </ErrorMessage>
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={index} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="leading-7 text-md text-gray-600 font-bold"
                  >
                    {field.label || field.name}
                  </label>
                  <Field
                    as="select"
                    name={field.name}
                    id={field.name}
                    className={
                      "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }
                  >
                    <option value="">Select {field.label || field.name}</option>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name={field.name}>
                    {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
                  </ErrorMessage>
                </div>
              );
            }

            if (field.type === "checkbox") {
              return (
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <Field
                      type={field.type}
                      name={field.name}
                      id={field.name}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor={field.name}
                      className="text-lg font-medium text-gray-700"
                    >
                      {field.placeholder}
                    </label>
                    <ErrorMessage name={field.name}>
                      {(msg) => (
                        <div className="text-red-500 text-sm">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </>
              );
            }

            const commonProps = {
              name: field.name,
              id: field.name,
              placeholder: field.placeholder || "",
              className:
                field.className ||
                customStyle?.input ||
                "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            };

            return (
              <div key={index} className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="leading-7 text-lg text-gray-600 font-bold"
                >
                  {field.label || field.name}
                </label>
                <Field type={field.type} {...commonProps} />
                <ErrorMessage name={field.name}>
                  {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
                </ErrorMessage>
              </div>
            );
          })}

          <button
            type="submit"
            className={
              customStyle?.button ||
              "bg-green-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            }
          >
            {isLoading ? (
              <Spinner styling={"w-5 h-5 fill-white-600 dark:text-gray-600"} />
            ) : (
              <span>{btn ? btn : "Submit"}</span>
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicAddForm;
