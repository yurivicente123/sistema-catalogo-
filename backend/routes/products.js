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
router.post('/', upload.array('imagens', 5), async (req, res) => {
    const { nome, preco, categoria, descricao, compra_minima, prazo_entrega } = req.body;
    let imagensUrls = [];

    try {
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async file => {
                const fileExt = file.originalname.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const { error: uploadError } = await db.storage
                    .from('uploads')
                    .upload(fileName, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true
                    });
                if (uploadError) throw uploadError;
                return fileName;
            });
            imagensUrls = await Promise.all(uploadPromises);
        }

        const { data, error } = await db.from('products').insert([
            { 
                id: uuidv4(), 
                nome, 
                preco: parseFloat(preco), 
                imagem: imagensUrls.length > 0 ? imagensUrls[0] : '', // Keep standard image string empty fallback for old code
                imagens: imagensUrls,
                categoria,
                descricao,
                compra_minima: parseInt(compra_minima) || 1,
                prazo_entrega
            }
        ]).select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', upload.array('imagens', 5), async (req, res) => {
    const { nome, preco, categoria, descricao, compra_minima, prazo_entrega } = req.body;
    const updates = { 
        nome, 
        preco: parseFloat(preco), 
        categoria,
        descricao,
        compra_minima: parseInt(compra_minima) || 1,
        prazo_entrega
    };

    try {
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async file => {
                const fileExt = file.originalname.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const { error: uploadError } = await db.storage
                    .from('uploads')
                    .upload(fileName, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true
                    });
                if (uploadError) throw uploadError;
                return fileName;
            });
            const imagensUrls = await Promise.all(uploadPromises);
            updates.imagens = imagensUrls;
            updates.imagem = imagensUrls[0];
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
