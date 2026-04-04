import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), '../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const upload = multer({ storage });

// Public: Get all products
router.get('/', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
});

// Admin: Add product
router.post('/', authMiddleware, upload.single('imagem'), (req, res) => {
    const { nome, preco, categoria } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const id = uuidv4();

    db.prepare('INSERT INTO products (id, nome, preco, imagem, categoria) VALUES (?, ?, ?, ?, ?)').run(id, nome, preco, imagePath, categoria || 'Geral');

    res.json({ id, nome, preco, imagem: imagePath, categoria });
});

// Admin: Update product
router.put('/:id', authMiddleware, upload.single('imagem'), (req, res) => {
    const { id } = req.params;
    const { nome, preco, categoria } = req.body;

    let query = 'UPDATE products SET nome = ?, preco = ?, categoria = ?';
    let params = [nome, preco, categoria || 'Geral'];

    if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        query += ', imagem = ?';
        params.push(imagePath);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.prepare(query).run(...params);

    res.json({ success: true });
});

// Admin: Delete product
router.delete('/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true });
});

export default router;
