import express from "express";
import {verifyToken, verifyTokenandAdmin, verifyTokenandAuthorization} from "../middleware/verifyToken.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// To create a Cart
router.post("/", verifyToken, async(req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error)
    }
})

// To Update the items in the cart
router.put("/:id", verifyTokenandAuthorization, async (req, res) => {
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

// Delete Cart item
router.delete("/:id", verifyTokenandAuthorization, async(req, res) =>{
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json("Item deleted from Cart Successfully")
  } catch (error) {
    res.status(500).json(error)
  }
})

// open user's cart
router.get("/find/:userId", verifyTokenandAuthorization, async(req, res) => {
  try {
    const cart = await Cart.findOne({userId : req.params.userId})
    res.status(200).json(cart) 
  } catch (error) {
    res.status(500).json(error)
  }
})

export default router;