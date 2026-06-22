import { QueryClient } from '@tanstack/react-query';
// Setting the default options for all queries in the app

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 1000, // Time to make data fresh
            gcTime: 5 * 60 * 1000, // Time to garbage collect unused data
            retry: 1,
        },
    },
});
