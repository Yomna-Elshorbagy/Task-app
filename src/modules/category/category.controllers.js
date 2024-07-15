import categoryModel from "../../../database/model/category.model.js";
import userModel from "../../../database/model/user.model.js";
import { AppError, catchAsyncError } from "../../utils/catchError.js";

export const addCategory = catchAsyncError(async (req, res, next) => {
  const { name, user } = req.body;
  //** if i want to get user from body not token: ** 
  let FoundUser = await userModel.findById(user);
  if (!FoundUser) return next(new AppError("user doesnot exisit", 404));

  let category = await categoryModel.insertMany({
    name,
    //user: FoundUser._id  //from body
    user: req.user.userId, //from token
  });

  res.status(201).json({ message: "category added sucessfully ", category });
});

export const getAllCategorys = catchAsyncError(async (req, res, next) => {
  let categorys = await categoryModel.find();
  if (!categorys) return next(new AppError("there is No categorys", 404));
  res.status(200).json({ message: "categorys are ", categorys });
});

export const getAllUserCategorys = catchAsyncError(async (req, res, next) => {
  let categorys = await categoryModel.find({ user: req.user.userId });
  if (!categorys) return next(new AppError("there is No categorys", 404));
  res.status(200).json({ message: "categorys are ", categorys });
});

export const getById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let category = await categoryModel.findById(id);
  if (!category) return next(new AppError("category doesnot exisist ", 404));
  res.status(200).json({ message: "category ", category });
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, user } = req.body;
  let category = await categoryModel.findById(id);
  if (!category) return next(new AppError("category doesnot exisit", 404));
  const updatedCat = await categoryModel.findByIdAndUpdate(
    category._id,
    {
      name,
      user,
    },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "category updated sucessfully ", updatedCat });
});
// if user updated from token => auth
export const updateCategory2 = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  let category = await categoryModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { name },
    { new: true }
  );
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.json({ message: "upated", category });
});

export const deleteCategorys = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let category = await categoryModel.findById(id);
  if (!category) {
    return next(new AppError("category doesnot exisit", 404));
  }
  let deletedCategory = await categoryModel.findByIdAndDelete(id);
  res
    .status(200)
    .json({ message: "category deleted sucessfully..", deletedCategory });
});

// filter category by name
export const getByName = catchAsyncError(async (req, res, next) => {
  const { name } = req.query;
  const filter = name ? { name: { $regex: new RegExp(name, "i") } } : {};
  let categorys = await categoryModel.find(filter);

  if (!categorys || categorys.length === 0) {
    return next(new AppError("No categories found", 404));
  }
  res.status(200).json({ message: "Categories", categorys });
});

//Sort
export const getSortCategorys = catchAsyncError(async (req, res, next) => {
  const { order } = req.query;
  const sortOrder = order === "desc" ? -1 : 1; // Default is ascending

  let categories = await categoryModel
    .find()
    .collation({ locale: "en", strength: 2 })
    .sort({ name: sortOrder });

  if (!categories || categories.length === 0) {
    return next(new AppError("No categories found", 404));
  }
  res.status(200).json({ message: "Categories", categories });
});

// Get paginated categories
export const getPaginatedCategories = catchAsyncError(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let categorys = await categoryModel.find().skip(skip).limit(limit);
    if (!categorys || categorys.length === 0)
      return next(new AppError("No categories found", 404));

    const totalCategories = await categoryModel.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      message: "Categories",
      categorys,
      pagination: {
        totalCategories,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  }
);
