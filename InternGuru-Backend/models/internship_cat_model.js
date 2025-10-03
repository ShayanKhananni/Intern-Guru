import mongoose from "mongoose";

const InternshipCatSchema = new mongoose.Schema({
  image_url:
  {
    type: String,
  },
  title: {
    type: String, required: true,
    unique: [true, 'Intership Category already exist']
  }
}, { timestamps: true })


const InternshipCat = mongoose.model("InternShipCat", InternshipCatSchema);
export default InternshipCat;





