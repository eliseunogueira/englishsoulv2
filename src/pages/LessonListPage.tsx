// src/pages/LessonListPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { mockLessons } from '../data/mockLessons';
import { LessonCard } from '../components/LessonCard';

export function LessonListPage() {
    const { lessons, setLessons, setCurrentLesson } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (lessons.length === 0) {
            setLessons(mockLessons); // Agora carrega as 5 lições estratégicas
        }
    }, [lessons.length, setLessons]);

    const handleLessonClick = (lesson: typeof mockLessons[0]) => {
        setCurrentLesson(lesson);
        navigate(`/lesson/${lesson.id}`);
    };

    return (
        <div className="min-h-screen bg-soul-dark text-soul-text p-6 font-sans">
            <header className="max-w-5xl mx-auto mb-10 border-b border-soul-gray pb-6">
                <h1 className="text-4xl font-extrabold text-soul-gold tracking-tight">English Soul</h1>
                <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Laboratório de Domínio · 5 Lições Estratégicas</p>
            </header>

            <main className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-2">Stress Test do Modelo</h2>
                    <p className="text-gray-400 text-sm">
                        Estas 5 lições testam os limites da nossa arquitetura: Lição 1 (Base), Lição 13 (TO BE),
                        Lição 17 (Passado), Lição 21 (Futuro), Lição 26 (-ING + Perfect).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            onClick={() => handleLessonClick(lesson)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}