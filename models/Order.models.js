import mongoose, { Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    customerId : { type: String },
    tableId : { type: String },
    products : {
      type: Array,
    },
    customerName : {
      type: String,
    },
    quantity: {
      type: Number,
    },
    newCustomer: {
      type: Boolean,
      default: true,
    },
    phone : {
      type: Number,
    },
    paymentType: { type: String },
    price : { type: Number },
    orderStatus: {
      type: String,
    },
    orderType: {
      type: String,
    },
    invoiceId : {
      type: String,
    },
    orderNote: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
