import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  restourantLogo: String,
  invoiceNumber: String,
  restourantName: String,
  customerName: String,
  restourantAddress: String,
  restourantPhone: Number,
  billStatus: String,
  customerPhone: Number,
  paymentType: String,
  orderType: String,
  orderNumber: String,
  items: [
    {
      productName: String,
      quantity: Number,
      price: Number,
    },
  ],
  tax: Number,
  orderDate: {
    type: String,
  },
  orderTime: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Invoice = mongoose.model("Invoice", InvoiceSchema)