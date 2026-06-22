// routes/RouteErrorBoundary.tsx to catch errors thrown during lazy import resolution or by route components during render.
// This is the error boundary for the routed subtree,
// so it will catch errors from any route component rendered inside the <Outlet /> of RootLayout.
// It does NOT catch errors from event handlers or async code in components, those need their own try/catch.
// I imported this as an "default" error boundary in the router config, so it will be used for all routes by default.

import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function RouteErrorBoundary() {
    const error = useRouteError();
    const title = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : 'Something went wrong';
    const detail =
        error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'Unknown error';

    return (
        <div className="flex min-h-screen items-center justify-center bg-indigo-950 text-white">
            <div className="max-w-md text-center">
                <h1 className="text-2xl font-bold text-indigo-300">{title}</h1>
                <p className="mt-2 text-slate-400">{detail}</p>
                <p className="mt-2 text-slate-400">
                    <Link
                        to="/"
                        className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Go Back to Homepage
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
