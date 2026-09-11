// src/components/ReviewMode.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { audioEngine } from '../utils/audio';
import type { Exercise, Lesson } from '../types/lesson';

interface ReviewModeProps {
    onExit: () => void;
}

type ReviewExercise = Exercise & {
    lessonId: string;
    lessonTitle: string;
};

// ✅ FUNÇÃO PURA CORRIGIDA: Lida com weakSkills vazio
function buildReviewSession(
    lessons: Lesson[],
    skillProgress: Record<string, { attempts: number; correct: number; skill: string }>
): ReviewExercise[] {
    const weakSkills = Object.values(skillProgress)
        .filter(s => s.attempts >= 2 && (s.correct / s.attempts) < 0.8)
        .sort((a, b) => (a.correct / a.attempts) - (b.correct / b.attempts));

    const allExercises: ReviewExercise[] = [];

    // ✅ CORREÇÃO: Verifica se há skills fracas antes de acessar [0]
    if (weakSkills.length > 0) {
        const weakestSkill = weakSkills[0].skill;
        lessons.forEach(lesson => {
            lesson.exercises.forEach(ex => {
                if (ex.skill === weakestSkill) {
                    allExercises.push({ ...ex, lessonId: lesson.id, lessonTitle: lesson.title });
                }
            });
        });
    } else {
        // Fallback: últimas 3 lições
        lessons.slice(-3).forEach(lesson => {
            lesson.exercises.forEach(ex => {
                allExercises.push({ ...ex, lessonId: lesson.id, lessonTitle: lesson.title });
            });
        });
    }

    // Remove duplicatas
    const uniqueIds = new Set<string>();
    const uniqueExercises = allExercises.filter(ex => {
        if (uniqueIds.has(ex.id)) return false;
        uniqueIds.add(ex.id);
        return true;
    });

    // Embaralha UMA VEZ
    return [...uniqueExercises].sort(() => Math.random() - 0.5);
}

const skillLabels: Record<string, string> = {
    'listening_modal': 'Listening: Modais',
    'listening future': 'Listening: Futuro',
    'listening_continuous': 'Listening: Presente Contínuo',
    'present_continuous_syntax': 'Sintaxe: Presente Contínuo',
    'third_person': 'Terceira Pessoa (+S)',
    'there_be_agreement': 'Concordância There is/are',
    'modal_invariance': 'Modais Invariáveis',
    'wh_question_syntax': 'WH-Questions',
    'imperative_form': 'Forma Imperativa',
    'infinitive_conjugation': 'Infinitivo (TO + VERB)',
    'past_negative': 'Passado Negativo',
    'to_be_frequency_syntax': 'TO BE + Frequência',
    'listening_comprehension': 'Compreensão Auditiva',
    'syntax': 'Sintaxe Geral',
    'past negative syntax': 'Sintaxe: Passado Negativo',
    'present perfect chunk': 'Present Perfect (Chunks)',
    'listening continuous comprehension': 'Listening: Comp. do Contínuo',
    'listening continuous': 'Listening: Presente Contínuo',
    'future negative': 'Futuro Negativo (WON\'T)',
    'listening future comprehension': 'Listening: Comp. do Futuro',
    'past irregular': 'Verbos Irregulares (Passado)',
};

export function ReviewMode({ onExit }: ReviewModeProps) {
    const { lessons, skillProgress, updateSkillProgress } = useAppStore();

    // ✅ CORREÇÃO: Inicialização preguiçosa (lazy initialization)
    // Executa APENAS UMA VEZ quando o componente monta
    // Não usa useEffect, não causa cascading renders
    const [reviewExercises] = useState<ReviewExercise[]>(() => {
        return buildReviewSession(lessons, skillProgress);
    });

    // Estados do quiz
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [reorderSelection, setReorderSelection] = useState<string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentExercise = reviewExercises[currentIndex];

    // ... resto do componente permanece igual ...

    const playExerciseAudio = (text: string | undefined) => {
        if (text) {
            audioEngine.playSentence(text);
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

        const isReorder = currentExercise.type === 'reorder' || currentExercise.type === 'listening';
        const correctAnswer = currentExercise.correct_answer;

        let isCorrect = false;
        if (isReorder && Array.isArray(correctAnswer)) {
            isCorrect = JSON.stringify(reorderSelection) === JSON.stringify(correctAnswer);
        } else if (!isReorder && typeof correctAnswer === 'string') {
            isCorrect = selectedOption === correctAnswer;
        }

        setIsAnswered(true);

        // ✅ Incrementa score se acertou
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Atualiza skill progress (isso NÃO afeta a sessão congelada)
        if (currentExercise.skill) {
            updateSkillProgress(currentExercise.skill, isCorrect);
        }

        // Toca áudio com delay para garantir feedback visual primeiro
        if (isCorrect && currentExercise.audio_text) {
            setTimeout(() => playExerciseAudio(currentExercise.audio_text), 100);
        }
    };

    const nextQuestion = () => {
        // Limpa estados
        setSelectedOption(null);
        setReorderSelection([]);
        setIsAnswered(false);

        // Avança ou termina
        if (currentIndex + 1 < reviewExercises.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    // Se não há exercícios
    if (!currentExercise || reviewExercises.length === 0) {
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-green-400 mb-4">🎉 Tudo em dia!</h3>
                <p className="text-gray-300 mb-6">Nenhuma habilidade precisa de revisão.</p>
                <button onClick={onExit} className="bg-soul-gold text-soul-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all">
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    // Tela final
    if (isFinished) {
        const percentage = Math.round((score / reviewExercises.length) * 100);
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-8 text-center mt-8">
                <h3 className="text-2xl font-bold text-soul-gold mb-4">🔄 Revisão Concluída!</h3>
                <div className="text-5xl font-extrabold text-white mb-6">
                    {score} <span className="text-2xl text-gray-500">/ {reviewExercises.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
                    <div className={`h-4 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <button onClick={onExit} className="bg-soul-gold text-soul-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all">
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }

    const isReorder = currentExercise.type === 'reorder' || currentExercise.type === 'listening';
    const hasAudio = !!currentExercise.audio_text;
    const skillLabel = currentExercise.skill ? (skillLabels[currentExercise.skill] || currentExercise.skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) : null;

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-purple-400">🔄 Modo Revisão Inteligente</h3>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{currentIndex + 1} / {reviewExercises.length}</span>
                    <button onClick={onExit} className="text-xs text-gray-500 hover:text-white underline">Sair</button>
                </div>
            </div>

            {/* Skill Label */}
            {skillLabel && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 mb-6 text-sm text-purple-300">
                    🎯 Foco: <span className="font-bold text-purple-200">{skillLabel}</span>
                </div>
            )}

            {/* Instruction */}
            <p className="text-lg text-white mb-8 font-medium">{currentExercise.instruction}</p>

            {/* Audio Button */}
            {hasAudio && (
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={() => playExerciseAudio(currentExercise.audio_text)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg hover:opacity-90 transition-all flex items-center gap-3 text-lg shadow-lg"
                    >
                        🔊 Ouvir Áudio
                    </button>
                </div>
            )}

            {/* Reorder UI */}
            {isReorder && (
                <div className="mb-8">
                    <div className="min-h-[70px] bg-soul-dark border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-wrap gap-2 mb-6 items-center">
                        {reorderSelection.length === 0 ? (
                            <span className="text-gray-600 italic text-sm">Clique nas palavras para montar a frase...</span>
                        ) : (
                            reorderSelection.map((word, idx) => {
                                let wordClass = "bg-soul-gold text-soul-dark font-bold px-4 py-2 rounded-md";
                                if (isAnswered) {
                                    const correct = Array.isArray(currentExercise.correct_answer) ? currentExercise.correct_answer : [];
                                    wordClass = correct[idx] === word ? "bg-green-600 text-white" : "bg-red-600 text-white";
                                }
                                return (
                                    <button key={idx} onClick={() => !isAnswered && handleReorderClick(word)} disabled={isAnswered} className={`${wordClass} font-bold px-4 py-2 rounded-md`}>
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
                                    className={`px-4 py-2 rounded-md border transition-all ${isUsed ? 'bg-gray-800 border-gray-700 text-gray-600 opacity-50' : 'bg-soul-dark border-gray-600 text-gray-300 hover:border-soul-gold hover:text-soul-gold'}`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                    {isAnswered && (
                        <div className={`mt-6 p-4 rounded-lg border-2 ${JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer) ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
                            <div className="font-bold text-lg mb-2">{JSON.stringify(reorderSelection) === JSON.stringify(currentExercise.correct_answer) ? '✅ Correto!' : '❌ Incorreto'}</div>
                            <div className="text-sm">
                                <span className="font-semibold">Ordem correta:</span> {Array.isArray(currentExercise.correct_answer) ? currentExercise.correct_answer.join(' ') : currentExercise.correct_answer}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Multiple Choice */}
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

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 border-t border-gray-700 pt-6">
                {!isAnswered ? (
                    <button
                        onClick={checkAnswer}
                        disabled={isReorder ? reorderSelection.length === 0 : !selectedOption}
                        className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Verificar Resposta
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="bg-white text-soul-dark font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-all"
                    >
                        {currentIndex + 1 === reviewExercises.length ? 'Ver Resultado Final' : 'Entendi, Próxima →'}
                    </button>
                )}
            </div>
        </div>
    );
}