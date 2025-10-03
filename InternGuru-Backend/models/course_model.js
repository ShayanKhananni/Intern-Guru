import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  image_url:
  {
    type: String,
  },
  title: { type: String, required: true,unique:[true,'Course with same title already exist!!'] },
  link: { type: String, required: true,},
  internship_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  price: { type: Number},
  price_id: { type: String},
  type: { type: String, enum: ["paid", "free"], default: "free" },
},
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;
