import { Router } from 'express';
import Item from '../models/item.js';

const router = Router();

// GET /items - list all items
router.get('/', async (req, res, next) => {
  try {
    const items = await Item.find().populate('location');
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /items/:id - get single item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('location');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /items - create new item
router.post('/', async (req, res, next) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// PUT /items/:id - update item
router.put('/:id', async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /items/:id - remove item
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
