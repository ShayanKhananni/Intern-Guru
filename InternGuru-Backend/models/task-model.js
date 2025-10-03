import mongoose from "mongoose";


const TaskSchema = new mongoose.Schema({
  internship_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  title: { type: String, required: true, unique:[true,'Task Already'] },
  isDeleted: { type: Boolean, default: false },  
  description: { type: String },
  collab:{type:Boolean}
}, { timestamps: true });

const Task = mongoose.model("TaskSchema", TaskSchema);

export default Task;
