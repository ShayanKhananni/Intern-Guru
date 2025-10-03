import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../Components/Spinner";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaRegEyeSlash } from "react-icons/fa";
import { useSignupUserMutation } from "../Store/auth-api-slice";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupUser, { isLoading }] = useSignupUserMutation();
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Invalid Email Format")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      )
      .required("Password is required"),
  });

  const handleonSubmit = async (values, { setSubmitting }) => {
    try {
      await signupUser(values).unwrap();
      toast.success("Signup successful!");
      navigate("/signin");
    } catch (err) {
      toast.error(err?.data?.message || "Sign-up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container justify-center px-5 mx-auto flex flex-wrap items-center">
        <div className="lg:w-2/6 sm:w-2/4 lg:md-0 m-auto rounded-lg p-8 flex flex-col w-full ">
          <h2 className="text-gray-900 text-3xl font-bold font-primary text-center mb-5">
            Sign up
          </h2>

          <Formik
            method="POST"
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleonSubmit}
          >
            {({ isSubmitting }) => (
              <Form autoComplete="off">
                <div className="relative mb-4">
                  <label
                    htmlFor="username"
                    className="leading-7 text-md text-gray-600 font-bold"
                  >
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    name="username"
                    className="w-full bg-gray-100 font-semibold rounded border-none placeholder-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <div className="relative mb-4">
                  <label
                    htmlFor="email"
                    className="leading-7 text-md text-gray-600 font-bold"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    name="email"
                    className="w-full bg-gray-100 font-semibold rounded border-none placeholder-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <div className="relative mb-4">
                  <label
                    htmlFor="password"
                    className="leading-7 text-md text-gray-600 font-bold"
                  >
                    Password
                  </label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Password"
                    name="password"
                    className="w-full bg-gray-100 font-semibold rounded border-none placeholder-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out pr-10" // Add padding for icon
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash size={20} />
                    ) : (
                      <FaRegEye size={20} />
                    )}
                  </button>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white w-full font-semibold font-primary bg-green-700 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  {isLoading ? (
                    <Spinner
                      styling={"w-10 h-10 fill-white-600  dark:text-gray-600"}
                    />
                  ) : (
                    "Signup"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-3 text-black me-1">
            Already have an Account{" "}
            <Link className="text-blue-500" to="/signin">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
