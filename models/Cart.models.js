import mongoose, { Schema } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", CartSchema);
