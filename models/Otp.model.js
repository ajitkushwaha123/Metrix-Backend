import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    username : {
      type : String,
    },
    password : {
      type : String,
    },
    otp: {
      type: String,
    },
    mailVarified : {
      type : Boolean,
      default : false
    },
    otpExpiration: {
      type: Date,
      default: Date.now,
      get: (otpExpiration) => otpExpiration.getTime(),
      set: (otpExpiration) => new Date(otpExpiration),
    },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);
