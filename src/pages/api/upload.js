// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(process.cwd(), 'public/uploads', req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).json({ error: err });

    // Send URL of uploaded image
    const url = `/uploads/${req.file.originalname}`;
    res.status(200).json({ url });
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, so multer can handle the file upload
  },
};
