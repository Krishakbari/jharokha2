import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import productRoute from "./routes/productRoute.js"
import wishlistRoute from "./routes/wishlistRoute.js"
import cartRoute from "./routes/cartRoute.js"
import orderRoute from "./routes/orderRoute.js"
import sliderRoute from "./routes/sliderRoute.js";



const app = express();

dotenv.config();
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use("/img", express.static(path.join(process.cwd(), "public/img")));
// app.use(express.static("public"));




app.use("/auth", userRoute);
app.use("/", categoryRoute);
app.use("/", productRoute);
app.use("/wishlist", wishlistRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/", sliderRoute);




app.get("/", (req, res) => {
  res.send("on");
});

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
