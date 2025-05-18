import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique:[true,'Intern already enrolled'] },
  internship_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true},
  start_date: { type: Date, required: true, default: Date.now },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true },
);


const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;
