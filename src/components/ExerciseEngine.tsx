// src/components/ExerciseEngine.tsx
import { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { audioEngine } from '../utils/audio';
import { useAppStore } from '../store/useAppStore';

interface ExerciseEngineProps {
    lesson: Lesson;
}

export function ExerciseEngine({ lesson }: ExerciseEngineProps) {
    const exercises = lesson.exercises || [];
    const updateProgress = useAppStore((state) => state.updateProgress);

    // Estado do Quiz
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [reorderSelection, setReorderSelection] = useState<string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentExercise = exercises[currentIndex];

    // --- Lógica de Interação ---

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleReorderClick = (word: string) => {
        if (isAnswered) return;

        // Se a palavra já está na resposta, remove (volta para o pool)
        if (reorderSelection.includes(word)) {
            setReorderSelection(prev => prev.filter(w => w !== word));
        } else {
            // Se está no pool, adiciona na resposta
            setReorderSelection(prev => [...prev, word]);
        }
    };

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

    const finishQuiz = () => {
        setIsFinished(true);
        // Salva o progresso no Zustand (localStorage)
        updateProgress(lesson.id, score, exercises.length);
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setReorderSelection([]);
        setIsAnswered(false);
        setIsFinished(false);
    };

    // --- Renderização ---

    // Tela de Resultados
    if (isFinished) {
        const percentage = Math.round((score / exercises.length) * 100);
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-soul-gold mb-4">🏆 Lição Concluída!</h3>
                <p className="text-gray-300 mb-2">Sua pontuação:</p>
                <div className="text-5xl font-extrabold text-white mb-6">
                    {score} <span className="text-2xl text-gray-500">/ {exercises.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-gray-400 mb-6 italic">
                    {percentage >= 80
                        ? "Excelente! Você dominou os conceitos desta lição."
                        : "A repetição é a mãe da fluência. Tente novamente!"}
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
                <h3 className="text-xl font-bold text-soul-gold flex items-center gap-2">
                    🎯 Exercícios Práticos
                </h3>
                <span className="text-sm text-gray-400 font-medium">
          {currentIndex + 1} / {exercises.length}
        </span>
            </div>

            {/* Instrução */}
            <p className="text-lg text-white mb-8 font-medium leading-relaxed">
                {currentExercise.instruction}
            </p>

            {/* Área de Interação: REORDER */}
            {isReorder && (
                <div className="mb-8">
                    {/* Zona de Resposta */}
                    <div className="min-h-[70px] bg-soul-dark border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-wrap gap-2 mb-6 items-center">
                        {reorderSelection.length === 0 ? (
                            <span className="text-gray-600 italic text-sm">Clique nas palavras abaixo para montar a frase...</span>
                        ) : (
                            reorderSelection.map((word, idx) => {
                                // Feedback visual após verificar
                                let wordClass = "bg-soul-gold text-soul-dark font-bold px-4 py-2 rounded-md hover:opacity-90 transition-all";

                                if (isAnswered) {
                                    const correctAnswer = currentExercise.correct_answer as string[];
                                    const isCorrectPosition = correctAnswer[idx] === word;

                                    if (isCorrectPosition) {
                                        wordClass = "bg-green-600 text-white font-bold px-4 py-2 rounded-md";
                                    } else {
                                        wordClass = "bg-red-600 text-white font-bold px-4 py-2 rounded-md";
                                    }
                                }

                                return (
                                    <button
                                        key={`ans-${idx}`}
                                        onClick={() => !isAnswered && handleReorderClick(word)}
                                        disabled={isAnswered}
                                        className={wordClass}
                                    >
                                        {word}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Pool de Palavras */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {currentExercise.options.map((word, idx) => {
                            const isUsed = reorderSelection.includes(word);
                            return (
                                <button
                                    key={`pool-${idx}`}
                                    onClick={() => handleReorderClick(word)}
                                    disabled={isUsed || isAnswered}
                                    className={`px-4 py-2 rounded-md border transition-all ${
                                        isUsed
                                            ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                                            : 'bg-soul-dark border-gray-600 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                    }`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mensagem de Feedback após verificar */}
                    {isAnswered && (
                        <div className={`mt-6 p-4 rounded-lg border-2 ${
                            JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer)
                                ? 'bg-green-900/20 border-green-500 text-green-400'
                                : 'bg-red-900/20 border-red-500 text-red-400'
                        }`}>
                            <div className="font-bold text-lg mb-2">
                                {JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer)
                                    ? '✅ Correto!'
                                    : '❌ Incorreto'}
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold">Ordem correta:</span>{' '}
                                {(currentExercise.correct_answer as string[]).join(' ')}
                            </div>
                        </div>
                    )}
                </div>
            )}



            {/* Área de Interação: MÚLTIPLA ESCOLHA */}
            {!isReorder && (
                <div className="space-y-3 mb-8">
                    {currentExercise.options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentExercise.correct_answer;

                        let borderColor = 'border-gray-700';
                        let bgColor = 'bg-soul-dark';
                        let textColor = 'text-gray-300';

                        // Estilos de Feedback
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
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium ${borderColor} ${bgColor} ${textColor}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end mt-6 border-t border-gray-700 pt-6">
                {!isAnswered ? (
                    <button
                        onClick={checkAnswer}
                        disabled={isReorder ? reorderSelection.length === 0 : !selectedOption}
                        className="bg-soul-gold text-soul-dark font-bold py-2 px-8 rounded-lg hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Verificar Resposta
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="bg-white text-soul-dark font-bold py-2 px-8 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        {currentIndex + 1 === exercises.length ? 'Ver Resultado' : 'Próxima Pergunta'}
                    </button>
                )}
            </div>
        </div>
    );
}