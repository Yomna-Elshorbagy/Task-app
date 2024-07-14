import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: [3, "name must be at least 3 characters long"],
    maxlength: [50, "name shoud not exceed 50 character"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const categoryModel = mongoose.model('Category', CategorySchema);
export default categoryModel;

