
import mongoose from "mongoose";

const InternshipApplicationSchema = new mongoose.Schema({
  intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique:[true,'You have applied already']},
  internship_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });

const Application = mongoose.model("InternshipApplication", InternshipApplicationSchema);
export default Application;




