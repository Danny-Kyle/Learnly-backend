import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoute from "./routes/users.js"
import authRoute from "./routes/auth.js"
import productRoute from "./routes/products.js"
const app = express();
const port = 5000;
dotenv.config()


const conn = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log(`Connected to MongoDB`)
      } catch (error) {
        throw error
      }
}

mongoose.connection.on("disconnected", ()=>{
    console.log("MongoDB Disconnected")
})
mongoose.connection.on("connected", ()=> {
    console.log("MongoDB connected!")
})

app.use(express.json())
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)

app.listen(5000, ()=> {
    conn()
    console.log("Connected to backend!!!")
})