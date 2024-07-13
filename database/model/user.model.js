import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "name shoud not exceed 50 character"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
