import { Customer } from "../models/Customer.model.js";
import Auth from "../middleware/auth.js";
import express from "express";

const customers = express();

// Create a new Customer
customers.get("/customer-detail", Auth, async (req, res) => {
  const userId = req.user.userId;
  console.log("User ID:", userId);

  try {
    const customers = await Customer.find({ userId: req.user.userId });

    console.log("Customers:", customers);
    const customerDetails = await Customer.aggregate([
      { $match: { userId: req.user.userId } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalActive: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          totalInactive: {
            $sum: {
              $cond: [{ $eq: ["$status", "inactive"] }, 1, 0],
            },
          },
        },
      },
    ]);

    console.log("Customer Details:", customerDetails);

    const customerResData =
      customerDetails.length > 0
        ? customerDetails[0]
        : {
            totalCustomers: 0,
            totalActive: 0,
            totalInactive: 0,
          };

    res.status(200).json({ customerDetails: customerResData });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch customer details. Please try again later.",
      });
  }
});





customers.get("/customer-graph" , Auth , async (req , res) => {
  const userId = req.user.userId;
  console.log(userId);

  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfSevenDaysAgo = new Date(startOfToday);
    startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 6);

    console.log(startOfSevenDaysAgo);

    const customerData = await Customer.aggregate([
      {
        $match: {
          // userId,
          createdAt: { $gte: startOfSevenDaysAgo, $lt: new Date() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(customerData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

customers.post("/", Auth, async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    const { customerName, phone, imageColor , OrderPrice, status , customerImage, products } = req.body;
    const newCustomer = new Customer({
      userId: userId,
      phone,
      OrderPrice,
      imageColor,
      customerImage,
      customerName,
      status,
      products,
    });
    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
  } catch (err) {
    console.error("Error saving Customer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update
customers.put("/:id", Auth, async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
customers.delete("/:id", Auth, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json("Customer has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Customers
customers.get("/find/:Id", Auth, async (req, res) => {
  try {
    console.log(req.params.Id);
    const customer = await Customer.findById(req.params.Id);
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch customers", error: err.message });
  }
});

// Get all customers
customers.get("/", Auth, async (req, res) => {
  try {
    console.log(req.user.userId);
    const customers = await Customer.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });;
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get monthly income
customers.get("/income", Auth, async (req, res) => {
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  try {
    const income = await Customer.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default customers;
