// routes/Home.tsx to be rendered at the root/index route of the app. This is the first page users see when they visit the app.
export function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-base text-main">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-main tracking-tight">
                    Appendix
                </h1>
                <p className="mt-2 text-slate-400">Página da Home</p>
                <div className="custom-button mt-4">{/*Empty*/}</div>
            </div>
        </div>
    );
}
