import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend static files in production
const isProd = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

if (isProd) {
    const distPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
        res.sendFile(path.resolve(distPath, 'index.html'));
    });
}

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
