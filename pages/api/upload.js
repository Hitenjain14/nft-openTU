import Col from '../../models/collection';
import dbConnect from '../../utils/dbConnect';
const { cloudinary } = require('../../utils/cloudinary');
dbConnect();

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const fileStr = req.body.logo;
      const fileStr2 = req.body.banner;

      const d = Col.find({ contractAddress: req.body.contractAddress });
      if (d.length > 0) {
        res.status(404).json({
          status: 'fail',
          message: 'Already exists',
        });
      }

      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'nft_web',
      });
      req.body.logo = uploadResponse.secure_url;
      const uploadResponse2 = await cloudinary.uploader.upload(fileStr2, {
        upload_preset: 'nft_web',
      });
      req.body.banner = uploadResponse2.secure_url;
      console.log(req.body);
      const doc = await Col.create(req.body);
      res.status(201).json({
        status: 'success',
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message,
      });
      console.log(err.message);
    }
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};
