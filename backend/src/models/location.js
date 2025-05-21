import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String
});

export default mongoose.model('Location', locationSchema);
