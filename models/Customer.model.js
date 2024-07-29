import mongoose, { Schema } from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId : {
      type : String,
    },
    customerName: {
      type: String,
    },
    phone : {
      type: Number,
    },
    OrderPrice : {
      type: Number,
      default : 0,
    },
    customerImage : {
        type : String,
    },
    imageColor : {
        type : String,
    },
    status : {
        type : String,
        default : "active",
    },
    products : {type : Array},
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", CustomerSchema);
