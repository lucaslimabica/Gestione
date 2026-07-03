import { createBrowserRouter } from 'react-router-dom';
// import { futureRoutes } from '@/features/customers/routes';
import { App } from '@/routes/App';
import { RouteErrorBoundary } from '@/routes/RouteErrorBoundary';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />, // is the parent route of all routes in the app, so it wraps all pages. This is where you put your layout shell (sidebar, topbar, etc.) that you want to show on every page.
        errorElement: <RouteErrorBoundary />, // This is the error boundary for the routed subtree, so it will catch errors from any route component rendered inside the <Outlet /> of RootLayout. It does NOT catch errors from event handlers or async code in components, those need their own try/catch.
        children: [
            // All routes in the app go here as children of RootLayout, so they will be rendered inside the <Outlet /> of RootLayout. The <Outlet /> is like a placeholder that gets replaced by the matched child route component.
            // Home
            {
                index: true,
                lazy: async () => {
                    const { Home } = await import('@/routes/Home');
                    return { Component: Home };
                },
            },

            // Frota
            {
                path: 'frota',
                lazy: async () => {
                    const { Vehicles } = await import('@/routes/Vehicles');
                    return { Component: Vehicles };
                },
            },

            // Features, one line per feature
            //...futureRoutes, // A feature can export an array of routes, which is useful if the feature has multiple pages. The routes can be defined in the same file as the feature's main component for routesis setted, or in a separate file. This keeps all the feature's code together and makes it easy to move or remove the feature later.

            // 404, must be last
            {
                path: '*',
                lazy: async () => {
                    const { NotFound } = await import('@/routes/NotFound');
                    return { Component: NotFound };
                },
            },
        ],
    },
]);
