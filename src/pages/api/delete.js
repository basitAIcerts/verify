// pages/api/delete.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({ error: 'File path is required' });
        }

        const absolutePath = path.join(process.cwd(), 'public', filePath);

        fs.unlink(absolutePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting file' });
            }
            res.status(200).json({ message: 'File deleted successfully' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
