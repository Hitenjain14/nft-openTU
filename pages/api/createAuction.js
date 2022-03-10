import dbConnect from '../../utils/dbConnect';
import Auc from '../../models/auction';
dbConnect();

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { colAddress, nftId } = req.body;
      const doc = await Auc.find({ colAddress, nftId });
      if (doc.length > 0) {
        await Auc.delete({ colAddress, nftId });
      }

      const d = await Auc.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          d,
        },
      });
    } catch (err) {
      console.log(err.message);
      res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { auction } = req.body;
      const { colAddress, nftId } = auction;
      await Auc.delete({ colAddress, nftId });
      res.status(204).json({
        status: 'success',
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
  }
};
