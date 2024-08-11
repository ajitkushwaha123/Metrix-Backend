import mongoose from "mongoose";
const DiscountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  couponValue: {
    type: Number,
    required: true,
  },
  couponType: {
    type: String,
    required: true,
  },
});

export const Discount = mongoose.model("Discount", DiscountSchema);
