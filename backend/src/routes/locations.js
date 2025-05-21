import { Router } from "express";
import Location from "./models/location.js";
import multer from "multer";
import path from "path";

// Configure multer storage for development. In production, switch to Cloudinary.
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public/uploads/locations"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = Router();

// GET /locations - list all locations
router.get("/", async (req, res, next) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    next(err);
  }
});

// GET /locations/:id - get location
router.get("/:id", async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    next(err);
  }
});

// Expecting multipart/form-data with optional image field named "image".
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const locationData = {
      name: req.body.name,
      description: req.body.description,
    };

    if (req.file) {
      // Store relative path; in production, store Cloudinary URL instead.
      locationData.imageUrl = `/uploads/locations/${req.file.filename}`;
    }

    const location = await Location.create(locationData);
    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
});

// PUT /locations/:id - update location
router.put("/:id", async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    next(err);
  }
});

// DELETE /locations/:id - remove location
router.delete("/:id", async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
