// src/data/mockLessons.ts
import type { Lesson } from '../types/lesson';

export const mockLesson1: Lesson = {
    id: "lesson_1",
    phase: "foundation",
    title: "The Basics of a Sentence",
    semantic_field: "CASA E FAMÍLIA",
    core_frame: "SUBJECT + VERB + OBJECT",

    concept: {
        core_frame: "SUBJECT + VERB + OBJECT",
        description: "O esqueleto básico de 90% das frases em inglês."
    },

    vocabulary: {
        pronouns: ["I", "You", "He", "She", "We", "They"],
        nouns: ["brother", "sister", "father", "mother", "family", "fish", "meat", "water", "coffee", "beer", "english", "portuguese"],
        verbs: [
            { base: "eat", past: "ate", valid_objects: ["fish", "meat", "breakfast", "lunch", "dinner"] },
            { base: "drink", past: "drank", valid_objects: ["water", "coffee", "beer", "juice", "milk", "wine"] },
            { base: "speak", past: "spoke", valid_objects: ["english", "portuguese", "spanish"] },
            { base: "need", past: "needed", valid_objects: ["all"] }
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

export const mockLessons: Lesson[] = [mockLesson1];