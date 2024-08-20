import mongoose from "mongoose";
const TaxSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  taxPercentage: {
    type: Number,
  },
});

export const Tax = mongoose.model("Tax", TaxSchema);
