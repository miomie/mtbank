import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tgbygvgeeswjygfrhkdf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fkZ-_nYxrFKQBhdrAau36g_gaZ9aDeu'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);