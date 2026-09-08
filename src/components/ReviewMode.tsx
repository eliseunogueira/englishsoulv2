// src/components/ReviewMode.tsx
import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { audioEngine } from '../utils/audio';
import type { Exercise } from '../types/lesson';

interface ReviewModeProps {
    onExit: () => void;
}

export function ReviewMode({ onExit }: ReviewModeProps) {
    const { lessons, progress, updateProgress } = useAppStore();

    // Coleta todos os exercícios das lições fracas (score < 80%)
    const reviewExercises = useMemo(() => {
        const weakLessons = lessons.filter(
            lesson => progress[lesson.id] && !progress[lesson.id].completed
        );

        const allExercises: (Exercise & { lessonId: string; lessonTitle: string })[] = [];

        weakLessons.forEach(lesson => {
            lesson.exercises.forEach(ex => {
                allExercises.push({
                    ...ex,
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                });
            });
        });

        // Embaralha os exercícios para o aluno não saber a ordem
        return allExercises.sort(() => Math.random() - 0.5);
    }, [lessons, progress]);

    // Estados do Quiz de Revisão
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [reorderSelection, setReorderSelection] = useState<string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentExercise = reviewExercises[currentIndex];

    const playExerciseAudio = () => {
        if (currentExercise?.audio_text) {
            audioEngine.playSentence(currentExercise.audio_text);
        }
    };

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleReorderClick = (word: string) => {
        if (isAnswered) return;
        if (reorderSelection.includes(word)) {
            setReorderSelection(prev => prev.filter(w => w !== word));
        } else {
            setReorderSelection(prev => [...prev, word]);
        }
    };

    const checkAnswer = () => {
        if (!currentExercise) return;
        setIsAnswered(true);

        let isCorrect = false;
        if (currentExercise.type === 'reorder' || currentExercise.type === 'listening') {
            isCorrect = JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer);
        } else {
            isCorrect = selectedOption === currentExercise.correct_answer;
        }

        if (isCorrect) {
            setScore(prev => prev + 1);
            if (currentExercise.audio_text) {
                audioEngine.playSentence(currentExercise.audio_text);
            }
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 < reviewExercises.length) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setReorderSelection([]);
            setIsAnswered(false);
        } else {
            finishReview();
        }
    };

    const finishReview = () => {
        setIsFinished(true);
        // Atualiza o progresso de cada lição fraca
        const weakLessons = lessons.filter(
            lesson => progress[lesson.id] && !progress[lesson.id].completed
        );
        weakLessons.forEach(lesson => {
            const lessonExercises = reviewExercises.filter(ex => ex.lessonId === lesson.id);
            const lessonCorrect = reviewExercises
                .filter((ex, idx) => {
                    if (ex.lessonId !== lesson.id) return false;
                    // Verifica se o aluno acertou (simplificado)
                    return idx < currentIndex + 1;
                }).length;

            if (lessonExercises.length > 0) {
                updateProgress(lesson.id, lessonCorrect, lessonExercises.length);
            }
        });
    };

    // --- Tela: Sem lições para revisar ---
    if (reviewExercises.length === 0) {
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-green-400 mb-4">🎉 Tudo em dia!</h3>
                <p className="text-gray-300 mb-6">
                    Você não tem lições para revisar no momento. Continue estudando novas lições!
                </p>
                <button
                    onClick={onExit}
                    className="bg-soul-gold text-soul-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    // --- Tela: Resultado Final ---
    if (isFinished) {
        const percentage = Math.round((score / reviewExercises.length) * 100);
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-soul-gold mb-4">🔄 Revisão Concluída!</h3>
                <p className="text-gray-300 mb-2">Você acertou:</p>
                <div className="text-5xl font-extrabold text-white mb-6">
                    {score} <span className="text-2xl text-gray-500">/ {reviewExercises.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${
                            percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-gray-400 mb-6 italic">
                    {percentage >= 80
                        ? "Excelente revisão! Suas lições fracas estão melhorando."
                        : "Continue revisando. A repetição é a chave da fluência."}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onExit}
                        className="bg-soul-gold text-soul-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
                    >
                        Voltar ao Dashboard
                    </button>
                    {percentage < 80 && (
                        <button
                            onClick={() => {
                                setCurrentIndex(0);
                                setScore(0);
                                setSelectedOption(null);
                                setReorderSelection([]);
                                setIsAnswered(false);
                                setIsFinished(false);
                            }}
                            className="bg-soul-dark border border-soul-gold text-soul-gold font-bold py-3 px-8 rounded-lg hover:bg-soul-gold hover:text-soul-dark transition-all"
                        >
                            Revisar Novamente
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // --- Tela: Quiz de Revisão ---
    const isReorder = currentExercise.type === 'reorder' || currentExercise.type === 'listening';
    const hasAudio = !!currentExercise.audio_text;

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                    🔄 Modo Revisão
                </h3>
                <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-medium">
            {currentIndex + 1} / {reviewExercises.length}
          </span>
                    <button
                        onClick={onExit}
                        className="text-xs text-gray-500 hover:text-white underline"
                    >
                        Sair
                    </button>
                </div>
            </div>

            {/* Dica: De qual lição é este exercício */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 mb-6 text-sm text-purple-300">
                📚 Lição: <span className="font-bold text-purple-200">{currentExercise.lessonTitle}</span>
            </div>

            {/* Instrução */}
            <p className="text-lg text-white mb-8 font-medium leading-relaxed">
                {currentExercise.instruction}
            </p>

            {/* Botão de Áudio */}
            {hasAudio && (
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={playExerciseAudio}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg hover:opacity-90 transition-all flex items-center gap-3 text-lg shadow-lg"
                    >
                        <span className="text-2xl">🔊</span>
                        {currentExercise.type === 'listening' ? 'Ouvir Frase' : 'Ouvir e Traduzir'}
                    </button>
                </div>
            )}

            {/* Reorder / Listening */}
            {isReorder && (
                <div className="mb-8">
                    <div className="min-h-[70px] bg-soul-dark border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-wrap gap-2 mb-6 items-center">
                        {reorderSelection.length === 0 ? (
                            <span className="text-gray-600 italic text-sm">
                Clique nas palavras para montar a frase...
              </span>
                        ) : (
                            reorderSelection.map((word, idx) => {
                                let wordClass = "bg-soul-gold text-soul-dark font-bold px-4 py-2 rounded-md";
                                if (isAnswered) {
                                    const correct = currentExercise.correct_answer as string[];
                                    wordClass = correct[idx] === word
                                        ? "bg-green-600 text-white font-bold px-4 py-2 rounded-md"
                                        : "bg-red-600 text-white font-bold px-4 py-2 rounded-md";
                                }
                                return (
                                    <button key={idx} onClick={() => !isAnswered && handleReorderClick(word)} disabled={isAnswered} className={wordClass}>
                                        {word}
                                    </button>
                                );
                            })
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {currentExercise.options.map((word, idx) => {
                            const isUsed = reorderSelection.includes(word);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleReorderClick(word)}
                                    disabled={isUsed || isAnswered}
                                    className={`px-4 py-2 rounded-md border transition-all ${
                                        isUsed
                                            ? 'bg-gray-800 border-gray-700 text-gray-600 opacity-50'
                                            : 'bg-soul-dark border-gray-600 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                    }`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                    {isAnswered && (
                        <div className={`mt-6 p-4 rounded-lg border-2 ${
                            JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer)
                                ? 'bg-green-900/20 border-green-500 text-green-400'
                                : 'bg-red-900/20 border-red-500 text-red-400'
                        }`}>
                            <div className="font-bold text-lg mb-2">
                                {JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer) ? '✅ Correto!' : '❌ Incorreto'}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">Ordem correta:</span> {(currentExercise.correct_answer as string[]).join(' ')}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Múltipla Escolha */}
            {!isReorder && (
                <div className="space-y-3 mb-8">
                    {currentExercise.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentExercise.correct_answer;
                        let borderColor = 'border-gray-700';
                        let bgColor = 'bg-soul-dark';
                        let textColor = 'text-gray-300';

                        if (isAnswered) {
                            if (isCorrect) { borderColor = 'border-green-500'; bgColor = 'bg-green-900/20'; textColor = 'text-green-400'; }
                            else if (isSelected) { borderColor = 'border-red-500'; bgColor = 'bg-red-900/20'; textColor = 'text-red-400'; }
                        } else if (isSelected) {
                            borderColor = 'border-soul-gold'; bgColor = 'bg-soul-gold/10'; textColor = 'text-soul-gold';
                        }

                        return (
                            <button key={idx} onClick={() => handleOptionClick(option)} disabled={isAnswered}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium ${borderColor} ${bgColor} ${textColor}`}>
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end mt-6 border-t border-gray-700 pt-6">
                {!isAnswered ? (
                    <button onClick={checkAnswer}
                            disabled={isReorder ? reorderSelection.length === 0 : !selectedOption}
                            className="bg-purple-600 text-white font-bold py-2 px-8 rounded-lg hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        Verificar Resposta
                    </button>
                ) : (
                    <button onClick={nextQuestion}
                            className="bg-white text-soul-dark font-bold py-2 px-8 rounded-lg hover:bg-gray-200 transition-all">
                        {currentIndex + 1 === reviewExercises.length ? 'Ver Resultado' : 'Próxima Pergunta'}
                    </button>
                )}
            </div>
        </div>
    );
}