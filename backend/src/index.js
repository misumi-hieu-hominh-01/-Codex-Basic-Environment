import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import locationsRouter from './routes/locations.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/items', itemsRouter);
app.use('/locations', locationsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Warehouse Backend API' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/warehouse').then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => console.log(`Backend running on port ${port}`));
}).catch(err => {
  console.error('MongoDB connection error', err);
});
