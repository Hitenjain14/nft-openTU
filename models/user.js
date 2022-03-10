import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    default: 'Unnamed',
  },
  publicAddress: {
    type: String,
    unique: true,
    required: true,
  },
  profileImage: {
    type: String,
  },
  bannerImage: {
    type: String,
  },
  twitterHandle: {
    type: String,
  },
  igHandle: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
