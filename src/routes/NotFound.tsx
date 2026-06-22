// routes/NotFound.tsx to be rendered when a user navigates to a non-existent route.
import { Link } from 'react-router-dom'; // To add a link back to the homepage, works just like a normal <a> but without the full page reload, since it's client-side routing.

export function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-indigo-950 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-indigo-300 tracking-tight">
                    Appendix 404
                </h1>
                <p className="mt-2 text-slate-400">
                    Page Not Found :(, try a different URL or{' '}
                    <Link
                        to="/"
                        className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar à Home
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
