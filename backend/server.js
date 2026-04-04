import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import supabase from './database.js';

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

// Initializar Admin no Supabase (Segurança)
const initAdmin = async () => {
    try {
        console.log('[DEBUG] Tentando upsert do admin...');
        const { data, error } = await supabase.from('admin').upsert([
            { id: 1, email: 'admin@site.com', password: 'admin123' }
        ], { onConflict: 'id' }).select();

        if (error) {
            console.error('❌ Erro no objeto Supabase error:', JSON.stringify(error, null, 2));
            if (error.message && error.message.includes('fetch failed')) {
                console.log('💡 DICA TÉCNICA: O erro fetch failed no Render geralmente é DNS. Tente reiniciar o projeto no Supabase.');
            }
        } else {
            console.log('✅ Admin verificado/inicializado no Supabase:', data);
        }
    } catch (e) {
        console.error('❌ Erro CRÍTICO de rede (catch):', e);
        if (e.cause) console.error('🔍 CAUSA REAL (catch):', e.cause);
    }
};
initAdmin();

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
