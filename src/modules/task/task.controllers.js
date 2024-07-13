import categoryModel from "../../../database/model/category.model.js";
import taskModel from "../../../database/model/task.model.js";
import userModel from "../../../database/model/user.model.js";
import { AppError, catchAsyncError } from "../../utils/catchError.js";

export const addTask = catchAsyncError(async (req, res, next) => {
  let { title, type, textBody, listItems, shared, category, user } = req.body;

  let FoundUser = await userModel.findById(user);
  if (!FoundUser) return next(new AppError("users doesnot exisit", 404));
  
  let foundCategory = await categoryModel.findById(category);
  if (!foundCategory) return next(new AppError("category doesnot exisit", 404));

  let task = await taskModel.insertMany({
    title,
    type,
    textBody,
    listItems,
    shared,
    category,
    user,
    //user: req.user.userId
  });

  res.status(201).json({ message: "task added sucessfully ", task });
});

export const getAllTasks = catchAsyncError(async (req, res, next) => {
  let tasks = await taskModel.find();
  if (!tasks) return next(new AppError("there is No tasks", 404));
  res.status(200).json({ message: "tasks are ", tasks });
});
export const getById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let task = await taskModel.findById(id);
  if (!task) return next(new AppError("task doesnot exisist ", 404));
  res.status(200).json({ message: "task ", task });
});
export const updateTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, type, textBody, listItems, shared, category } = req.body;
  let task = await taskModel.findById(id);
  if (!task) return next(new AppError("task doesnot exisit", 404));
  const updatedTask = await taskModel.findByIdAndUpdate(
    task._id,
    {
      title,
      type,
      textBody,
      listItems,
      shared,
      category,
      user,
    },
    { new: true }
  );
  res.status(200).json({ message: "task updated sucessfully ", updatedTask });
});

export const deleteTask = catchAsyncError(async (req, res, next) => {
  let { id } = req.params;
  let task = await taskModel.findById(id);
  if (!task) {
    return next(new AppError("Task doesnot exisit", 404));
  }
  let deletedTask = await taskModel.findByIdAndDelete(id);
  res.status(200).json({ message: "Task deleted sucessfully..", deletedTask });
});

// Get paginated tasks
export const getPaginatedTask = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let tasks = await taskModel.find().skip(skip).limit(limit);
  if (!tasks || tasks.length === 0)
    return next(new AppError("No tasks found", 404));

  const totalTasks = await taskModel.countDocuments();
  const totalPages = Math.ceil(totalTasks / limit);

  res.status(200).json({
    message: "Tasks",
    tasks,
    pagination: {
      totalTasks,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  });
});


// filter shared
export const getBySharedOption = catchAsyncError(async (req, res, next) => {
    const { shared } = req.query;
    const filter = shared ? { shared: shared.toLowerCase() } : {};
    
    let tasks = await taskModel.find(filter);
    
    if (!tasks || tasks.length === 0) {
      return next(new AppError("No tasks found", 404));
    }
  
    res.status(200).json({ message: "Tasks retrieved successfully", tasks });
  });
  
  //Sort task
  export const getSortTasks = catchAsyncError(async (req, res, next) => {
    const { order } = req.query;
    const sortOrder = order === "desc" ? -1 : 1; 
  
    let tasks = await taskModel
      .find()
      .collation({ locale: "en", strength: 2 })
      .sort({ shared: sortOrder });
  
    if (!tasks || tasks.length === 0) {
      return next(new AppError("No tasks found", 404));
    }
    res.status(200).json({ message: "tasks", tasks });
  });
