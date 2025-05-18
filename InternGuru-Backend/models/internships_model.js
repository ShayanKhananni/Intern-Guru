import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: [true, 'Internship Already exists!!'] },
  cat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipCat' },
  image_url:
  {
    type: String,
  },
  duration: {
    value: { type: Number, required: true }, 
    unit: { type: String, enum: ['months'], required: true } 
  }
}, { timestamps: true });

const Internship = mongoose.model("Internship", InternshipSchema);
export default Internship;


