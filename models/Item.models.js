import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default : "dummy",
    //   required: true,
    },
    shortDescription: {
      type: String,
    //   required: true,
    },
    category: [String], // Assuming category is an array of strings
    price: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    longDescription: {
      type: String,
    },
    productImage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductImage', // Make sure you have a ProductImage model
      },
    ],
  },
  { timestamps: true }
);

export const Item = mongoose.model('Item', itemSchema);
