import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://srlecnxcpfsmdxvukba.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_0tdHnQkQ_9OyhHE-kescZw_xqEWSBJx';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
