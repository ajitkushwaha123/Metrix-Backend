import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    status: {
      type: String,
      // default : "published",
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
      type: String,
    },
    photos: {
      type: Array,
      default: [
        "https://i.pinimg.com/564x/b0/c4/f2/b0c4f2bf9de44f7aa23d2ff3d7c274dd.jpg",
      ],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product' , ProductSchema);