import { Cart } from "../models/Cart.models.js";
import Auth from "../middleware/auth.js";
import express from "express";

const carts = express();

// Create a new cart
carts.post("/", Auth, async (req, res) => {
  try {
    console.log(req.body);
    const {userId} = req.user;
    const {products} = req.body;

   console.log(userId);
   console.log(products);

    const newCart = new Cart({
      userId,
      products,
    });
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    console.error("Error saving cart:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update
carts.put("/:id", Auth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
carts.delete("/:id", Auth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Carts
carts.get("/find/:userId", Auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Carts
carts.get("/", Auth, async (req, res) => {
  const {userId} = req.user;
  console.log(userId);
  try {
    const allCarts = await Cart.find(userId ? {userId} : {});
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default carts;
