import express from "express";
import Auth from "../middleware/auth.js";
import mongoose from "mongoose";
import { Discount } from "../models/Discount.model.js";

const discount = express();

discount.post("/bulk-discount", Auth, async (req, res) => {
  const { userId } = req.user;

  for (let i = 0; i < req.body.length; i++) {
    const newDiscount = new Discount({
      name: req.body[i].name,
      user: userId,
    });

    await newDiscount.save();
  }

  res.status(200).json({
    message: "Discount added successfully",
  });
  console.log(req.body);
});

// GET all Discount
discount.get("/", Auth, async (req, res, next) => {
  try {
    const { userId } = req.user;

    console.log("userId", userId);
    const discounts = await Discount.find({ user: userId }).select("_id name user");

    res.status(200).json({
      discounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

discount.delete("/:id", Auth, async (req, res, next) => {
  const discountId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(discountId)) {
      return res.status(400).json({ error: "Invalid discount ID" });
    }

    await Discount.findByIdAndDelete(discountId);
    res.status(200).json({ message: "Discount removed successfully" });
  } catch (error) {
    console.error("Error deleting discount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default discount;
