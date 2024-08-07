import mongoose from "mongoose";

const OrderTableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    table : {
        type : Array,
    }
  },
  { timestamps: true }
);

export const OrderTable = mongoose.model("OrderTable", OrderTableSchema);