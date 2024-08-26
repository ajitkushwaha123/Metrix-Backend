import express from "express";
import Auth from "../middleware/auth.js";
import mongoose from "mongoose";
import { Tax } from "../models/Tax.model.js";

const tax = express();

tax.post("/bulk-tax", Auth, async (req, res) => {
  const { userId } = req.user;

  for (let i = 0; i < req.body.length; i++) {
    const newTax = new Tax({
      name: req.body[i].name,
      user: userId,
      taxPercentage: req.body[i].taxPercentage,
    });

    await newTax.save();
  }

  res.status(200).json({
    message: "Tax added successfully",
  });
  // console.log(req.body);
});

// GET all Tax
tax.get("/", Auth, async (req, res, next) => {
  try {
    const { userId } = req.user;

    // console.log("userId", userId);
    const taxes = await Tax.find({ user: userId }).select(
      "_id name taxPercentage user"
    );

    res.status(200).json({
      taxes,
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

tax.delete("/:id", Auth, async (req, res, next) => {
  const taxId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(taxId)) {
      return res.status(400).json({ error: "Invalid tax ID" });
    }

    await Tax.findByIdAndDelete(taxId);
    res.status(200).json({ message: "Tax removed successfully" });
  } catch (error) {
    console.error("Error deleting tax:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default tax;
