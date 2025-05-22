import mongoose from "mongoose";

const kanbanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["done", "todo", "doing"],
    default: "todo",
  },
});


const Kanban = mongoose.model("Kanbad", kanbanSchema);
export default Kanban;