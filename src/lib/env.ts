function required(name: keyof ImportMetaEnv): string {
    const value = import.meta.env[name];
    if (!value) {
        throw new Error(
            `[env] Variable "${name}" not found. ` +
                `Copy .env.example to .env.local and fill in the value.`,
        );
    }
    return value;
}

export const env = {
    SUPABASE_URL: required('VITE_SUPABASE_URL'),
    SUPABASE_PUBLISHABLE_KEY: required('VITE_SUPABASE_PUBLISHABLE_KEY'),
    COMPANY_NAME: required('VITE_COMPANY_NAME'),
} as const;
