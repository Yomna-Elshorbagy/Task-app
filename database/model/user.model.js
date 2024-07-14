import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "last name must be at least 3 characters long"],
      maxlength: [50, "name shoud not exceed 50 character"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match :/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: { //confirmEmail
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    otpCode: String, //Math.floor(100000 + Math.random() * 900000)
    otpExpire: Date, 
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
