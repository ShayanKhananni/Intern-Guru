import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: [
    {
      title: String, 
      description: String,
      img_url: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Portfolio", PortfolioSchema);
