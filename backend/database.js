import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.sqlite'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    imagem TEXT NOT NULL,
    categoria TEXT DEFAULT 'Geral'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// MIGRATION: Add categoria column if it doesn't exist
try {
  db.exec("ALTER TABLE products ADD COLUMN categoria TEXT DEFAULT 'Geral'");
} catch (e) { }

// Insert default settings if not exist
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
const defaults = [
  ['whatsapp', '5511999999999'],
  ['primaryColor', '#ff4757'],
  ['themeName', 'Personalize'],
  ['siteLogo', ''],
  ['heroTitle', 'Personalizados para seu dia a dia'],
  ['heroSubtitle', 'Todos os itens para festa personalizamos de acordo com o seu tema ou projeto!'],
  ['bannerText', 'Clique em categorias e veja nossos produtos por seguimento'],
  ['storeAddress', 'RUA ALBERTO TEIXEIRA DA CUNHA, Nº 38 SL408\nCENTRO\nNILÓPOLIS\nRJ - RIO DE JANEIRO'],
  ['storeEmail', 'contato@loja.com'],
  ['storeContact', '5521965654109']
];

defaults.forEach(([key, val]) => insertSetting.run(key, val));

// Force/Reset default admin on startup for safety
const stmt = db.prepare('INSERT OR REPLACE INTO admin (id, email, password) VALUES (?, ?, ?)');
stmt.run(1, 'admin@site.com', 'admin123');
console.log('✅ Admin initialized: admin@site.com / admin123');

export default db;
