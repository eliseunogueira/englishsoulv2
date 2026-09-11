// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lesson, LessonProgress } from '../types/lesson';

/**
 * Interface para progresso individual por skill/habilidade.
 * Permite diagnóstico granular além do nível da lição.
 */
export interface SkillProgress {
    skill: string;
    attempts: number;
    correct: number;
    lastAttempt: string; // ISO date string
}

/**
 * Estado global da aplicação.
 */
interface AppState {
    // === DADOS DAS LIÇÕES ===
    lessons: Lesson[];
    setLessons: (lessons: Lesson[]) => void;

    // === ESTADO DE NAVEGAÇÃO ===
    currentLesson: Lesson | null;
    setCurrentLesson: (lesson: Lesson | null) => void;

    // === PROGRESSO POR LIÇÃO (mantido para compatibilidade) ===
    progress: Record<string, LessonProgress>;
    updateProgress: (lessonId: string, score: number, total: number) => void;

    // === PROGRESSO POR SKILL (Diagnóstico Inteligente) ===
    skillProgress: Record<string, SkillProgress>;
    updateSkillProgress: (skill: string, isCorrect: boolean) => void;

    // === PREFERÊNCIAS DO USUÁRIO (NOVO - VoiceSelector) ===
    preferredVoiceURI: string | null; // null = usar voz padrão do sistema
    setPreferredVoice: (uri: string | null) => void;

    // === UTILITÁRIOS ===
    resetAllProgress: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // --- Estado Inicial ---
            lessons: [],
            currentLesson: null,
            progress: {},
            skillProgress: {},
            preferredVoiceURI: null, // ✅ NOVO: começa sem preferência

            // --- Ações: Lições ---
            setLessons: (lessons) => set({ lessons }),

            // --- Ações: Navegação ---
            setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

            // --- Ações: Progresso por Lição ---
            updateProgress: (lessonId, score, total) =>
                set((state) => {
                    const existing = state.progress[lessonId];
                    const percentage = Math.round((score / total) * 100);
                    const newBestScore = existing
                        ? Math.max(existing.bestScore, percentage)
                        : percentage;

                    return {
                        progress: {
                            ...state.progress,
                            [lessonId]: {
                                attempts: (existing?.attempts || 0) + 1,
                                bestScore: newBestScore,
                                completed: percentage >= 80,
                                lastAttempt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            // --- Ações: Progresso por Skill ---
            updateSkillProgress: (skill, isCorrect) =>
                set((state) => {
                    const existing = state.skillProgress[skill];

                    return {
                        skillProgress: {
                            ...state.skillProgress,
                            [skill]: {
                                skill,
                                attempts: (existing?.attempts || 0) + 1,
                                correct: (existing?.correct || 0) + (isCorrect ? 1 : 0),
                                lastAttempt: new Date().toISOString(),
                            },
                        },
                    };
                }),

            // --- Ações: Preferências de Voz (NOVO) ---
            setPreferredVoice: (uri) => set({ preferredVoiceURI: uri }),

            // --- Ações: Reset ---
            resetAllProgress: () =>
                set({
                    progress: {},
                    skillProgress: {},
                    preferredVoiceURI: null, // ✅ Reseta também a preferência de voz
                }),
        }),
        {
            name: 'english-soul-storage', // Chave no localStorage
            // Persiste tudo exceto currentLesson (que é estado de navegação temporário)
            partialize: (state) => ({
                lessons: state.lessons,
                progress: state.progress,
                skillProgress: state.skillProgress,
                preferredVoiceURI: state.preferredVoiceURI, // ✅ Persiste a voz preferida
            }),
        }
    )
);