import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all products
router.get('/', async (req, res) => {
    try {
        const { data, error } = await db.from('products').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add product
router.post('/', upload.single('imagem'), async (req, res) => {
    const { nome, preco, categoria } = req.body;
    let imagemUrl = '';

    try {
        if (req.file) {
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const { error: uploadError } = await db.storage
                .from('uploads')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (uploadError) throw uploadError;
            imagemUrl = fileName;
        }

        const { data, error } = await db.from('products').insert([
            { id: uuidv4(), nome, preco: parseFloat(preco), imagem: imagemUrl, categoria }
        ]).select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', upload.single('imagem'), async (req, res) => {
    const { nome, preco, categoria } = req.body;
    const updates = { nome, preco: parseFloat(preco), categoria };

    try {
        if (req.file) {
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const { error: uploadError } = await db.storage
                .from('uploads')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (!uploadError) updates.imagem = fileName;
        }

        const { data, error } = await db.from('products').update(updates).eq('id', req.params.id).select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await db.from('products').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Produto deletado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
