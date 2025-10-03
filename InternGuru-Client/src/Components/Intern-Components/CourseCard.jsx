import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { usePurchaseCourseMutation } from "../../Store/app-api-slice";
import { loadStripe } from "@stripe/stripe-js";

const CourseCard = ({
  title,
  img_url,
  internshipId,
  price_id,
  price,
  type,
  link,
  courseId,
  isPurchased,
}) => {
  const [purchaseCourse] = usePurchaseCourseMutation();

  const { user } = useSelector((state) => state.auth);
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripeKey);


  const handlePurchase = async () => {
    try {
      const purchase = {
        price_id,
        internship_id: internshipId,
        course_id: courseId,
        intern_id: user._id,
      };

      const response = await purchaseCourse(purchase).unwrap();

      const sessionId = response.sessionId;

      const stripe = await stripePromise;

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error in purchase:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-3 hover:shadow-2xl transition duration-300 cursor-pointer text-center flex flex-col items-center">
      {/* Image */}
      <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
        <img
          src={img_url}
          alt={title}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

      {/* Price and Button */}

      {user.role === "intern" && (
        <div className="w-full mt-3">
          {type === "free" && (
            <div className="flex flex-row justify-around items-center gap-3">
              <a
                href={link}
                className="px-4 w-full py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition font-semibold text-center"
              >
                View Course
              </a>
            </div>
          )}

          {type === "paid" && !isPurchased && (
            <div className="flex flex-row justify-around items-center gap-3">
              <div className="text-black font-semibold text-lg">PKR {price}</div>

              <button
                onClick={() => {
                  handlePurchase();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition font-semibold text-center"
              >
                Buy Now
              </button>
            </div>
          )}

          {type === "paid" && isPurchased && (
            <div className="flex flex-row justify-around items-center gap-3">
              <a
                href={link}
                className="px-4 w-full py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition font-semibold text-center"
              >
                View Course
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;
