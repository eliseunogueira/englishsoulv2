// src/data/mockLessons.ts
import type { Lesson } from '../types/lesson';

// ============================================================================
// LIÇÃO 1 - THE BASICS (Presente Simples, S+V+O)
// ============================================================================
export const mockLesson1: Lesson = {
    id: "lesson_1",
    phase: "foundation",
    title: "The Basics of a Sentence",
    description: "O esqueleto básico de 90% das frases em inglês.",
    semantic_field: "CASA E FAMÍLIA",

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["DO", "DON'T", "DOES", "DOESN'T"],
        verbs: [
            {
                base: "eat",
                past: "ate",
                valid_complements: ["fish", "meat", "breakfast", "lunch", "dinner"],
                valid_complement_types: ["object"]
            },
            {
                base: "drink",
                past: "drank",
                valid_complements: ["water", "coffee", "beer", "juice", "milk", "wine"],
                valid_complement_types: ["object"]
            },
            {
                base: "speak",
                past: "spoke",
                valid_complements: ["english", "portuguese", "spanish"],
                valid_complement_types: ["object"]
            },
            {
                base: "need",
                past: "needed",
                valid_complements: ["water", "milk", "my family", "my brother", "to speak english"],
                valid_complement_types: ["object", "infinitive"],
                special_rules: { requires_to: true }
            }
        ],
        complements: ["fish", "meat", "water", "coffee", "beer", "juice", "english", "portuguese", "my family", "my brother"],
        modifiers: ["now", "today", "with you", "with my family"]
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 1 },
        { id: "object", accepts: "complement", label: "Object", position: 2 }
    ],

    sentences: [
        {
            text: "I drink water.",
            translation: "Eu bebo água.",
            frame_parts: { subject: "I", verb: "drink", object: "water" }
        },
        {
            text: "She doesn't eat fish.",
            translation: "Ela não come peixe.",
            frame_parts: { subject: "She", auxiliary: "doesn't", verb: "eat", object: "fish" }
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
            pattern: "SUBJECT + DON'T/DOESN'T + VERB + OBJECT",
            example: "I don't eat fish."
        },
        {
            rule: "Third Person (He/She/It)",
            pattern: "HE/SHE/IT + VERB+S + OBJECT",
            example: "She drinks coffee."
        }
    ],

    exercises: [
        {
            id: "ex_1_1",
            type: "reorder",
            instruction: "Organize as palavras na ordem correta:",
            options: ["water", "drink", "I"],
            correct_answer: ["I", "drink", "water"],
            audio_text: "I drink water.",
            skill: "syntax",
            difficulty: 1
        },
        {
            id: "ex_1_2",
            type: "multiple_choice",
            instruction: "Qual frase está gramaticalmente correta?",
            options: ["He eat meat.", "He eats meat.", "He eating meat."],
            correct_answer: "He eats meat.",
            audio_text: "He eats meat.",
            skill: "third_person",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 13 - TO BE + FREQUENCY (Estados e Frequência)
// ============================================================================
export const mockLesson13: Lesson = {
    id: "lesson_13",
    phase: "expansion",
    title: "TO BE + Frequency + Action Verbs",
    description: "O esqueleto básico de 90% das frases em inglês.",
    semantic_field: "PESSOAS E DESCRIÇÃO PESSOAL",

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["AM", "IS", "ARE", "AM NOT", "ISN'T", "AREN'T"],
        verbs: [
            {
                base: "be",
                past: "was/were",
                valid_complements: ["happy", "sad", "tired", "in love", "in bed", "at home", "at work", "at school"],
                valid_complement_types: ["adjective", "preposition"],
                special_rules: { no_do_support: true }  // TO BE não usa DO/DON'T
            },
            {
                base: "visit",
                past: "visited",
                valid_complements: ["family", "us", "parents", "my uncle"],
                valid_complement_types: ["object"]
            },
            {
                base: "do",
                past: "did",
                valid_complements: ["homework", "job", "my homework"],
                valid_complement_types: ["object"]
            },
            {
                base: "make",
                past: "made",
                valid_complements: ["bread", "lunch", "house", "a house"],
                valid_complement_types: ["object"]
            }
        ],
        complements: ["happy", "sad", "tired", "in love", "in bed", "at home", "at work", "family", "parents"],
        modifiers: ["always", "never", "sometimes", "usually", "often", "before dinner", "on Sunday"]
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "TO BE", position: 1 },
        { id: "modifier", accepts: "modifier", label: "Frequency", position: 2, isOptional: true },
        { id: "complement", accepts: "complement", label: "State/Location", position: 3 }
    ],

    sentences: [
        {
            text: "I am in love.",
            translation: "Eu estou apaixonado.",
            frame_parts: { subject: "I", auxiliary: "am", complement: "in love" }
        },
        {
            text: "She is always at church on Sunday.",
            translation: "Ela está sempre na igreja no domingo.",
            frame_parts: { subject: "She", auxiliary: "is", modifier: "always", complement: "at church" }
        },
        {
            text: "They aren't at the party.",
            translation: "Eles não estão na festa.",
            frame_parts: { subject: "They", auxiliary: "aren't", complement: "at the party" }
        }
    ],

    contexts: [
        {
            text: "She is always at church on Sunday, but she is never at the party.",
            translation: "Ela está sempre na igreja no domingo, mas nunca está na festa."
        }
    ],

    grammar_rules: [
        {
            rule: "TO BE Independence",
            pattern: "TO BE não usa DO/DOES. Ele se transforma sozinho.",
            example: "She IS happy. / IS she happy? / She IS NOT happy."
        }
    ],

    exercises: [
        {
            id: "ex_13_1",
            type: "multiple_choice",
            instruction: "Qual frase está correta?",
            options: ["She doesn't be happy.", "She isn't happy.", "She not happy."],
            correct_answer: "She isn't happy.",
            audio_text: "She isn't happy.",
            skill: "to_be_negative",
            difficulty: 2
        },
        {
            id: "ex_13_2",
            type: "reorder",
            instruction: "Organize as palavras na ordem correta:",
            options: ["happy", "is", "She"],
            correct_answer: ["She", "is", "happy"],
            audio_text: "She is happy.",
            skill: "to_be_syntax",
            difficulty: 1
        },
        {
            id: "ex_13_3",
            type: "multiple_choice",
            instruction: "Como você diz 'Eles não estão na festa'?",
            options: ["They don't are at the party.", "They aren't at the party.", "They not at the party."],
            correct_answer: "They aren't at the party.",
            audio_text: "They aren't at the party.",
            skill: "to_be_negative_plural",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 17 - PAST SIMPLE (DID & DIDN'T)
// ============================================================================
export const mockLesson17: Lesson = {
    id: "lesson_17",
    phase: "expansion",
    title: "The Past Simple — DID & DIDN'T",
    description:"Lição 17 - Past Simple (DID) - Auxiliares no passado",
    semantic_field: "EXPERIÊNCIAS PASSADAS",

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["DID", "DIDN'T"],
        verbs: [
            {
                base: "need",
                past: "needed",
                valid_complements: ["to finish", "to go", "help", "to talk"],
                valid_complement_types: ["infinitive", "object"]
            },
            {
                base: "speak",
                past: "spoke",
                valid_complements: ["to your father", "at the meeting", "english"],
                valid_complement_types: ["preposition", "object"]
            },
            {
                base: "drink",
                past: "drank",
                valid_complements: ["beer", "juice", "water", "a lot"],
                valid_complement_types: ["object"]
            },
            {
                base: "eat",
                past: "ate",
                valid_complements: ["turkey", "fish", "the food", "anything"],
                valid_complement_types: ["object"]
            }
        ],
        complements: ["to finish", "to go", "beer", "juice", "turkey", "fish", "the food"],
        modifiers: ["yesterday", "last night", "already", "all day", "day before yesterday"]
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "DID/DIDN'T", position: 1, isOptional: true },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 2 },
        { id: "complement", accepts: "complement", label: "Object/Infinitive", position: 3 }
    ],

    sentences: [
        {
            text: "I needed to finish this.",
            translation: "Eu precisei terminar isso.",
            frame_parts: { subject: "I", verb: "needed", complement: "to finish this" }
        },
        {
            text: "I didn't need to finish.",
            translation: "Eu não precisei terminar.",
            frame_parts: { subject: "I", auxiliary: "didn't", verb: "need", complement: "to finish" }
        },
        {
            text: "Did you speak to your father?",
            translation: "Você falou com seu pai?",
            frame_parts: { subject: "you", auxiliary: "did", verb: "speak", complement: "to your father" }
        }
    ],

    contexts: [
        {
            text: "I needed to talk with my uncle yesterday. But I didn't eat anything before the class.",
            translation: "Eu precisei falar com meu tio ontem. Mas eu não comi nada antes da aula."
        }
    ],

    grammar_rules: [
        {
            rule: "Past Simple with DID",
            pattern: "Afirmativa: SUBJECT + VERB(PAST) | Negativa: SUBJECT + DIDN'T + VERB(BASE)",
            example: "I NEEDED. I DIDN'T need. DID you need?"
        }
    ],

    exercises: [
        {
            id: "ex_17_1",
            type: "multiple_choice",
            instruction: "Qual frase está correta?",
            options: ["I didn't needed.", "I didn't need.", "I not needed."],
            correct_answer: "I didn't need.",
            audio_text: "I didn't need.",
            skill: "past_negative",
            difficulty: 2
        },
        {
            id: "ex_17_2",
            type: "reorder",
            instruction: "Organize as palavras para formar a frase no passado:",
            options: ["to", "finish", "didn't", "I", "need"],
            correct_answer: ["I", "didn't", "need", "to", "finish"],
            audio_text: "I didn't need to finish.",
            skill: "past_negative_syntax",
            difficulty: 2
        },
        {
            id: "ex_17_3",
            type: "multiple_choice",
            instruction: "Qual é a forma passada de 'speak'?",
            options: ["speaked", "spoke", "spoken"],
            correct_answer: "spoke",
            audio_text: "spoke",
            skill: "past_irregular",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 21 - FUTURE WILL (Invariância Temporal)
// ============================================================================
export const mockLesson21: Lesson = {
    id: "lesson_21",
    phase: "complexity",
    title: "Future WILL, Months & Reflexives",
    description: "Lição 21 - Future WILL - Invariância temporal",
    semantic_field: "PLANOS E PROJETOS FUTUROS",

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["WILL", "WON'T"],
        verbs: [
            {
                base: "pay",
                past: "paid",
                valid_complements: ["the bill", "the money", "you"],
                valid_complement_types: ["object"],
                special_rules: { invariant: true }  // WILL não muda
            },
            {
                base: "wear",
                past: "wore",
                valid_complements: ["this shirt", "a pink dress", "the suit"],
                valid_complement_types: ["object"],
                special_rules: { invariant: true }
            },
            {
                base: "sing",
                past: "sang",
                valid_complements: ["at the party", "in the bathroom", "a song"],
                valid_complement_types: ["preposition", "object"],
                special_rules: { invariant: true }
            },
            {
                base: "ride",
                past: "rode",
                valid_complements: ["their bikes", "your horse", "the bike"],
                valid_complement_types: ["object"],
                special_rules: { invariant: true }
            }
        ],
        complements: ["the bill", "a pink dress", "at the party", "their bikes", "your horse"],
        modifiers: ["tomorrow", "next week", "in July", "by myself", "by yourself", "by themselves"]
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "WILL/WON'T", position: 1 },
        { id: "verb", accepts: "main_verb", label: "Verb (base)", position: 2 },
        { id: "complement", accepts: "complement", label: "Object/Location", position: 3 },
        { id: "modifier", accepts: "modifier", label: "Time/Manner", position: 4, isOptional: true }
    ],

    sentences: [
        {
            text: "I will pay the bill tomorrow.",
            translation: "Eu vou pagar a conta amanhã.",
            frame_parts: { subject: "I", auxiliary: "will", verb: "pay", object: "the bill", modifier: "tomorrow" }
        },
        {
            text: "She won't wear the pink dress.",
            translation: "Ela não vai usar o vestido rosa.",
            frame_parts: { subject: "She", auxiliary: "won't", verb: "wear", object: "the pink dress" }
        },
        {
            text: "Will they ride their bikes by themselves?",
            translation: "Eles vão andar de bicicleta sozinhos?",
            frame_parts: { subject: "they", auxiliary: "will", verb: "ride", object: "their bikes", modifier: "by themselves" }
        }
    ],

    contexts: [
        {
            text: "There will be a party tomorrow, and I will go by myself.",
            translation: "Haverá uma festa amanhã, e eu irei sozinho."
        }
    ],

    grammar_rules: [
        {
            rule: "WILL Invariance",
            pattern: "WILL é igual para todas as pessoas. WILL + verbo base.",
            example: "I will go. / She will go. / They will go."
        }
    ],

    exercises: [
        {
            id: "ex_21_1",
            type: "multiple_choice",
            instruction: "Qual frase está correta?",
            options: ["She wills go.", "She will goes.", "She will go."],
            correct_answer: "She will go.",
            audio_text: "She will go.",
            skill: "future_invariant",
            difficulty: 2
        },
        {
            id: "ex_21_2",
            type: "reorder",
            instruction: "Organize as palavras para formar a frase no futuro:",
            options: ["the", "will", "pay", "bill", "She", "tomorrow"],
            correct_answer: ["She", "will", "pay", "the", "bill", "tomorrow"],
            audio_text: "She will pay the bill tomorrow.",
            skill: "future_syntax",
            difficulty: 2
        },
        {
            id: "ex_21_3",
            type: "multiple_choice",
            instruction: "Como você diz 'Eu não vou usar o vestido rosa'?",
            options: ["I don't will wear the pink dress.", "I won't wear the pink dress.", "I will not wear the pink dress."],
            correct_answer: "I won't wear the pink dress.",
            audio_text: "I won't wear the pink dress.",
            skill: "future_negative",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 26 - -ING + PRESENT PERFECT (Peças Compostas e CHUNKs)
// ============================================================================
export const mockLesson26: Lesson = {
    id: "lesson_26",
    phase: "complexity",
    title: "The -ING Form, TOO & The Present Perfect",
    description: "Lição 26 - -ING + Present Perfect como CHUNK - Peças compostas",
    semantic_field: "AÇÃO EM PROGRESSO E EXPERIÊNCIA",

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["AM", "IS", "ARE", "HAVE", "HAS", "HAVEN'T", "HASN'T"],
        verbs: [
            {
                base: "read",
                past: "read",
                participle: "read",
                ing: "reading",
                valid_complements: ["a book", "the newspaper", "this"],
                valid_complement_types: ["object"],
                special_rules: { invariant: false }
            },
            {
                base: "cook",
                past: "cooked",
                participle: "cooked",
                ing: "cooking",
                valid_complements: ["dinner", "beans", "lunch"],
                valid_complement_types: ["object"],
                special_rules: { invariant: false }
            },
            {
                base: "be",
                past: "was/were",
                participle: "been",
                valid_complements: ["to Paris", "to Japan", "to Brazil", "tired", "happy"],
                valid_complement_types: ["preposition", "adjective"],
                special_rules: { no_do_support: true }
            }
        ],
        complements: ["a book", "dinner", "to Paris", "to Japan", "tired", "happy"],
        modifiers: ["too difficult", "too old", "too far", "already", "never", "ever"]
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "TO BE / HAVE", position: 1 },
        { id: "verb", accepts: "main_verb", label: "Verb (-ING / Participle)", position: 2 },
        { id: "complement", accepts: "complement", label: "Object/State/Location", position: 3 },
        { id: "modifier", accepts: "modifier", label: "Intensity/Time", position: 4, isOptional: true }
    ],

    sentences: [
        {
            text: "I'm reading a book.",
            translation: "Estou lendo um livro.",
            frame_parts: { subject: "I", auxiliary: "am", verb: "reading", object: "a book" }
        },
        {
            text: "The book is too difficult.",
            translation: "O livro é difícil demais.",
            frame_parts: { subject: "The book", auxiliary: "is", complement: "too difficult" }
        },
        {
            text: "I have been to Paris.",
            translation: "Eu já estive em Paris.",
            frame_parts: { subject: "I", auxiliary: "have", verb: "been", complement: "to Paris" }
        }
    ],

    contexts: [
        {
            text: "I'm reading a book that will be too difficult for me, but I will be able to finish it.",
            translation: "Estou lendo um livro que será difícil demais para mim, mas vou conseguir terminá-lo."
        }
    ],

    grammar_rules: [
        {
            rule: "-ING for Continuous Action",
            pattern: "TO BE + VERB-ING = ação em progresso",
            example: "I'm reading. / She's cooking."
        },
        {
            rule: "Present Perfect as CHUNK",
            pattern: "HAVE + BEEN TO = experiência de vida",
            example: "I have been to Paris. / Have you ever been to Europe?"
        }
    ],

    exercises: [
        {
            id: "ex_26_1",
            type: "multiple_choice",
            instruction: "Qual frase está correta?",
            options: ["I'm reading.", "I'm read.", "I reading."],
            correct_answer: "I'm reading.",
            audio_text: "I'm reading.",
            skill: "present_continuous",
            difficulty: 2
        },
        {
            id: "ex_26_2",
            type: "multiple_choice",
            instruction: "Como você diz 'Eu já estive em Paris'?",
            options: ["I went to Paris.", "I have been to Paris.", "I am to Paris."],
            correct_answer: "I have been to Paris.",
            audio_text: "I have been to Paris.",
            skill: "present_perfect_chunk",
            difficulty: 3
        },
        {
            id: "ex_26_3",
            type: "reorder",
            instruction: "Organize as palavras para formar a frase no presente contínuo:",
            options: ["a", "reading", "am", "book", "I"],
            correct_answer: ["I", "am", "reading", "a", "book"],
            audio_text: "I am reading a book.",
            skill: "present_continuous_syntax",
            difficulty: 2
        }
    ]
};

// Exportar todas as lições
export const mockLessons: Lesson[] = [
    mockLesson1,
    mockLesson13,
    mockLesson17,
    mockLesson21,
    mockLesson26
];