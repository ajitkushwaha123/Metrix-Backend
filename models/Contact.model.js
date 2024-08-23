import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema({
  name : {
    type : String,
  },
  phone : {
    type : Number,
  },
  email : {
    type : String,
  },
  city : {
    type : String,
  },
  restourantName : {
    type : String,
  }

});

export const Contact = mongoose.model("Contact", ContactSchema);
