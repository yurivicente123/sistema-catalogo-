import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = (process.env.SUPABASE_URL || 'https://srlecnxcpfsmdxvukba.supabase.co').trim().replace(/\/$/, '');
const supabaseKey = (process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybGVjbnhlY3Bmc21keHZ1a2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjEyMjIsImV4cCI6MjA5MDg5NzIyMn0.m4ss87x_Kdi8KgCYReNcevjOs0kLXb-X__Dq5jh63xI').trim();

console.log(`[INIT] Conectando ao Supabase em: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    }
});

export default supabase;
