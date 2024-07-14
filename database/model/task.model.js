import mongoose from "mongoose";

let taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "last name must be at least 3 characters long"],
      maxlength: [50, "tittle shoud not exceed 50 character"],
    },
    type: {
      type: String,
      enum: ["text", "list"],
      required: true,
    },
    textBody: {
      type: String,
    },
    listItems: [
      {
        text: {
          type: String,
        },
      },
    ],
    shared: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
