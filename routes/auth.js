import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password: plaintext } = req.body ?? {};
  if (![username, email, plaintext].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json("Username, email and password are required");
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      plaintext,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    const { password, ...account } = savedUser.toObject();
    res.status(201).json(account);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json("Username or email already exists");
    res.sendStatus(500);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { username, password: plaintext } = req.body ?? {};
  if (typeof username !== "string" || typeof plaintext !== "string") return res.sendStatus(400);
  try {
    const user = await User.findOne({ username });
    if (!user){
      return res.status(401).json("Wrong Username Credentials");
    }
    const hashedpassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedpassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== plaintext){
      return res.status(401).json("Wrong Password Entered!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
        //this tells us that after 3 days the access token won't be available and would require the user to log-in again
      }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/authtest", (req, res) => {
  res.send("Auth test successful");
});

export default router;
