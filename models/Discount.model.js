import mongoose from "mongoose";
const DiscountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  couponValue: {
    type: Number,
  },
  couponType: {
    type: String,
  },
});

export const Discount = mongoose.model("Discount", DiscountSchema);
