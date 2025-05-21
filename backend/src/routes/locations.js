import { Router } from 'express';
import Location from '../models/location.js';

const router = Router();

// GET /locations - list all locations
router.get('/', async (req, res, next) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    next(err);
  }
});

// GET /locations/:id - get location
router.get('/:id', async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    next(err);
  }
});

// POST /locations - create new location
router.post('/', async (req, res, next) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    next(err);
  }
});

// PUT /locations/:id - update location
router.put('/:id', async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    next(err);
  }
});

// DELETE /locations/:id - remove location
router.delete('/:id', async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
