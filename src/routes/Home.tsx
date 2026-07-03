// routes/Home.tsx to be rendered at the root/index route of the app. This is the first page users see when they visit the app.
import { Plus } from "lucide-react";
import { useState } from "react";
import PostItCard from "@/components/Home/PostItCard";
import PostItCreationModal from "@/components/Home/PostItCreationModal";
import PostItModal from "@/components/Home/PostItModal";
import { usePostIts } from "@/hooks/usePostIts";
import type { PostIt } from "@/types";

export function Home() {
    const { data: postItsList, isLoading, error } = usePostIts();
    const [selectedPostIt, setSelectedPostIt] = useState<PostIt | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="text-main">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">
                    Quadro
                </h1>
                <button
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} />
                    Novo Post-it
                </button>
            </div>

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

            {isCreating && (
                <PostItCreationModal onClose={() => setIsCreating(false)} />
            )}
        </div>
    );
}
