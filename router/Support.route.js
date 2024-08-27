import express from "express";
import { Support } from "../models/Support.model.js";
const support = express();

support.post("/", async (req, res) => {
  const { restaurantName, phoneNumber, requestType, explainIssue } = req.body;
  try {
    const newSupport = new Support({
      restaurantName,
      phoneNumber,
      requestType,
      explainIssue,
    });

    const supportRequest = await newSupport.save();

    console.log(newSupport);

    return res.status(200).json({
      success: true,
      msg: "Form Submitted successfully... !",
      data : supportRequest,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      msg: "Error Submiting support form...!",
    });
  }
});

export default support;
