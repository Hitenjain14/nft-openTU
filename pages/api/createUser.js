import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';
dbConnect();
export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { publicAddress } = req.body;

      const resp = await User.find({ publicAddress });
      if (resp.length > 0) {
        res.status(200).json({
          status: 'success',
          data: {
            resp,
          },
        });
      } else {
        const doc = await User.create(req.body);
        res.status(201).json({
          status: 'success',
          data: {
            doc,
          },
        });
      }
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { publicAddress } = req.body;
      const doc = await User.find({ publicAddress });
      res.status(200).json({
        status: 'success',
        data: { doc },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
  }
};
