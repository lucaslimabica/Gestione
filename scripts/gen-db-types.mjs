// This script generates TypeScript types for the Supabase database schema and saves them to src/lib/database.types.ts.
import { config } from 'dotenv';
import { execSync } from 'node:child_process';

config({ path: '.env.local' });

const id = process.env.SUPABASE_PROJECT_ID;
if (!id) {
    console.error(
        '[db:types] SUPABASE_PROJECT_ID missing in .env.local.\n' +
            'Copy .env.example to .env.local and fill it in.',
    );
    process.exit(1);
}

execSync(
    `npx supabase gen types typescript --project-id ${id} --schema public > src/lib/database.types.ts`,
    { stdio: 'inherit', shell: true },
);
