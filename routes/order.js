import express from "express";
import {
  verifyToken,
  verifyTokenandAdmin,
  verifyTokenandAuthorization,
} from "../middleware/verifyToken.js";
import Order from "../models/Order.js";

const router = express.Router();

// To create an Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// To Update the Order
router.put("/:id", verifyTokenandAdmin, async (req, res) => {
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

// Delete Order
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order Deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// open user's order
router.get("/find/:userId", verifyTokenandAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all items in cart
router.get("/", verifyTokenandAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get monthly Income
router.get("/income", verifyTokenandAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  //basically this new month is august, so lastMonth calls earnings for July, and prevMonth calls the earnings for June

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: prevMonth } } },
      { $project: { month: { $month: "$createdAt" } }, sales: "$amount" },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
