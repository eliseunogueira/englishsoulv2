// src/components/ExerciseEngine.tsx
import { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { audioEngine } from '../utils/audio';
import { useAppStore } from '../store/useAppStore';

interface ExerciseEngineProps {
    lesson: Lesson;
}

export function ExerciseEngine({ lesson }: ExerciseEngineProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [reorderSelection, setReorderSelection] = useState<string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const updateProgress = useAppStore((state) => state.updateProgress);
    const exercises = lesson.exercises || [];
    const currentExercise = exercises[currentIndex];

    // Lida com clique em múltipla escolha
    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    // Lida com clique em reordenação
    const handleReorderClick = (word: string) => {
        if (isAnswered) return;
        setReorderSelection((prev) => {
            if (prev.includes(word)) return prev.filter(w => w !== word);
            return [...prev, word];
        });
    };

    // Verifica a resposta
    const checkAnswer = () => {
        if (!currentExercise) return;
        setIsAnswered(true);

        let isCorrect = false;
        if (currentExercise.type === 'reorder') {
            isCorrect = JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer);
        } else {
            isCorrect = selectedOption === currentExercise.correct_answer;
        }

        if (isCorrect) {
            setScore((prev) => prev + 1);
            if (currentExercise.audio_text) {
                audioEngine.playSentence(currentExercise.audio_text);
            }
        }
    };

    // Avança para a próxima pergunta
    const nextQuestion = () => {
        if (currentIndex + 1 < exercises.length) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setReorderSelection([]);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    // Finaliza o quiz e salva no Zustand
    const finishQuiz = () => {
        setIsFinished(true);
        updateProgress(lesson.id, score + (isAnswered && (selectedOption === currentExercise?.correct_answer || JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer)) ? 0 : 0), exercises.length);
        // Nota: A lógica de score final já está computada no state 'score'
        // Vamos salvar o score real:
        const finalScore = score; // O score já foi incrementado no checkAnswer
        updateProgress(lesson.id, finalScore, exercises.length);
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setReorderSelection([]);
        setIsAnswered(false);
        setIsFinished(false);
    };

    // Tela de Resultados
    if (isFinished) {
        const percentage = Math.round((score / exercises.length) * 100);
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-soul-gold mb-4">🏆 Quiz Concluído!</h3>
                <p className="text-gray-300 mb-2">Você acertou:</p>
                <div className="text-5xl font-extrabold text-white mb-6">
                    {score} <span className="text-2xl text-gray-500">/ {exercises.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
                    <div
                        className={`h-4 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-gray-400 mb-6">
                    {percentage >= 80 ? "Excelente! Você dominou esta lição." : "Continue praticando. A repetição é a mãe da fluência."}
                </p>
                <button
                    onClick={restartQuiz}
                    className="bg-soul-gold text-soul-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    if (!currentExercise) return null;

    const isReorder = currentExercise.type === 'reorder';

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mt-8">
            {/* Header do Quiz */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-soul-gold">🎯 Exercícios</h3>
                <span className="text-sm text-gray-400">
          Pergunta {currentIndex + 1} de {exercises.length}
        </span>
            </div>

            {/* Instrução */}
            <p className="text-lg text-white mb-6 font-medium">
                {currentExercise.instruction}
            </p>

            {/* Área da Pergunta (Reorder) */}
            {isReorder && (
                <div className="mb-6">
                    <div className="min-h-[60px] bg-soul-dark border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-wrap gap-2 mb-4">
                        {reorderSelection.length === 0 ? (
                            <span className="text-gray-600 italic">Clique nas palavras abaixo...</span>
                        ) : (
                            reorderSelection.map((word, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleReorderClick(word)}
                                    className="bg-soul-gold text-soul-dark font-bold px-4 py-2 rounded-md"
                                >
                                    {word}
                                </button>
                            ))
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {currentExercise.options.map((word, idx) => {
                            const isUsed = reorderSelection.includes(word);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleReorderClick(word)}
                                    disabled={isUsed}
                                    className={`px-4 py-2 rounded-md border transition-all ${
                                        isUsed
                                            ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                                            : 'bg-soul-dark border-gray-600 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                    }`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Área da Pergunta (Múltipla Escolha) */}
            {!isReorder && (
                <div className="space-y-3 mb-6">
                    {currentExercise.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentExercise.correct_answer;

                        let borderColor = 'border-gray-700';
                        let bgColor = 'bg-soul-dark';
                        let textColor = 'text-gray-300';

                        if (isAnswered) {
                            if (isCorrect) {
                                borderColor = 'border-green-500';
                                bgColor = 'bg-green-900/20';
                                textColor = 'text-green-400';
                            } else if (isSelected && !isCorrect) {
                                borderColor = 'border-red-500';
                                bgColor = 'bg-red-900/20';
                                textColor = 'text-red-400';
                            }
                        } else if (isSelected) {
                            borderColor = 'border-soul-gold';
                            bgColor = 'bg-soul-gold/10';
                            textColor = 'text-soul-gold';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderColor} ${bgColor} ${textColor}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end mt-6">
                {!isAnswered ? (
                    <button
                        onClick={checkAnswer}
                        disabled={isReorder ? reorderSelection.length === 0 : !selectedOption}
                        className="bg-soul-gold text-soul-dark font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Verificar Resposta
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="bg-white text-soul-dark font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        {currentIndex + 1 === exercises.length ? 'Ver Resultado' : 'Próxima Pergunta'}
                    </button>
                )}
            </div>
        </div>
    );
}