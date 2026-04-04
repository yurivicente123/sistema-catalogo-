import express from 'express';
import db from '../database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const admin = db.prepare('SELECT * FROM admin WHERE email = ? AND password = ?').get(email, password);

    if (admin) {
        const token = generateToken(admin.id);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

export default router;
