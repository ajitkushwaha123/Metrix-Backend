import { Order } from "../models/Order.models.js";
import Auth from "../middleware/auth.js";
import express from "express";
import moment from "moment";

const orders = express();

orders.get("/sales", Auth, async (req, res) => {
  console.log("Fetching sales data...");
  const { userId } = req.user;
  console.log("User ID:", userId);

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const today = new Date();

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const startOfYesterday = new Date(startOfDay);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);

    // Calculate the end of the last week
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(startOfDay);
    startOfMonth.setDate(1);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const startOfLastMonth = new Date(startOfCurrentMonth);
    startOfLastMonth.setMonth(startOfCurrentMonth.getMonth() - 1);

    const endOfLastMonth = new Date(startOfCurrentMonth);
    endOfLastMonth.setDate(0);

    const startOfYear = new Date(startOfDay);
    startOfYear.setMonth(0, 1);

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(endOfYear.getFullYear() + 1);

    const startOfCurrentYear = new Date(today.getFullYear(), 0, 1);

    const startOfLastYear = new Date(startOfCurrentYear);
    startOfLastYear.setFullYear(startOfCurrentYear.getFullYear() - 1);

    const endOfLastYear = new Date(startOfCurrentYear);
    endOfLastYear.setDate(0);

    const dailySales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0],
            },
          },
          totalProgress: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "progress"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
          orderTypeDineIn: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "dineIn"] }, 1, 0],
            },
          },
          orderTypeTakeAway: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "takeAway"] }, 1, 0],
            },
          },
          orderTypeHomeDelivery: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "homeDelivery"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const yesterdaySales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0],
            },
          },
          totalProgress: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "progress"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
          orderTypeDineIn: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "dineIn"] }, 1, 0],
            },
          },
          orderTypeTakeAway: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "takeAway"] }, 1, 0],
            },
          },
          orderTypeHomeDelivery: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "homeDelivery"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const weeklySales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfWeek, $lt: endOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0],
            },
          },
          totalProgress: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "progress"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
          orderTypeDineIn: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "dineIn"] }, 1, 0],
            },
          },
          orderTypeTakeAway: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "takeAway"] }, 1, 0],
            },
          },
          orderTypeHomeDelivery: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "homeDelivery"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const lastWeekSales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfLastWeek, $lt: endOfLastWeek },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);

    const lastMonthSales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0],
            },
          },
          totalProgress: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "progress"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
          orderTypeDineIn: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "dineIn"] }, 1, 0],
            },
          },
          orderTypeTakeAway: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "takeAway"] }, 1, 0],
            },
          },
          orderTypeHomeDelivery: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "homeDelivery"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const yearlySales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfYear, $lt: endOfYear },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0],
            },
          },
          totalProgress: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "progress"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
          orderTypeDineIn: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "dineIn"] }, 1, 0],
            },
          },
          orderTypeTakeAway: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "takeAway"] }, 1, 0],
            },
          },
          orderTypeHomeDelivery: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "homeDelivery"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const lastYearSales = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfLastYear, $lt: endOfLastYear },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);

    const totalSales = await Order.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0],
            },
          },
          totalProgress: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "progress"] }, 1, 0],
            },
          },
          totalCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
          orderTypeDineIn: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "dineIn"] }, 1, 0],
            },
          },
          orderTypeTakeAway: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "takeAway"] }, 1, 0],
            },
          },
          orderTypeHomeDelivery: {
            $sum: {
              $cond: [{ $eq: ["$orderType", "homeDelivery"] }, 1, 0],
            },
          },
        },
      },
    ]);

    console.log("Monthly sales:", monthlySales);
    console.log("Yearly sales:", yearlySales);
    console.log("Total sales:", totalSales);
    console.log("Total sales:", totalSales);

    const dailySalesData =
      dailySales.length > 0
        ? dailySales[0]
        : {
            totalSales: 0,
            totalOrders: 0,
            totalCompleted: 0,
            totalPending: 0,
            totalProgress: 0,
            totalCancelled: 0,
            orderTypeDineIn: 0,
            orderTypeTakeAway: 0,
            orderTypeHomeDelivery: 0,
          };
    const yesterdaySalesData =
      yesterdaySales.length > 0
        ? yesterdaySales[0]
        : {
            totalSales: 0,
          };
    const weeklySalesData =
      weeklySales.length > 0
        ? weeklySales[0]
        : {
            totalSales: 0,
            totalOrders: 0,
            totalCompleted: 0,
            totalPending: 0,
            totalProgress: 0,
            totalCancelled: 0,
            orderTypeDineIn: 0,
            orderTypeTakeAway: 0,
            orderTypeHomeDelivery: 0,
          };
    const lastWeekSalesData =
      lastWeekSales.length > 0
        ? lastWeekSales[0]
        : {
            totalSales: 0,
          };
    const monthlySalesData =
      monthlySales.length > 0
        ? monthlySales[0]
        : {
            totalSales: 0,
            totalOrders: 0,
            totalCompleted: 0,
            totalPending: 0,
            totalProgress: 0,
            totalCancelled: 0,
            orderTypeDineIn: 0,
            orderTypeTakeAway: 0,
            orderTypeHomeDelivery: 0,
          };
    const lastMonthSalesData =
      lastMonthSales.length > 0
        ? lastMonthSales[0]
        : {
            totalSales: 0,
          };
    const yearlySalesData =
      yearlySales.length > 0
        ? yearlySales[0]
        : {
            totalSales: 0,
            totalOrders: 0,
            totalCompleted: 0,
            totalPending: 0,
            totalProgress: 0,
            totalPending: 0,
            totalCancelled: 0,
            orderTypeDineIn: 0,
            orderTypeTakeAway: 0,
            orderTypeHomeDelivery: 0,
          };
    const lastYearSalesData =
      lastYearSales.length > 0
        ? lastYearSales[0]
        : {
            totalSales: 0,
          };
    const totalSalesData =
      totalSales.length > 0
        ? totalSales[0]
        : {
            totalSales: 0,
            totalOrders: 0,
            totalCompleted: 0,
            totalPending: 0,
            totalProgress: 0,
            totalCancelled: 0,
            orderTypeDineIn: 0,
            orderTypeTakeAway: 0,
            orderTypeHomeDelivery: 0,
          };

    console.log("Daily sales:", dailySalesData);
    console.log("Yesterday Sales", yesterdaySalesData);
    console.log("Weekly sales:", weeklySalesData);
    console.log("Last Week Sales:", lastWeekSalesData);
    console.log("Monthly sales:", monthlySalesData);
    console.log("Last Month Sales:", lastMonthSalesData);
    console.log("Yearly sales:", yearlySalesData);
    console.log("Total sales:", totalSalesData);

    let percentageImprovement = 0;

    if (yesterdaySalesData.totalSales !== 0) {
      percentageImprovement =
        ((dailySalesData.totalSales - yesterdaySalesData.totalSales) /
          yesterdaySalesData.totalSales) *
        100;
    }

    let weeklyPercentageImprovement = 0;

    if (weeklySalesData.totalSales !== 0) {
      weeklyPercentageImprovement =
        ((weeklySalesData.totalSales - lastWeekSalesData.totalSales) /
          lastWeekSalesData.totalSales) *
        100;
    }

    let monthlyPercentageImprovement = 0;

    if (monthlySalesData.totalSales !== 0) {
      monthlyPercentageImprovement =
        ((monthlySalesData.totalSales - lastMonthSalesData.totalSales) /
          lastMonthSalesData.totalSales) *
        100;
    }

    let yearlyPercentageImprovement = 0;

    if (yearlySalesData.totalSales !== 0) {
      yearlyPercentageImprovement =
        ((yearlySalesData.totalSales - lastYearSalesData.totalSales) /
          lastYearSalesData.totalSales) *
        100;
    }

    console.log(
      `Sales improved by ${percentageImprovement.toFixed(2)}% from yesterday.`
    );

    const roundedYesterdayPercentageImprovement =
      percentageImprovement.toFixed(2);
    const roundedWeeklyPercentageImprovement =
      weeklyPercentageImprovement.toFixed(2);
    const roundedMonthlyPercentageImprovement =
      monthlyPercentageImprovement.toFixed(2);
    const roundedYearlyPercentageImprovement =
      yearlyPercentageImprovement.toFixed(2);

    console.log({
      weeklyPercentageImprovement: roundedWeeklyPercentageImprovement,
      monthlyPercentageImprovement: roundedMonthlyPercentageImprovement,
      yearlyPercentageImprovement: roundedYearlyPercentageImprovement,
    });


    res.json({
      dailySales: dailySalesData,
      yesterdaySales: yesterdaySalesData,
      weeklySales: weeklySalesData,
      lastWeekSales: lastWeekSalesData,
      monthlySales: monthlySalesData,
      yearlySales: yearlySalesData,
      totalSales: totalSalesData,
      yesterdayPrecentageImprovement: roundedYesterdayPercentageImprovement,
      weeklyPercentageImprovement: roundedWeeklyPercentageImprovement,
      monthlyPercentageImprovement: roundedMonthlyPercentageImprovement,
      yearlyPercentageImprovement: roundedYearlyPercentageImprovement,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

orders.get("/sales-graph", Auth, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfSevenDaysAgo = new Date(startOfToday);
    startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 6);

    const salesData = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: startOfSevenDaysAgo, $lt: new Date() },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$price" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

orders.get("/single/:productId", Auth, async (req, res) => {
  try {
    console.log("Fetching order...");
    console.log(req.params.productId);
    
    const order = await Order.findById(req.params.productId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (err) {
    console.error("Error fetching order:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
});


// Create a new Order
orders.post("/", Auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      products,
      newCustomer,
      customerId,
      quantity,
      customerName,
      paymentType,
      price,
      phone,
      orderStatus,
      orderNote,
      orderType,
    } = req.body;
    const newOrder = new Order({
      userId,
      products,
      quantity,
      customerId,
      newCustomer,
      customerName,
      phone,
      paymentType,
      price,
      orderStatus,
      orderNote,
      orderType,
    });
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error("Error saving Order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update
orders.put("/:id", Auth, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
orders.delete("/:id", Auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Orders
orders.get("/find/:orderId", Auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
});

// Get all orders
orders.get("/", Auth, async (req, res) => {
  const { userId } = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          userId,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalOrders = await Order.countDocuments({ userId });
    res.status(200).json({ orders, totalOrders });
  } catch (err) {
    res.status(500).json(err);
  }
});




// Get all orders based on Customer Id;
orders.get("/customer/:customerId", Auth, async (req, res) => {
  try {
    console.log(req.params.customerId);
    const orders = await Order.find({
      customerId: req.params.customerId,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get monthly income
orders.get("/income", Auth, async (req, res) => {
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  try {
    const income = await Order.aggregate([
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

// orders.get("/weekly" , async (req , res) => {
//   res.json("test");
// });

// orders.get("/weekly-income", Auth, async (req, res) => {
//   console.log("Fetching weekly income...");

//   try {
//     const startOfWeek = new Date();
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(endOfWeek.getDate() + 7);

//     console.log("Start of the week:", startOfWeek);

//     const sales = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfWeek, $lt: endOfWeek },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$totalPrice" },
//         },
//       },
//     ]);

//     const weeklySales = sales[0]?.totalSales || 0;
//     console.log("Weekly sales:", weeklySales);

//     res.json({ weeklySales });
//   } catch (error) {
//     console.error("Error fetching weekly sales:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

export default orders;
