import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { HiPencilAlt } from "react-icons/hi";

const DynamicUpdateForm = ({
  fields,
  customStyle,
  title,
  handleOnSubmit,
  initValues,
  modal,
  btn,
}) => {
  const [imgPreview, setImgPreview] = useState(initValues?.image || null);

  useEffect(() => {
    if (initValues?.image) {
      if (typeof initValues.image === "string") {
        setImgPreview(initValues.image);
      } else if (initValues.image instanceof File) {
        setImgPreview(URL.createObjectURL(initValues.image));
      }
    } else {
      setImgPreview(null);
    }
  }, [initValues]);

  const initialValues = fields.reduce((acc, field) => {
    const isImageField = field.name === "image" || field.type === "profImage";
    acc[field.name] = initValues?.[field.name] || (isImageField ? null : "");
    return acc;
  }, {});

  const validationSchema = Yup.object(
    fields.reduce((schema, field) => {
      if (field.required) {
        switch (field.type) {
          case "email":
            schema[field.name] = Yup.string()
              .email("Invalid email")
              .required("Email is required");
            break;
          case "number":
            schema[field.name] = Yup.number()
              .typeError("Must be a number")
              .required("Number is required");
            break;
          case "image":
            schema[field.name] = Yup.mixed().test(
              "fileOrUrl",
              "Image is required",
              (value) =>
                value instanceof File ||
                typeof value === "string" ||
                !!imgPreview
            );
            break;
          default:
            schema[field.name] = Yup.string().required(
              `${field.label || field.name} is required`
            );
        }
      }
      return schema;
    }, {})
  );

  const handleSubmit = (values) => {
    const formData = new FormData();
    for (const key in values) {
      const value = values[key];
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    }

    handleOnSubmit(formData);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, dirty, isValid }) => (
        <Form
          className={`${
            modal ? "" : "bg-white p-6 rounded-xl shadow-md space-y-4 max-w-xl mx-auto"
          }`}
        >
          <h1 className="text-center font-bold text-2xl">{title}</h1>

          {fields.map((field, index) => {
            if (field.name === "image") {
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
                        className={`object-contain ${
                          field.type === "profImage"
                            ? "w-40 h-40 rounded-full mx-auto"
                            : "w-full h-64"
                        }`}
                      />
                      <button
                        onClick={() => {
                          setImgPreview(null);
                          setFieldValue(field.name, null);
                        }}
                        className="absolute top-0 right-0 lg:right-10 text-white p-1 bg-green-600"
                        type="button"
                      >
                        <HiPencilAlt />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={field.name}
                      className={`flex flex-col items-center justify-center ${
                        field.type === "profImage"
                          ? "w-40 h-40 rounded-full"
                          : "w-full h-60 rounded-lg"
                      } mx-auto border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          SVG, PNG, JPG
                        </p>
                      </div>
                      <input
                        id={field.name}
                        name={field.name}
                        type="file"
                        accept="image/*"
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
            disabled={!dirty || !isValid || isSubmitting}
            className={`w-full ${
              dirty && isValid && !isSubmitting
                ? customStyle?.button || "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-6 py-2 rounded-md transition`}
          >
            {isSubmitting ? "Updating..." : btn || "Update"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicUpdateForm;
