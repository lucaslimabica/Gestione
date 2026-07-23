// routes/Home.tsx to be rendered at the root/index route of the app. This is the first page users see when they visit the app.
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import PostItCard from "@/components/Home/PostItCard";
import PostItCreationModal from "@/components/Home/PostItCreationModal";
import PostItModal from "@/components/Home/PostItModal";
import { usePostIts } from "@/hooks/usePostIts";
import type { PostIt } from "@/types";

const ALL_FILTER = 'Todos';

export function Home() {
    const { data: postItsList, isLoading, error } = usePostIts();
    const [selectedPostIt, setSelectedPostIt] = useState<PostIt | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [search, setSearch] = useState('');
    const [responsibleFilter, setResponsibleFilter] = useState(ALL_FILTER);
    const [locationFilter, setLocationFilter] = useState(ALL_FILTER);

    // Distinct, already-used values to populate the filter selects
    const responsibleOptions = useMemo(() => (
        Array.from(new Set(postItsList?.map((postIt) => postIt.responsible).filter((value): value is string => !!value))).sort()
    ), [postItsList]);
    const locationOptions = useMemo(() => (
        Array.from(new Set(postItsList?.map((postIt) => postIt.location).filter((value): value is string => !!value))).sort()
    ), [postItsList]);

    const filteredPostIts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return postItsList?.filter((postIt) => {
            const matchesSearch = !query
                || postIt.title.toLowerCase().includes(query)
                || postIt.responsible?.toLowerCase().includes(query)
                || postIt.location?.toLowerCase().includes(query);
            const matchesResponsible = responsibleFilter === ALL_FILTER || postIt.responsible === responsibleFilter;
            const matchesLocation = locationFilter === ALL_FILTER || postIt.location === locationFilter;
            return matchesSearch && matchesResponsible && matchesLocation;
        });
    }, [postItsList, search, responsibleFilter, locationFilter]);

    return (
        <div className="text-main">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                    Quadro
                </h1>
                <button
                    className="flex items-center gap-1.5 self-start rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover sm:self-auto"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} />
                    Novo Post-it
                </button>
            </div>

            {/* Search and filters */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search size={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-main/50" />
                    <input
                        className="w-full rounded-lg border border-border-main bg-surface py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por título, responsável ou localização"
                    />
                </div>
                <select
                    className="rounded-lg border border-border-main bg-surface px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={responsibleFilter}
                    onChange={(e) => setResponsibleFilter(e.target.value)}
                >
                    <option value={ALL_FILTER}>Todos os responsáveis</option>
                    {responsibleOptions.map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
                <select
                    className="rounded-lg border border-border-main bg-surface px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                >
                    <option value={ALL_FILTER}>Todas as localizações</option>
                    {locationOptions.map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            {isLoading && <p className="mt-4 text-main/60">Carregando...</p>}
            {error && <p className="mt-4 text-red-600">Não foi possível carregar os post-it's.</p>}


            {/* Pending Post Its*/}
            {!isLoading && !error && (
                postItsList?.length === 0 ?
                <p className="mt-4 text-main/60">Aqui ficarão seus Post-it's</p> :
                filteredPostIts?.filter((postIt) => postIt.done === false).length === 0 ?
                <p className="mt-4 text-main/60">Nenhum post-it encontrado</p> :
                <div className="mt-6 flex flex-wrap gap-5">
                    {filteredPostIts?.filter(function (postIt) {
                        return postIt.done === false;
                    }).map(postIt => (
                        <PostItCard
                            key={postIt.id}
                            postIt={postIt}
                            onClick={() => setSelectedPostIt(postIt)}
                        />
                    ))}
                </div>
            )}


            <h2 className="text-4xl font-bold tracking-tight mt-6">Post-Its Concluídos</h2>
            {/* Done Post Its*/}
            {!isLoading && !error && (
                postItsList?.length === 0 ?
                <p className="mt-4 text-main/60">Aqui ficarão seus Post-it's</p> :
                filteredPostIts?.filter((postIt) => postIt.done === true).length === 0 ?
                <p className="mt-4 text-main/60">Nenhum post-it encontrado</p> :
                <div className="mt-6 flex flex-wrap gap-5">
                    {filteredPostIts?.filter(function (postIt) {
                        return postIt.done === true;
                    }).map(postIt => (
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
