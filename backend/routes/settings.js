import express from 'express';
import multer from 'multer';
import db from '../database.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all settings
router.get('/', async (req, res) => {
    try {
        const { data, error } = await db.from('settings').select('*');
        if (error) throw error;

        const settings = {};
        data.forEach(item => {
            settings[item.key] = item.value;
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
router.post('/', upload.single('logo'), async (req, res) => {
    const settings = { ...req.body };

    try {
        if (req.file) {
            const fileName = `logo-${Date.now()}`;
            const { error: uploadError } = await db.storage
                .from('uploads')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (!uploadError) settings.siteLogo = fileName;
        }

        const promises = Object.keys(settings).map(key => {
            return db.from('settings').upsert({ key, value: String(settings[key]) });
        });

        await Promise.all(promises);
        res.json({ message: 'Configurações salvas' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
