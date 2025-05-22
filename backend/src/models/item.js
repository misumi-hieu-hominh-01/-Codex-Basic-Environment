import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: function () {
      return this.barcode ? `Item ${this.barcode}` : "Unnamed Item";
    },
  },
  quantity: { type: Number, default: 1 },
  barcode: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    default: null,
  },
});

export default mongoose.model("Item", itemSchema);
