import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb', // Limit the size of uploaded files
    },
  },
};

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { image, fileName } = req.body;
      const base64Data = image.replace(/^data:image\/png;base64,/, '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, base64Data, 'base64');

      res.status(200).json({ path: `/uploads/${fileName}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
