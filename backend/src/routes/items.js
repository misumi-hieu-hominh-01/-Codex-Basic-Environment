import { Router } from 'express';

const router = Router();

// GET /items - list all items
router.get('/', (req, res) => {
  // placeholder: return empty array
  res.json([]);
});

// POST /items - create new item
router.post('/', (req, res) => {
  // placeholder: echo back data
  const item = req.body;
  res.status(201).json({ message: 'Item created', item });
});

export default router;
