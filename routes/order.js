import express from "express";
import {
  verifyToken,
  verifyTokenandAdmin,
  verifyTokenandAuthorization,
} from "../middleware/verifyToken.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

// To create an Order
router.post("/", verifyToken, async (req, res) => {
  const { products, address } = req.body ?? {};
  if (!Array.isArray(products) || products.length === 0 || products.length > 100 ||
      typeof address?.line !== "string" || !address.line.trim() || address.line.length > 500 ||
      !products.every((item) => mongoose.isObjectIdOrHexString(item?.productId) &&
        Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 100)) {
    return res.status(400).json("Provide valid items, quantities and a delivery address.");
  }

  const quantities = new Map();
  for (const { productId, quantity } of products) {
    const id = productId.toLowerCase();
    quantities.set(id, (quantities.get(id) ?? 0) + quantity);
  }
  if ([...quantities.values()].some((quantity) => quantity > 100)) return res.sendStatus(400);

  try {
    const catalog = await Product.find({ _id: { $in: [...quantities.keys()] } }).select("price");
    if (catalog.length !== quantities.size) return res.status(400).json("Product unavailable.");

    const amount = catalog.reduce((total, product) =>
      total + Math.round(product.price * 100) * quantities.get(String(product._id)), 0) / 100;
    const order = await Order.create({
      userId: req.user.id,
      products: [...quantities].map(([productId, quantity]) => ({ productId, quantity })),
      amount,
      address: { line: address.line.trim() },
    });
    res.status(201).json(order);
  } catch {
    res.sendStatus(500);
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
