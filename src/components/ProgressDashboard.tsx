// src/components/ProgressDashboard.tsx
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { Lesson } from '../types/lesson';

export function ProgressDashboard() {
    const { lessons, progress, setCurrentLesson } = useAppStore();
    const navigate = useNavigate();

    // Cálculos de estatísticas
    const totalLessons = lessons.length;
    const completedLessons = Object.values(progress).filter(p => p.completed).length;
    const inProgressLessons = Object.values(progress).filter(p => !p.completed && p.attempts > 0).length;
    const notStartedLessons = totalLessons - completedLessons - inProgressLessons;

    // Score médio geral
    const allScores = Object.values(progress).map(p => p.bestScore);
    const averageScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    // Skills com mais dificuldade (baseado em exercícios errados)
    // Por enquanto, vamos mostrar lições com menor score
    const strugglingLessons = lessons
        .filter(lesson => progress[lesson.id] && !progress[lesson.id].completed && progress[lesson.id].bestScore < 80)
        .sort((a, b) => (progress[a.id]?.bestScore || 0) - (progress[b.id]?.bestScore || 0))
        .slice(0, 3);

    // Próxima lição recomendada (primeira não concluída)
    const nextLesson = lessons.find(lesson => !progress[lesson.id]?.completed);

    const handleLessonClick = (lesson: Lesson) => {
        setCurrentLesson(lesson);
        navigate(`/lesson/${lesson.id}`);
    };

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-soul-gold mb-6 flex items-center gap-2">
                📊 Seu Progresso
            </h2>

            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-soul-dark border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-extrabold text-white mb-1">
                        {completedLessons}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                        Concluídas
                    </div>
                </div>

                <div className="bg-soul-dark border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-extrabold text-soul-gold mb-1">
                        {inProgressLessons}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                        Em Progresso
                    </div>
                </div>

                <div className="bg-soul-dark border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-extrabold text-gray-500 mb-1">
                        {notStartedLessons}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                        Não Iniciadas
                    </div>
                </div>

                <div className="bg-soul-dark border border-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-extrabold text-green-400 mb-1">
                        {averageScore}%
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                        Score Médio
                    </div>
                </div>
            </div>

            {/* Barra de Progresso Geral */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progresso Total</span>
                    <span className="text-sm text-soul-gold font-bold">
            {completedLessons} / {totalLessons} lições
          </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-soul-gold to-yellow-500 transition-all duration-500"
                        style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Próxima Lição */}
                {nextLesson && (
                    <button
                        onClick={() => handleLessonClick(nextLesson)}
                        className="bg-gradient-to-r from-soul-gold to-yellow-600 text-soul-dark font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all text-left"
                    >
                        <div className="text-xs uppercase tracking-wider mb-1 opacity-75">
                            Continuar Estudando
                        </div>
                        <div className="text-lg">
                            {nextLesson.title}
                        </div>
                        <div className="text-xs mt-1 opacity-75">
                            {nextLesson.semantic_field}
                        </div>
                    </button>
                )}

                {/* Revisão (placeholder para futura feature) */}
                <button
                    disabled={strugglingLessons.length === 0}
                    className="bg-soul-dark border border-gray-700 text-gray-300 font-bold py-4 px-6 rounded-lg hover:border-soul-gold hover:text-soul-gold transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="text-xs uppercase tracking-wider mb-1 opacity-75">
                        Modo Revisão
                    </div>
                    <div className="text-lg">
                        {strugglingLessons.length > 0
                            ? `${strugglingLessons.length} lição(ões) para revisar`
                            : 'Nenhuma revisão necessária'}
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                        Em breve: Repetição Espaçada
                    </div>
                </button>
            </div>

            {/* Lições com Dificuldade */}
            {strugglingLessons.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                        ⚠️ Lições que Precisam de Atenção
                    </h3>
                    <div className="space-y-2">
                        {strugglingLessons.map(lesson => {
                            const lessonProgress = progress[lesson.id];
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson)}
                                    className="w-full bg-soul-dark border border-red-500/30 hover:border-red-500 rounded-lg p-4 text-left transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-white font-medium">{lesson.title}</div>
                                            <div className="text-xs text-gray-500">{lesson.semantic_field}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-red-400 font-bold text-lg">
                                                {lessonProgress?.bestScore || 0}%
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {lessonProgress?.attempts || 0} tentativa(s)
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Mensagem Motivacional */}
            <div className="text-center py-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm italic">
                    {completedLessons === 0
                        ? "Comece sua jornada no English Soul!"
                        : completedLessons === totalLessons
                            ? "🎉 Parabéns! Você completou todas as lições!"
                            : "Continue praticando. A repetição é a mãe da fluência."}
                </p>
            </div>
        </div>
    );
}