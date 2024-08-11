import mongoose from "mongoose";
const VariantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
});

export const Variant = mongoose.model("Variant", VariantSchema);