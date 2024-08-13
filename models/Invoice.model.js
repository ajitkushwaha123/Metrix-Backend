import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  restourantLogo: String,
  invoiceNumber: String,
  retourantName: String,
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
      name: String,
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