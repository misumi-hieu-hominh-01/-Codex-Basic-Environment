import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import Location from "../models/location.js";
import multer from "multer";
import path from "path";
import { saveImage, deleteImage } from "../utils/imageStorage.js";

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({ message: "Validation failed", errors: errors.array() });
};

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
router.get(
  "/:id",
  validate([param("id").isMongoId().withMessage("Invalid location id")]),
  async (req, res, next) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (err) {
      next(err);
    }
  }
);

// Expecting multipart/form-data with optional image field named "image".
router.post(
  "/",
  upload.single("image"),
  validate([
    body("name").isString().notEmpty().withMessage("name is required"),
    body("description").optional().isString().withMessage("description must be string"),
  ]),
  async (req, res, next) => {
    try {
      const locationData = {
        name: req.body.name,
        description: req.body.description,
      };

    if (req.file) {
      // Save locally; in production, upload to Cloudinary and store URL.
      locationData.imageUrl = saveImage(req.file);
    }

    const location = await Location.create(locationData);
    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
});

// PUT /locations/:id - update location
router.put(
  "/:id",
  upload.single("image"),
  validate([
    param("id").isMongoId().withMessage("Invalid location id"),
    body("name").optional().isString().notEmpty().withMessage("name must be string"),
    body("description").optional().isString().withMessage("description must be string"),
  ]),
  async (req, res, next) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }

    const updateData = { ...req.body };

    if (req.file) {
      // Remove old image if present
      await deleteImage(location.imageUrl);
      // Save new image and store returned URL
      updateData.imageUrl = saveImage(req.file);
    }

    const updated = await Location.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /locations/:id - remove location
router.delete(
  "/:id",
  validate([param("id").isMongoId().withMessage("Invalid location id")]),
  async (req, res, next) => {
    try {
      const location = await Location.findByIdAndDelete(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json({ message: "Location deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
