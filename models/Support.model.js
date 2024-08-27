import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    restaurantName : {
        type : String,
    },
    phoneNumber: {
      type: Number,
    },
    requestType : {
        type : String,
    },
    explainIssue : {
        type : String,
    }
  },
  { timestamps: true }
);

export const Support = mongoose.model("Support", supportSchema);
