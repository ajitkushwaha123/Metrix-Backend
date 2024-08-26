import express from "express";
import Auth from "../middleware/auth.js";
import mongoose from "mongoose";
import { Variant } from "../models/Variant.model.js";

const variant = express();

variant.post("/bulk-variant", Auth, async (req, res) => {
  const { userId } = req.user;

  for (let i = 0; i < req.body.length; i++) {
    const newVariant = new Variant({
      name: req.body[i].name,
      user: userId,
    });

    await newVariant.save();
  }

  res.status(200).json({
    message: "Variant added successfully",
  });
  // console.log(req.body);
});


// GET all Variant
variant.get("/", Auth, async (req, res, next) => {
  try {
    const { userId } = req.user; 

    // console.log("userId", userId);
    const variants = await Variant.find({ user: userId }).select(
      "_id name user"
    );

    res.status(200).json({
      variants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

variant.delete("/:id", Auth, async (req, res, next) => {
    const variantId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({ error: "Invalid variant ID" });
    }

    await Variant.findByIdAndDelete(variantId);
    res.status(200).json({ message: "Variant removed successfully" });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default variant;
