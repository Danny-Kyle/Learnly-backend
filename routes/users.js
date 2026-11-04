import express from "express";
import {
  verifyToken,
  verifyTokenandAdmin,
  verifyTokenandAuthorization,
} from "../middleware/verifyToken.js";
import User from "../models/User.js";
import CryptoJS from "crypto-js";

const router = express.Router();

// To Update the details of the User
router.put("/:id", verifyTokenandAuthorization, async (req, res) => {
  const updates = Object.fromEntries(
    ["username", "email", "password"].filter((field) => Object.hasOwn(req.body, field))
      .map((field) => [field, req.body[field]])
  );
  if (updates.password) {
    updates.password = CryptoJS.AES.encrypt(
      updates.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updates,
      },
      { new: true, runValidators: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete User
router.delete("/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch {
    res.sendStatus(500);
  }
});

// Get Single User
router.get("/find/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    // res.status(200).json(`User ${user} found successfully`)
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Users
router.get("/", verifyTokenandAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().select("-password").sort({ _id: -1 }).limit(5)
      : await User.find().select("-password");
    //if a query of {new=true}, is added to the request, it returns a maximum of 5 users
    res.status(200).json(users);
    // res.status(200).json(`User ${user} found successfully`)
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get User's status
router.get("/stats", verifyTokenandAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
