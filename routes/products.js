import express from "express";
import {
  verifyTokenandAdmin,
  verifyTokenandAuthorization,
} from "../middleware/verifyToken.js";
import Product from "../models/Product.js";

const router = express.Router();

// To create a Product
router.post("/", verifyTokenandAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// To Update the details of the Product
router.put("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Product
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Single Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Products
router.get("/", async (req, res) => {
  const qNew = req.query.new; //if a query of {qNew=true}, is added to the request, it returns a limited number products
  const qCategory = req.query.category; //if a query of {qCategory=true}, is added to the request, it returns only products in a certain category
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
