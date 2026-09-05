// src/pages/LessonListPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { mockLesson1 } from '../data/mockLessons';
import { LessonCard } from '../components/LessonCard';
import type {Lesson} from "../types/lesson.ts";

export function LessonListPage() {
    const { lessons, setLessons, setCurrentLesson } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (lessons.length === 0) {
            setLessons([mockLesson1]); // No futuro, virá da API
        }
    }, [lessons.length, setLessons]);

    // ✅ Cria a função que o Card vai chamar
    const handleLessonClick = (lesson: Lesson) => {
        setCurrentLesson(lesson);
        navigate(`/lesson/${lesson.id}`);
    };

    return (
        <div className="min-h-screen bg-soul-dark text-soul-text p-6 font-sans">
            <header className="max-w-5xl mx-auto mb-10 border-b border-soul-gray pb-6">
                <h1 className="text-4xl font-extrabold text-soul-gold tracking-tight">English Soul</h1>
                <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Mapa da Frase · Volume 1</p>
            </header>

            <main className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Fase 1 · Fundação</h2>
                    <span className="text-sm text-gray-500">{lessons.length} lições</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            // ✅ Passa a função embrulho. Note a arrow function!
                            onClick={() => handleLessonClick(lesson)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}