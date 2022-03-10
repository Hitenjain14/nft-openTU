import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: [true, 'A contract Address is required'],
  },
  expireAt: {
    type: Date,
    required: true,
  },
  auctionType: {
    type: String,
    enum: ['English', 'Dutch'],
    required: [true, 'type of auction is required'],
  },
  nftId: {
    type: Number,
    required: [true, 'A id is required'],
  },
  colAddress: {
    type: String,
    required: [true, 'Collection address is required'],
  },
});

// @ts-ignore
auctionSchema.index({ colAddress: 1, nftId: 1 }, { unique: true });
// @ts-ignore

export default mongoose.models.Auc || mongoose.model('Auc', auctionSchema);
