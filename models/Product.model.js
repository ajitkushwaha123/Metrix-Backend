import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        productName : {
          type: String, 
          required: true,
        },
        userId : {
          type: String,
        },
        shortDescription: {
          type: String,
        },
        status : {
          type : String,
          // default : "published",
        },
        category: {type : String}, 
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
        photos : {type : Array},
      },
      { timestamps: true }
);

export const Product = mongoose.model('Product' , ProductSchema);