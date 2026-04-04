import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), '../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `logo_${uuidv4()}${ext}`);
    }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    res.json(settingsMap);
});

router.post('/', authMiddleware, upload.single('logo'), (req, res) => {
    const updateSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

    // Handle text fields
    Object.keys(req.body).forEach(key => {
        updateSetting.run(key, req.body[key]);
    });

    // Handle logo if uploaded
    if (req.file) {
        const logoUrl = `/uploads/${req.file.filename}`;
        updateSetting.run('siteLogo', logoUrl);
    }

    res.json({ success: true });
});

export default router;
