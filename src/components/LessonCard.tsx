// src/components/LessonCard.tsx
import type { Lesson } from '../types/lesson';
import { useAppStore } from '../store/useAppStore';

// ✅ A interface só pede o lesson e uma função de clique simples
interface LessonCardProps {
    lesson: Lesson;
    onClick: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
    const progress = useAppStore((state) => state.progress[lesson.id]);

    const isCompleted = progress?.completed;
    const bestScore = progress?.bestScore || 0;

    return (
        <div
            onClick={onClick} // ✅ Usa o onClick simples
            className="bg-soul-gray border border-soul-gray hover:border-soul-gold rounded-lg p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg group"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-soul-gold group-hover:text-white transition-colors">
                    {lesson.title}
                </h3>
            </div>

            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                {lesson.semantic_field}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
        <span className="text-[10px] font-semibold text-gray-500 uppercase">
          {lesson.phase}
        </span>

                {isCompleted ? (
                    <span className="bg-green-900/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/50">
            ✅ {bestScore}%
          </span>
                ) : bestScore > 0 ? (
                    <span className="bg-yellow-900/20 text-soul-gold text-xs font-bold px-3 py-1 rounded-full border border-soul-gold/50">
            🔄 {bestScore}%
          </span>
                ) : (
                    <span className="text-gray-600 text-xs font-medium">
            Não iniciado
          </span>
                )}
            </div>
        </div>
    );
}