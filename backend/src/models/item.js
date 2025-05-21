import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  barcode: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null }
});

export default mongoose.model('Item', itemSchema);
