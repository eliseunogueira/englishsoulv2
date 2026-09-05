// src/types/lesson.ts

export type LessonPhase = 'foundation' | 'expansion' | 'complexity' | 'mastery';

export interface Verb {
    base: string;
    past: string;
    valid_objects: string[];
}

export type ExerciseType = 'multiple_choice' | 'reorder' | 'fill_blank';

export interface Exercise {
    id: string;
    type: ExerciseType;
    instruction: string;
    question_text?: string; // Para fill_blank ou reorder
    options: string[];      // Opções de múltipla escolha ou palavras para reorder
    correct_answer: string | string[]; // String simples ou array para reorder
    audio_text?: string;    // O que o TTS deve falar ao acertar
}


export interface Sentence {
    text: string;
    translation: string;
    frame_parts: {
        subject: string;
        verb: string;
        object: string;
    };
}

export interface Context {
    text: string;
    translation: string;
}

export interface Lesson {
    id: string;
    phase: LessonPhase;
    title: string;
    semantic_field: string;
    core_frame: string;

    concept: {
        core_frame: string;
        description: string;
    };

    vocabulary: {
        pronouns: string[];
        nouns: string[];
        verbs: Verb[];
        qualifiers: string[];
    };

    chunks: string[];
    sentences: Sentence[];
    contexts: Context[];

    grammar_rules: {
        rule: string;
        pattern: string;
        example: string;
    }[];
    exercises: Exercise[];
}