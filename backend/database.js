import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Prioridade: Environment Variables do Render > .env local > Hardcoded fallback
const supabaseUrl = process.env.SUPABASE_URL?.trim() || 'https://srlecnxcpfsmdxvukba.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybGVjbnhlY3Bmc21keHZ1a2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjEyMjIsImV4cCI6MjA5MDg5NzIyMn0.m4ss87x_Kdi8KgCYReNcevjOs0kLXb-X__Dq5jh63xI';

console.log(`[INIT] Tentando conectar ao Supabase URL: ${supabaseUrl}`);
if (!supabaseKey) {
    console.error('[INIT] ❌ ERRO: SUPABASE_KEY não encontrada!');
} else {
    console.log(`[INIT] ✅ SUPABASE_KEY detectada (comprimento: ${supabaseKey.length} caracteres)`);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
