// src/types/lesson.ts

/**
 * Tipos de interação disponíveis no motor de exercícios.
 */
export type ExerciseType = 'multiple_choice' | 'reorder' | 'listening';

/**
 * Interface de um Verbo.
 * A fonte da verdade para formas irregulares está aqui, não no GrammarEngine.
 */
export interface Verb {
    base: string; // Ex: "drink", "speak", "be"
    past?: string; // Ex: "drank", "spoke", "was/were"
    participle?: string; // Ex: "drunk", "spoken", "been"
    ing?: string; // Ex: "drinking", "speaking", "being"
    valid_complements: string[]; // Ex: ["water", "coffee", "all"]
    valid_complement_types: string[]; // Ex: ["object", "preposition"]
    special_rules?: {
        no_do_support?: boolean; // Ex: true para o verbo TO BE
    };
}

/**
 * Interface de um Slot do Frame (a receita da frase).
 */
export interface FrameSlot {
    id: string; // Ex: "subject", "auxiliary", "verb"
    accepts: string; // Ex: "subject", "auxiliary", "main_verb"
    label: string; // Ex: "Sujeito", "TO BE", "Verbo"
    position: number;
    isOptional?: boolean; // Ex: true para modificadores de tempo/frequência
}

/**
 * Interface de um Exercício.
 */
export interface Exercise {
    id: string;
    type: ExerciseType;
    instruction: string;
    options: string[];
    correct_answer: string | string[];
    audio_text?: string; // O que o TTS deve falar (pode diferir do texto visual)
    skill?: string; // Ex: "past_negative", "listening_comprehension"
    difficulty?: 1 | 2 | 3;
}

/**
 * Interface Principal da Lição.
 * Representa uma unidade completa de conhecimento do método English Soul.
 */
export interface Lesson {
    id: string;
    phase: 'foundation' | 'expansion' | 'complexity' | 'mastery';
    title: string;
    description: string;
    semantic_field: string; // Ex: "PESSOAS E DESCRIÇÃO PESSOAL"

    // ✅ NOVO: Declara o tempo verbal padrão da lição (quando não há auxiliar).
    // Isso evita que o FrameEngine precise saber o ID da lição (ex: isLesson17).
    default_tense?: 'present' | 'past' | 'future' | 'continuous' | 'perfect';

    inventory: {
        subjects: string[];
        auxiliaries: string[];
        verbs: Verb[];
        complements: string[];
        modifiers: string[];
    };

    frame_recipe: FrameSlot[];
    sentences: {
        text: string;
        translation: string;
        frame_parts: Record<string, string>;
    }[];
    contexts: { text: string; translation: string }[];
    grammar_rules: { rule: string; pattern: string; example: string }[];
    exercises: Exercise[];
}

/**
 * Interface para o progresso do aluno (usado no Zustand).
 */
export interface LessonProgress {
    attempts: number;
    bestScore: number;
    completed: boolean;
    lastAttempt?: string; // ISO date string
}