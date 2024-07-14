import userModel from "../../../database/model/user.model.js";
import { AppError, catchAsyncError } from "../../utils/catchError.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/email.js";
import jwt from "jsonwebtoken";

export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({ message: "All users: ", users });
});

export const getUserById = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) return next(new AppError("users doesnot exisit", 404));
  res.status(200).json({ message: "user: ", user });
});

export const signUp = catchAsyncError(async (req, res, next) => {
  let { userName, email, password, Cpassword } = req.body;

  let user = await userModel.findOne({ email });
  if (user) return next(new AppError("user alredy register", 409));
  if (password != Cpassword)
    return next(
      new AppError("password annd confirmed password doesnot Match", 401)
    );

  let hashedPass = bcrypt.hashSync(password, 8);
  let otpCode = Math.floor(100000 + Math.random() * 900000).toString(); //// 6-digit OTP
  let otpExpire = new Date(Date.now() + 10 * 60 * 1000); //// 10 minutes from now

  let newUser = await userModel.insertMany({
    userName,
    email,
    password: hashedPass,
    otpCode,
    otpExpire,
  });
  await sendEmail(email, otpCode);
  newUser[0].password = undefined; ////prevent password to send to front end
  return res.status(201).json({ message: "user added Sucessfully", newUser });
});

export const verifyEmail = catchAsyncError(async (req, res, next) => {
  let { token } = req.params;
  jwt.verify(token, process.env.EMAIL_KEY, async (err, payload) => {
    if (err) return next(new AppError(err));
    let user = await userModel.findOne({ email: payload.email });
    if (!user) return next(new AppError("invalid user", 404));
    await userModel.findOneAndUpdate(
      { email: payload.email },
      { isVerified: true, otpCode: null, otpExpire: null },
      { new: true }
    );
    res.json({ message: "sucess", email: payload.email });
  });
});

export const verifyOtp = catchAsyncError(async (req, res, next) => {
  const { email, otpCode } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) return next(new AppError("User not found", 404));
  if (user.otpCode !== otpCode) return next(new AppError("Invalid OTP", 401));

  if (user.otpExpire < new Date())
    return next(new AppError("OTP expired", 400));

  await userModel.findOneAndUpdate(
    { email },
    { isVerified: true, otpCode: null, otpExpire: null },
    { new: true }
  );

  res.json({ message: "Email verified successfully" });
});

export const logIn = catchAsyncError(async (req, res, next) => {
  let { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError("incorrect email or password", 401));
  }
  if (user.isVerified == false || user.otpCode != null) {
    return next(new AppError("Email Not Verified", 401));
  }
  await userModel.findByIdAndUpdate(user._id, { status: "online" });
  jwt.sign(
    { userId: user._id, password: user.password, email: user.email },
    process.env.SECRET_KEY,
    (err, token) => {
      res.json({ message: "Loged in sucessfully..", token });
    }
  );
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let { userName, email, isActive, status } = req.body;

  let user = await userModel.findById(id);
  if (!user) {
    return next(new AppError("user doesnot exisit", 404));
  }
  let updateduser = await userModel.findByIdAndUpdate(
    user._id,
    {
      userName,
      email,
      isActive,
      status,
    },
    { new: true }
  );
  res.json({ message: "user updated sucessfully..", updateduser });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let user = await userModel.findById(id);
  if (!user) {
    return next(new AppError("user doesnot exisit", 404));
  }
  let deleteduser = await userModel.findByIdAndDelete(id);
  res.json({ message: "user deleted sucessfully..", deleteduser });
});

export const resetPassword = catchAsyncError( async (req, res, next) => {
  const { email, password, Cpassword } = req.body;

  if (!email) return next(new AppError("user not found", 404));
  if (password != Cpassword)
    return next(
      new AppError("password annd confirmed password doesnot Match", 401)
    );
  const hashedPass = bcrypt.hashSync(password, 8);
  let user = await userModel.findOneAndUpdate(
    { email },
    {
      password: hashedPass,
    },
    { new: true }
  );
  res.status(200).json({message: "password reset sucessfully.."})
});

export const sortedUsers = catchAsyncError(async (req, res) => {
  let users = await userModel.find().sort({ userName: 1 });
  if (!users) return next(new AppError("users not found", 404));
  res.json({ message: "users sorted: ", users });
});
