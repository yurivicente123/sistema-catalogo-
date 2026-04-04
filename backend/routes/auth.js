import express from 'express';
import db from '../database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`[DEBUG] Attempting login: ${email}`);

    try {
        const admin = db.prepare('SELECT * FROM admin WHERE email = ? AND password = ?').get(email, password);

        if (admin) {
            console.log(`[DEBUG] Login successful for: ${email}`);
            const token = generateToken(admin.id);
            res.json({ token });
        } else {
            console.log(`[DEBUG] Login failed: invalid credentials for ${email}`);
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('[DEBUG] Database error during login:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

export default router;
