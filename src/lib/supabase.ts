import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/database.types';
import { env } from '@/lib/env';

export const supabase = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    },
);
