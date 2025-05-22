import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import Item from "../models/Item.js";

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res
    .status(400)
    .json({ message: "Validation failed", errors: errors.array() });
};

const router = Router();

// GET /items - list all items
router.get(
  "/",
  validate([
    query("status")
      .optional()
      .equals("pending")
      .withMessage("status must be 'pending'"),
    query("unassigned")
      .optional()
      .isBoolean()
      .withMessage("unassigned must be boolean"),
  ]),
  async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.status === "pending" || req.query.unassigned === "true") {
        filter.location = null;
      }
      const items = await Item.find(filter).populate("location");
      res.json(items);
    } catch (err) {
      next(err);
    }
  }
);

// GET /items/:id - get single item
router.get(
  "/:id",
  validate([param("id").isMongoId().withMessage("Invalid item id")]),
  async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.id).populate("location");
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

// POST /items - create new item
router.post(
  "/",
  validate([
    body("barcode").isString().notEmpty().withMessage("barcode is required"),
    body("name").optional().isString().withMessage("name must be a string"),
    body("quantity")
      .optional()
      .isNumeric()
      .withMessage("quantity must be a number"),
    body("metadata")
      .optional()
      .isObject()
      .withMessage("metadata must be object"),
    body("locationId")
      .optional()
      .isMongoId()
      .withMessage("locationId must be valid"),
  ]),
  async (req, res, next) => {
    try {
      const { barcode, name, quantity, metadata, locationId } = req.body;
      const data = { barcode, metadata };

      if (name !== undefined) {
        data.name = name;
      }

      if (quantity !== undefined) {
        data.quantity = quantity;
      }

      if (locationId) {
        data.location = locationId;
      }
      const item = await Item.create(data);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /items/:id - update item
router.put(
  "/:id",
  validate([
    param("id").isMongoId().withMessage("Invalid item id"),
    body("barcode")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("barcode must be string"),
    body("name").optional().isString().withMessage("name must be a string"),
    body("quantity")
      .optional()
      .isNumeric()
      .withMessage("quantity must be a number"),
    body("metadata")
      .optional()
      .isObject()
      .withMessage("metadata must be object"),
    body("location")
      .optional()
      .isMongoId()
      .withMessage("location must be valid"),
    body("locationId")
      .optional()
      .isMongoId()
      .withMessage("locationId must be valid"),
  ]),
  async (req, res, next) => {
    try {
      const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).populate("location");
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /items/:id - remove item
router.delete(
  "/:id",
  validate([param("id").isMongoId().withMessage("Invalid item id")]),
  async (req, res, next) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({ message: "Item deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
