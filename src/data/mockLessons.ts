// src/data/mockLessons.ts
import type { Lesson } from '../types/lesson';

export const mockLesson1: Lesson = {
    id: "lesson_1",
    phase: "foundation",
    title: "The Basics of a Sentence",
    semantic_field: "CASA E FAMÍLIA",

    // ✅ ADICIONE ESTE BLOCO AQUI:
    concept: {
        core_frame: "SUBJECT + VERB + OBJECT",
        description: "O esqueleto básico de 90% das frases em inglês."
    },

    vocabulary: {
        nouns: ["brother", "sister", "father", "mother", "family"],
        verbs: [
            { base: "eat", past: "ate", valid_objects: ["fish", "meat"] },
            { base: "drink", past: "drank", valid_objects: ["water", "coffee", "beer"] },
            { base: "speak", past: "spoke", valid_objects: ["english", "portuguese"] }
        ],
        qualifiers: ["with", "and", "now", "today"]
    },

    chunks: ["some water", "my family", "with you"],

    sentences: [
        {
            text: "I drink water.",
            translation: "Eu bebo água.",
            frame_parts: { subject: "I", verb: "drink", object: "water" }
        }
    ],

    contexts: [
        {
            text: "I drink water. I am very thirsty.",
            translation: "Eu bebo água. Estou com muita sede."
        }
    ],

    grammar_rules: [
        {
            rule: "Negative Formation",
            pattern: "SUBJECT + DON'T + VERB + OBJECT",
            example: "I don't eat fish."
        }
    ]
};