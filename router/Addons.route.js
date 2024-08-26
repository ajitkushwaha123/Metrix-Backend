import express from "express";
import Auth from "../middleware/auth.js";
import mongoose from "mongoose";
import { Addons } from "../models/Addon.model.js";

const addons = express();

addons.post("/bulk-addons", Auth, async (req, res) => {
  const { userId } = req.user;

  for (let i = 0; i < req.body.length; i++) {
    const newAddOns = new Addons({
      name: req.body[i].name,
      user: userId,
    });

    await newAddOns.save();
  }

  res.status(200).json({
    message: "Addons added successfully",
  });
  // console.log(req.body);
});

// GET all Addons
addons.get("/", Auth, async (req, res, next) => {
  try {
    const { userId } = req.user;

    // console.log("userId", userId);
    const addons = await Addons.find({ user: userId }).select(
      "_id name user"
    );

    res.status(200).json({
      addons,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

addons.delete("/:id", Auth, async (req, res, next) => {
  const addOnId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(addOnId)) {
      return res.status(400).json({ error: "Invalid addons ID" });
    }

    await Addons.findByIdAndDelete(addOnId);
    res.status(200).json({ message: "Addons removed successfully" });
  } catch (error) {
    console.error("Error deleting addons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default addons;
