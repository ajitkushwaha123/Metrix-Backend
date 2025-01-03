import mongoose from "mongoose";
const AddOnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
});

export const Addons = mongoose.model("Addons", AddOnSchema);
