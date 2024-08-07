import express from "express";
import { OrderTable } from "../models/OrderTable.model.js";
import Auth from "../middleware/auth.js";

const orderTable = express();

orderTable.post("/", Auth, async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("User:", userId);

    const orderTable = await OrderTable.create({
      user: userId,
      table: req.body.table,
    });

    res.status(201).json({ orderTable });
  } catch (err) {
    console.error("Error updating table:", err);
    res
      .status(500)
      .json({ error: "Failed to update table. Please try again later." });
  }
});

orderTable.put("/", Auth, async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("User:", userId);

    const orderTable = await OrderTable.findOneAndUpdate(
      { userId: userId },
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(201).json({ orderTable });
  } catch (err) {
    console.error("Error updating table:", err);
    res
      .status(500)
      .json({ error: "Failed to update table. Please try again later." });
  }
});

orderTable.get("/" , Auth , async (req , res) => {
    const {userId} = req.user;

    try {
        const orderTable = await OrderTable.findOne({user: userId});
        res.status(200).json({orderTable});
    } catch (err) {
        console.error("Error fetching table:", err);
        res.status(500).json({error: "Failed to fetch table. Please try again later."});
    }
})

export default orderTable;