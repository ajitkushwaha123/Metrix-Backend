import { Otp } from "../models/Otp.model.js";
import Auth from "../middleware/auth.js";
import express from "express";
import otpGenerator from "otp-generator";
import twilio from "twilio";
// import ENV from "../config.js";
import verifyOtp from "../helper/otpVerification.js";
import dotenv from "dotenv";
dotenv.config();

const otps = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


const twilioClient = twilio(accountSid, authToken);

otps.post("/", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const cDate = new Date();
    await Otp.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpiration: new Date(cDate.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // console.log(accountSid);

    // Send OTP via Twilio
    const message = await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return res.status(200).json({
      success: true,
      msg: "OTP SENT SUCCESS" + otp,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

otps.post("/verify", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const otpData = await Otp.findOne({ phoneNumber, otp });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        msg: "You Entered wrong OTP!",
      });
    }

    const isOTPExpired = await verifyOtp(otpData.otpExpiration);
    if (isOTPExpired) {
      return res.status(400).json({
        success: false,
        msg: "OTP Has been expired!",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "OTP Verified",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

export default otps;
