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
    ],
    exercises: [
        {
            id: "ex_1",
            type: "multiple_choice",
            instruction: "Qual frase está gramaticalmente correta?",
            options: [
                "He eat meat.",
                "He eats meat.",
                "He eating meat."
            ],
            correct_answer: "He eats meat.",
            audio_text: "He eats meat."
        },
        {
            id: "ex_2",
            type: "multiple_choice",
            instruction: "Como você diz 'Eu não bebo cerveja'?",
            options: [
                "I no drink beer.",
                "I doesn't drink beer.",
                "I don't drink beer."
            ],
            correct_answer: "I don't drink beer.",
            audio_text: "I don't drink beer."
        },
        {
            id: "ex_3",
            type: "reorder",
            instruction: "Organize as palavras para formar a frase:",
            options: ["water", "drink", "I", "now"],
            correct_answer: ["I", "drink", "water", "now"],
            audio_text: "I drink water now."
        }
    ]
};

export const mockLessons: Lesson[] = [mockLesson1];