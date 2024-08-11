import mongoose from "mongoose";
const TaxSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  taxPercentage: {
    type: Number,
    required: true,
  },
});

export const Tax = mongoose.model("Tax", TaxSchema);
