import { useFormikContext, ErrorMessage } from "formik";
import React, { useRef, useState } from "react";

const MultiValueComp = ({ field }) => {
  const { setFieldValue, values } = useFormikContext();
  const isArrayType = field.data_type === "array";

  const inputRefs = useRef({});
  field.keys.forEach((key) => {
    if (!inputRefs.current[key]) {
      inputRefs.current[key] = React.createRef();
    }
  });

  const [localList, setLocalList] = useState(values[field.name] || []);

  const handleAdd = () => {
    if (isArrayType) {
      const val = inputRefs.current[field.keys[0]].current?.value.trim();
      if (!val) {
        alert(`Please enter ${field.keys[0]}`);
        return;
      }

      const updatedValues = [...(values[field.name] || []), val];
      setFieldValue(field.name, updatedValues);
      setLocalList(updatedValues);
      inputRefs.current[field.keys[0]].current.value = "";
    } else {
      const newEntry = {};
      for (let key of field.keys) {
        const val = inputRefs.current[key].current?.value.trim();
        if (!val) {
          alert(`Please fill in ${key}`);
          return;
        }
        newEntry[key] = val;
      }

      const updatedValues = [...(values[field.name] || []), newEntry];
      setFieldValue(field.name, updatedValues);
      setLocalList(updatedValues);

      field.keys.forEach((key) => {
        if (inputRefs.current[key].current) {
          inputRefs.current[key].current.value = "";
        }
      });
    }
  };

  return (
    <div className="space-y-4 bg-gray-300 p-3 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 capitalize">
        {field.label || field.name}
      </h2>

      <div>
        {field.keys.map((key) => (
          <div key={`${field.name}.${key}`} className="space-y-2">
            <label
              htmlFor={`${field.name}.${key}`}
              className="block text-lg font-medium text-gray-700"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>

            <input
              type="text"
              name={`${field.name}.${key}`}
              ref={inputRefs.current[key]}
              placeholder={`Please enter ${key}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="button"
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Add {field.name}
        </button>
      </div>

      {/* Preview list */}
      {localList.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {localList.map((item, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
            >
              {isArrayType ? (
                <span>{item}</span>
              ) : (
                <>
                  <strong>{field.keys[0]}:</strong> <span>{item[field.keys[0]]}</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ErrorMessage name={field.name}>
        {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
      </ErrorMessage>
    </div>
  );
};

export default MultiValueComp;
