import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { Link} from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "../Components/Spinner";
import { FaRegEye } from "react-icons/fa";
import {toast } from "react-toastify";
import { FaRegEyeSlash } from "react-icons/fa";
import { useSigninUserMutation } from "../Store/auth-api-slice";
import { authActions } from "../Store/auth-slice";


const SignIn = () => {

const [showPassword, setShowPassword] = useState(false);
const dispatch = useDispatch();
const [signinUser,{isLoading}] = useSigninUserMutation()
  
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Invalid Email Format")
     .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  
  const handleonSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await signinUser(values).unwrap(); 
      dispatch(authActions.setUser(response)); 
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err?.data?.message || "Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  
  return (
    <>
      <section class="text-gray-600 body-font">
        <div class="container justify-center px-5 mx-auto flex flex-wrap items-center">
          <div class="lg:w-2/6 sm:w-2/4  lg:md-0 m-auto rounded-lg p-8 flex flex-col w-full ">
            <h2 class="text-gray-900 text-3xl font-bold font-primary text-center mb-5">
              Login
            </h2>

            <Formik
              method="POST"
              initialValues={initialValues}
              onSubmit={handleonSubmit}
              validationSchema={validationSchema}
            >
              {({ isSubmitting }) => (
                <Form autoComplete="off">
                  <div class="relative mb-4">
                    <label
                      for="email"
                      class="leading-7 text-md text-gray-600 font-bold"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      placeholder="Enter Email"
                      name="email"
                      class="w-full bg-gray-100 font-semibold rounded border-none placeholder-black  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
                    class="text-white font-semibold font-primary bg-green-700 border-0 py-2 px-8 focus:outline-none w-full hover:bg-indigo-600 rounded text-lg"
                    disabled={isSubmitting}
                  >
                    {isLoading ? (
                      <Spinner
                        styling={"w-10 h-10 fill-white-600  dark:text-gray-600"}
                      />
                    ) : (
                      "Login"
                    )}
                  </button>

                </Form>
              )}
            </Formik>

            {/* {error ? <p className="text-red-500 text-lg">{error}</p> : null} */}

            <p className="mt-3  text-black me-1">
              Don't have an Account{" "}
              <Link class="text-blue-500" to="/signup">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
