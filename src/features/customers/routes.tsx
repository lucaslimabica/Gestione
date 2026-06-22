import type { RouteObject } from 'react-router-dom';

/**
 * Customers feature routes.
 *
 * Spread into the global router with `...customersRoutes`.
 * Each entry uses `lazy` so the bundle is only fetched when the
 * user navigates here.
 * A feature can export an array of routes, which is useful if the feature has multiple pages. The routes can be defined in the same file as the feature's main component for routesis setted, or in a separate file. This keeps all the feature's code together and makes it easy to move or remove the feature later.
 * Any changes made here does need to be reflected in the global routes.tsx
 */
export const customersRoutes: RouteObject[] = [
    {
        path: 'customers',
        lazy: async () => {
            const { CustomersListPage } =
                await import('@/features/customers/routes/CustomersListPage');
            return { Component: CustomersListPage };
        },
    },
    // So, sub-routes go here this way, and the main route (e.g. 'customers') can be used to show a list of customers, while sub-routes (e.g. 'customers/:id') can be used to show details for a specific customer or to edit a customer.
    // { path: 'customers/:id', lazy: ... },
    // { path: 'customers/:id/edit', lazy: ... },
];
