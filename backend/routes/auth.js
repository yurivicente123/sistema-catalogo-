import express from 'express';
import db from '../database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`[DEBUG] Attempting Supabase login: ${email}`);

    try {
        const { data: admin, error } = await db
            .from('admin')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (admin && !error) {
            console.log(`[DEBUG] Login successful for: ${email}`);
            const token = generateToken(admin.id);
            res.json({ token });
        } else {
            console.log(`[DEBUG] Login failed: invalid credentials for ${email}`);
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('[DEBUG] Supabase login error:', error);
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

export default router;
