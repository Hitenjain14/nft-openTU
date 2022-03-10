import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    unique: true,
    required: [true, 'Contract address is required'],
  },
  createdBy: {
    type: String,
    required: [true, 'Public address is required'],
  },
  description: {
    type: String,
  },
  logo: {
    type: String,
    required: [true, 'Logo is required'],
  },
  banner: {
    type: String,
    required: [true, 'Banner is required'],
  },
  volumeTraded: {
    type: Number,
    default: 0,
  },
  site: {
    type: String,
  },
  category: {
    type: String,
  },
  discord: {
    type: String,
  },
  instagram: {
    type: String,
  },
  colName: {
    type: String,
    required: [true, 'A colName is required'],
  },
});

export default mongoose.models.Col || mongoose.model('Col', collectionSchema);
//nft factory 0x13e6f420903469A79aC089Cd5e4Afcc410FF3de1
//eye 0x38ac2f406b69BF58eaCa8a95f37B6cD22dB5880a
