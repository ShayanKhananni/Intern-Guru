import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEnrollInternMutation } from "../../Store/app-api-slice";
import { useSelector } from "react-redux";

const CourseSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [enrollIntern] = useEnrollInternMutation();

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleCoursePurchase = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/intern/payment/course/${sessionId}`
        );
        const data = await response.json();

        console.log("Fetched session data:", data);
        const res = await enrollIntern(data).unwrap();

        navigate(`/view/courses/${user.internship_id}`);
      } catch (err) {
        console.error("Failed to enroll in course:", err);
        toast.error("❌ Failed to enroll in course.");
      }
    };

    if (sessionId) {
      handleCoursePurchase();
    }
  }, [sessionId]);

  return <h1> Purchase Successful!</h1>;
};

export default CourseSuccess;
