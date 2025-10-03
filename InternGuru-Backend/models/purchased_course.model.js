import mongoose from "mongoose";

const PurchasedCourseSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, },
  intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
}, { timestamps: true },
);

const PurchasedCourse = mongoose.model("PurchasedCourse", PurchasedCourseSchema);
export default PurchasedCourse;
