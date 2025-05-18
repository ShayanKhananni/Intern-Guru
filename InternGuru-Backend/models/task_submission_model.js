import mongoose from "mongoose";

const TaskSubmissionSchema = new mongoose.Schema(
  {
    intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "TaskSchema",},
    internship_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    deployed_link: {type: String},
    github_link: {type: String, required: true},
    feedback:{type: String}, 
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);


TaskSubmissionSchema.index({ intern_id: 1, task_id: 1 }, { unique:true });

const TaskSubmission = mongoose.model("TaskSubmission", TaskSubmissionSchema);

export default TaskSubmission;