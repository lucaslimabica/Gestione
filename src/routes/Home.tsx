// routes/Home.tsx to be rendered at the root/index route of the app. This is the first page users see when they visit the app.
import { useState } from "react";

import PostItCard from "@/components/Home/PostItCard";
import PostItModal from "@/components/Home/PostItModal";
import { usePostIts } from "@/hooks/usePostIts";
import type { PostIt } from "@/types";

export function Home() {
    const { data: postItsList, isLoading, error } = usePostIts();
    const [selectedPostIt, setSelectedPostIt] = useState<PostIt | null>(null);

    return (
        <div className="text-main">
            <h1 className="text-4xl font-bold tracking-tight">
                Quadro
            </h1>

            {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
            {error && <p className="mt-4 text-red-600">Não foi possível carregar os post-it's.</p>}

            {!isLoading && !error && (
                postItsList?.length === 0 ?
                <p className="mt-4 text-main/60">Aqui ficarão seus Post-it's</p> :
                <div className="mt-6 flex flex-wrap gap-5">
                    {postItsList?.map(postIt => (
                        <PostItCard
                            key={postIt.id}
                            postIt={postIt}
                            onClick={() => setSelectedPostIt(postIt)}
                        />
                    ))}
                </div>
            )}

            {selectedPostIt && (
                <PostItModal
                    postIt={selectedPostIt}
                    onClose={() => setSelectedPostIt(null)}
                />
            )}
        </div>
    );
}
