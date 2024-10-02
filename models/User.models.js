import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  isAdmin : {
    type : Boolean,
    default : false,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name: { type: String },
  phone: { type: Number },
  address: { type: String },
  profile: { type: String },
  city: {type  : String},
  gst : {type : String},
  pan : {type : String},
  role:{
    type : String,
    default : "CUSTOMER",
  },
  subscription : {
    type : String,
    default : "FREE",
  },
  subscriptionStatus : {
    type : String,
    default : "ACTIVE",
  },
  subscriptionStartDate : {
    type : Date,
    default : Date.now(),
  },
  paymentInformation : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "payment_information"
    }
  ],
  createdAt : {
    type : Date,
    default:Date.now(),
  },
} , {timestamps : true});

// Export the model correctly
export default mongoose.model("User", UserSchema);
