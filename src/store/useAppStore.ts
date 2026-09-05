// src/store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lesson } from '../types/lesson';

export interface LessonProgress {
    attempts: number;
    bestScore: number;
    completed: boolean;
}

interface AppState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    progress: Record<string, LessonProgress>;

    // NOVO: Preferência de voz
    preferredVoiceURI: string | null;

    setLessons: (lessons: Lesson[]) => void;
    setCurrentLesson: (lesson: Lesson | null) => void;
    updateProgress: (lessonId: string, correct: number, total: number) => void;
    setPreferredVoice: (voiceURI: string | null) => void; // NOVO
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            lessons: [],
            currentLesson: null,
            progress: {},
            preferredVoiceURI: null, // Padrão: null (usa o fallback inteligente)

            setLessons: (lessons) => set({ lessons }),
            setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

            // NOVO: Atualiza a store e o motor de áudio em tempo real
            setPreferredVoice: (voiceURI) => {
                set({ preferredVoiceURI: voiceURI });
                // Informa o motor de áudio imediatamente
                import('../utils/audio').then(module => {
                    module.audioEngine.setVoice(voiceURI);
                });
            },

            updateProgress: (lessonId, correct, total) => set((state) => {
                // ... (mantenha a lógica de progresso igual)
                const score = Math.round((correct / total) * 100);
                const currentProgress = state.progress[lessonId] || { attempts: 0, bestScore: 0, completed: false };
                return {
                    progress: {
                        ...state.progress,
                        [lessonId]: {
                            attempts: currentProgress.attempts + 1,
                            bestScore: Math.max(currentProgress.bestScore, score),
                            completed: score >= 80 ? true : currentProgress.completed,
                        },
                    },
                };
            }),
        }),
        {
            name: 'english-soul-storage',
        }
    )
);