import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import itemsRouter from "./routes/items.js";
import locationsRouter from "./routes/locations.js";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Mount routes under /api namespace
app.use("/api/items", itemsRouter);
app.use("/api/locations", locationsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Warehouse Backend API" });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const payload = { message: err.message || "Server error" };
  if (err.errors) {
    payload.errors = err.errors;
  }
  res.status(status).json(payload);
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/warehouse")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Backend running on port ${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });
