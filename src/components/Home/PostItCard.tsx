import type { PostIt } from "@/types";

// Interface declaration to be used as a shape
interface PostItCardProps {
    postIt: PostIt;
}

export default function PostItCard({ postIt }: PostItCardProps) {
    // Work like a constructor to set any properties
    
    const getPriorityInfo = (prio: number) => {
      if (prio === 3) return ['Alta', '#ff0000'];
      if (prio === 2) return ['Média', '#ffff00'];
      return ['Baixa', '#63ff2c'];
    };

    return (
        <div className="rounded-lg shadow-md flex-col" style={{ backgroundColor: postIt.color || '#FEF08A' }}> // Fallback
            <h1 style={{color: getPriorityInfo(postIt.priority)[1]}}>{postIt.title} | Prioridade {getPriorityInfo(postIt.priority)[0]}</h1>
            <p>{postIt.content}</p>
        </div>
    )
}

