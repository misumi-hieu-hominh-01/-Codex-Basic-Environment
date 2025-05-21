import { Router } from 'express';

const router = Router();

// GET /locations - list all locations
router.get('/', (req, res) => {
  res.json([]);
});

// POST /locations - create new location
router.post('/', (req, res) => {
  const location = req.body;
  res.status(201).json({ message: 'Location created', location });
});

export default router;
