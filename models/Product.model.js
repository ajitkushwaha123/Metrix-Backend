import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    userId: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    status: {
      type: String,
      default : "published",
    },
    category: { type: String },
    categoryId: {
      type: String,
    },
    price: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    longDescription: {
      type: String,
    },
    orderType: {
      type: String,
    },
    variant: {
      type: Array,
    },
    photos: {
      type: Array,
    },
    shortCode : {
      type : String,
    },
    productType : {
      type : String,
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product' , ProductSchema);