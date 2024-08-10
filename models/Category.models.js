import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name : {
    type : String,
    required : true,
  },
  photo: {
    type: String,
    default:
      "https://i.pinimg.com/236x/97/cf/0d/97cf0d97dc5c26875ed17525946a7b82.jpg",
  },
});

export const Category = mongoose.model("Category", CategorySchema);
