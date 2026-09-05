// src/types/lesson.ts

// 1. Definição das Fases do Curso (Baseado no seu HTML)
export type LessonPhase = 'foundation' | 'expansion' | 'complexity' | 'mastery';

// 2. O Verbo Inteligente (A mágica semântica que criamos)
export interface Verb {
    base: string;
    past: string;
    valid_objects: string[]; // Ex: "drink" -> ["water", "coffee"]
}

// 3. A Frase Estruturada
export interface Sentence {
    text: string;
    translation: string;
    frame_parts: {
        subject: string;
        verb: string;
        object: string;
    };
}

// 4. O Contexto (Áudio Nível 4)
export interface Context {
    text: string;
    translation: string;
}

// 5. A Interface Principal da Lição
export interface Lesson {
    concept: { core_frame:string, description:string };
    id: string; // Ex: "lesson_1"
    phase: LessonPhase;
    title: string;
    semantic_field: string; // Ex: "CASA E FAMÍLIA"
    //core_frame: string; // Ex: "SUBJECT + VERB + OBJECT"

    vocabulary: {
        nouns: string[];
        verbs: Verb[];
        qualifiers: string[];
    };

    chunks: string[]; // Ex: ["some water", "my family"]
    sentences: Sentence[];
    contexts: Context[];

    grammar_rules: {
        rule: string;
        pattern: string;
        example: string;
    }[];
}