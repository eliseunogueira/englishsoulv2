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
    default_tense: "present",

    // Lição 1 - inventory
    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["DO", "DOES", "DON'T", "DOESN'T"], // ✅ Deve existir
        verbs: [
            { base: "eat", valid_complements: ["fish", "meat", "the food"], valid_complement_types: ["object"] },
            { base: "drink", valid_complements: ["water", "coffee", "beer", "juice"], valid_complement_types: ["object"] },
            { base: "speak", valid_complements: ["english", "portuguese", "with you", "with my family"], valid_complement_types: ["object", "preposition"] },
            { base: "need", valid_complements: ["to go", "to finish", "help"], valid_complement_types: ["infinitive", "object"] }
        ],
        complements: ["fish", "meat", "water", "coffee", "beer", "juice", "english", "portuguese", "my family", "my brother", "the food", "to go", "to finish", "help", "with you", "with my family"],
        modifiers: ["now", "today"]
    },
    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "DO/DOES", position: 1, isOptional: true }, // ✅ NOVO
        { id: "verb", accepts: "main_verb", label: "Verb", position: 2 },
        { id: "complement", accepts: "complement", label: "Object", position: 3 },
        { id: "modifier", accepts: "modifier", label: "Time", position: 4, isOptional: true } // ✅ NOVO
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
        },
        // NOVO: Listening + Reordenação
        {
            id: "ex_1_3",
            type: "listening",
            instruction: "Ouça a frase e organize as palavras na ordem correta:",
            options: ["water", "drink", "I"],
            correct_answer: ["I", "drink", "water"],
            audio_text: "I drink water.",
            skill: "listening_syntax",
            difficulty: 2
        },
        // NOVO: Listening + Múltipla Escolha (tradução)
        {
            id: "ex_1_4",
            type: "multiple_choice",
            instruction: "🎧 Você ouvirá uma frase em inglês. Preste atenção e escolha a tradução em português que corresponde EXATAMENTE ao que você escutou.",
            options: ["Eu como peixe.", "Eu bebo água.", "Eu falo inglês."],
            correct_answer: "Eu bebo água.",
            audio_text: "I drink water.",
            skill: "listening_comprehension",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 2: CAN / CAN'T (Habilidades)
// ============================================================================
export const mockLesson2: Lesson = {
    id: "lesson_2",
    phase: "foundation",
    title: "Abilities with CAN",
    description: "Expressando o que você sabe ou não sabe fazer.",
    semantic_field: "HABILIDADES E TALENTOS",
    default_tense: "present",

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["CAN", "CAN'T"],
        verbs: [
            { base: "speak", past: "spoke", valid_complements: ["English", "French", "loudly"], valid_complement_types: ["object", "adverb"] },
            { base: "swim", past: "swam", valid_complements: ["very fast", "in the sea", "well"], valid_complement_types: ["adverb", "preposition"] },
            { base: "cook", past: "cooked", valid_complements: ["delicious food", "pasta", "well"], valid_complement_types: ["object", "adverb"] },
            { base: "drive", past: "drove", valid_complements: ["a car", "fast", "carefully"], valid_complement_types: ["object", "adverb"] }
        ],
        complements: ["English", "French", "very fast", "in the sea", "well", "delicious food", "pasta", "a car", "fast", "carefully"],
        modifiers: []
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "CAN/CAN'T", position: 1 },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 2 },
        { id: "complement", accepts: "complement", label: "Detail", position: 3 }
    ],

    sentences: [
        { text: "I can speak English.", translation: "Eu sei falar inglês.", frame_parts: { subject: "I", auxiliary: "can", verb: "speak", complement: "English" } },
        { text: "She can't swim very fast.", translation: "Ela não sabe nadar muito rápido.", frame_parts: { subject: "She", auxiliary: "can't", verb: "swim", complement: "very fast" } }
    ],

    contexts: [
        { text: "I can cook delicious food, but I can't drive a car.", translation: "Eu sei cozinhar comida deliciosa, mas não sei dirigir um carro." }
    ],

    grammar_rules: [
        { rule: "Modal Invariance", pattern: "CAN não muda. Não existe 'cans' ou 'canned'.", example: "He CAN speak. / She CAN'T swim." }
    ],

    exercises: [
        {
            id: "ex_2_1",
            type: "multiple_choice",
            instruction: "Qual frase está gramaticalmente correta?",
            options: ["He cans speak English.", "He can speaks English.", "He can speak English."],
            correct_answer: "He can speak English.",
            audio_text: "He can speak English.",
            skill: "modal_invariance",
            difficulty: 1
        },
        {
            id: "ex_2_2",
            type: "reorder",
            instruction: "Organize as palavras na ordem correta:",
            options: ["swim", "can't", "very fast", "She"],
            correct_answer: ["She", "can't", "swim", "very fast"],
            audio_text: "She can't swim very fast.",
            skill: "modal_syntax",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 3: WH-QUESTIONS (Perguntas)
// ============================================================================
export const mockLesson3: Lesson = {
    id: "lesson_3",
    phase: "foundation",
    title: "WH-Questions (Present Simple)",
    description: "Fazendo perguntas com What, Where, When, Who, Why e How.",
    semantic_field: "PERGUNTAS E INFORMAÇÕES",
    default_tense: "present",

    inventory: {
        subjects: ["I", "You", "He", "She", "We", "They"],
        auxiliaries: ["DO", "DOES", "AM", "IS", "ARE"], // ✅ Adicionado AM
        verbs: [

    { base: "live", past: "lived", ing: "living", valid_complements: ["in Brazil", "here"], valid_complement_types: ["preposition", "adverb"] },
    { base: "work", past: "worked", ing: "working", valid_complements: ["here", "at home"], valid_complement_types: ["adverb", "preposition"] },
    { base: "eat", past: "ate", ing: "eating", valid_complements: ["pizza", "breakfast"], valid_complement_types: ["object"] },
    { base: "study", past: "studied", ing: "studying", valid_complements: ["English", "at night"], valid_complement_types: ["object", "adverb"] }

        ],
        complements: ["in Brazil", "in a house", "here", "at home", "in an office", "pizza", "breakfast", "lunch", "English", "at night", "every day"],
        modifiers: [],
        question_words: ["What", "Where", "When", "Who", "Why", "How"] // ✅ NOVO
    },

    frame_recipe: [
        { id: "question_word", accepts: "question_word", label: "WH-", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "Aux", position: 1 },
        { id: "subject", accepts: "subject", label: "Subject", position: 2 },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 3 },
        { id: "complement", accepts: "complement", label: "Detail", position: 4, isOptional: true }
    ],

    sentences: [
        { text: "Where do you live?", translation: "Onde você mora?", frame_parts: { question_word: "Where", auxiliary: "do", subject: "you", verb: "live" } },
        { text: "What does she eat?", translation: "O que ela come?", frame_parts: { question_word: "What", auxiliary: "does", subject: "she", verb: "eat" } },
        { text: "When do they study?", translation: "Quando eles estudam?", frame_parts: { question_word: "When", auxiliary: "do", subject: "they", verb: "study" } }
    ],

    contexts: [
        { text: "Where do you live? I live in Brazil. What do you eat? I eat pizza.", translation: "Onde você mora? Eu moro no Brasil. O que você come? Eu como pizza." }
    ],

    grammar_rules: [
        { rule: "WH-Question Structure", pattern: "WH- + Aux + Subject + Verb + Complement?", example: "WHERE do you LIVE? / WHAT does she EAT?" }
    ],

    exercises: [
        {
            id: "ex_3_1",
            type: "multiple_choice",
            instruction: "Qual pergunta está correta?",
            options: ["Where you live?", "Where do you live?", "Where does you live?"],
            correct_answer: "Where do you live?",
            audio_text: "Where do you live?",
            skill: "wh_question_syntax",
            difficulty: 2
        },
        {
            id: "ex_3_2",
            type: "reorder",
            instruction: "Organize a pergunta:",
            options: ["eat", "does", "What", "she"],
            correct_answer: ["What", "does", "she", "eat"],
            audio_text: "What does she eat?",
            skill: "wh_question_reorder",
            difficulty: 2
        },
        {
            id: "ex_3_3",
            type: "listening",
            instruction: "🎧 Ouça e organize as palavras:",
            options: ["they", "study", "When", "do"],
            correct_answer: ["When", "do", "they", "study"],
            audio_text: "When do they study?",
            skill: "listening_wh_question",
            difficulty: 3
        }
    ]
};

// ============================================================================
// LIÇÃO 4: SHOULD / SHOULDN'T (Conselhos)
// ============================================================================
export const mockLesson4: Lesson = {
    id: "lesson_4",
    phase: "foundation",
    title: "Advice with SHOULD",
    description: "Dando e recebendo conselhos e recomendações.",
    semantic_field: "SAÚDE E BEM-ESTAR",
    default_tense: "present",

    inventory: {
        subjects: ["I", "You", "He", "She", "We", "They"],
        auxiliaries: ["SHOULD", "SHOULDN'T"],
        verbs: [
            { base: "study", past: "studied", valid_complements: ["more", "hard", "every day"], valid_complement_types: ["adverb"] },
            { base: "eat", past: "ate", valid_complements: ["healthy food", "vegetables", "less sugar"], valid_complement_types: ["object"] },
            { base: "sleep", past: "slept", valid_complements: ["8 hours", "well", "early"], valid_complement_types: ["adverb", "object"] },
            { base: "work", past: "worked", valid_complements: ["hard", "less", "from home"], valid_complement_types: ["adverb", "preposition"] }
        ],
        complements: ["more", "hard", "every day", "healthy food", "vegetables", "less sugar", "8 hours", "well", "early", "less", "from home"],
        modifiers: []
    },

    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "SHOULD", position: 1 },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 2 },
        { id: "complement", accepts: "complement", label: "Detail", position: 3 }
    ],

    sentences: [
        { text: "You should study more.", translation: "Você deveria estudar mais.", frame_parts: { subject: "You", auxiliary: "should", verb: "study", complement: "more" } },
        { text: "He shouldn't eat less sugar.", translation: "Ele não deveria comer menos açúcar.", frame_parts: { subject: "He", auxiliary: "shouldn't", verb: "eat", complement: "less sugar" } }
    ],

    contexts: [
        { text: "You look tired. You should sleep 8 hours and shouldn't work so hard.", translation: "Você parece cansado. Você deveria dormir 8 horas e não deveria trabalhar tanto." }
    ],

    grammar_rules: [
        { rule: "Advice Modal", pattern: "SHOULD é invariável e sempre seguido da forma base do verbo.", example: "You SHOULD study. / He SHOULDN'T eat that." }
    ],

    exercises: [
        {
            id: "ex_4_1",
            type: "listening",
            instruction: " Ouça o conselho e organize as palavras:",
            options: ["more", "should", "You", "study"],
            correct_answer: ["You", "should", "study", "more"],
            audio_text: "You should study more.",
            skill: "listening_modal",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 5: THERE IS / THERE ARE (Existência)
// ============================================================================
export const mockLesson5: Lesson = {
    id: "lesson_5",
    phase: "foundation",
    title: "There is / There are",
    description: "Descrevendo o que existe em um lugar.",
    semantic_field: "LUGARES E DESCRIÇÕES",
    default_tense: "present",

    inventory: {
        subjects: [],
        auxiliaries: [],
        verbs: [],
        complements: ["a book", "two cats", "many people", "a car", "a table", "three dogs", "some water", "a lot of students"],
        modifiers: ["here", "there", "in the room", "on the table", "at home"],
        there_be: ["There is", "There are", "There isn't", "There aren't"],
        // ✅ NOVO: Mapeamento de número para cada complemento
        complement_number: {
            "a book": "singular",
            "two cats": "plural",
            "many people": "plural",
            "a car": "singular",
            "a table": "singular",
            "three dogs": "plural",
            "some water": "singular", // "water" é incontável
            "a lot of students": "plural"
        }
    },

    frame_recipe: [
        { id: "there_be", accepts: "there_be", label: "There is/are", position: 0 },
        { id: "complement", accepts: "complement", label: "What exists", position: 1 },
        { id: "modifier", accepts: "modifier", label: "Where", position: 2, isOptional: true }
    ],

    sentences: [
        { text: "There is a book on the table.", translation: "Há um livro na mesa.", frame_parts: { there_be: "There is", complement: "a book", modifier: "on the table" } },
        { text: "There are two cats here.", translation: "Há dois gatos aqui.", frame_parts: { there_be: "There are", complement: "two cats", modifier: "here" } },
        { text: "There are many people in the room.", translation: "Há muitas pessoas na sala.", frame_parts: { there_be: "There are", complement: "many people", modifier: "in the room" } }
    ],

    contexts: [
        { text: "There is a car at home. There are three dogs here.", translation: "Há um carro em casa. Há três cachorros aqui." }
    ],

    grammar_rules: [
        { rule: "There is/are Structure", pattern: "There IS (singular) / There ARE (plural) + What exists + Where", example: "There IS a book. / There ARE two cats." }
    ],

    exercises: [
        {
            id: "ex_5_1",
            type: "multiple_choice",
            instruction: "Qual frase está correta?",
            options: ["There is two cats.", "There are two cats.", "There two cats are."],
            correct_answer: "There are two cats.",
            audio_text: "There are two cats.",
            skill: "there_be_agreement",
            difficulty: 1
        },
        {
            id: "ex_5_2",
            type: "reorder",
            instruction: "Organize a frase:",
            options: ["on the table", "a book", "There is"],
            correct_answer: ["There is", "a book", "on the table"],
            audio_text: "There is a book on the table.",
            skill: "there_be_syntax",
            difficulty: 2
        }
    ]
};
// ============================================================================
// LIÇÃO 7: TO + VERB (Intenções com WANT/NEED)
// ============================================================================
export const mockLesson7: Lesson = {
    id: "lesson_7",
    phase: "expansion",
    title: "Intentions with TO",
    description: "Expressando desejos e necessidades usando o infinitivo.",
    semantic_field: "DESEJOS E NECESSIDADES",
    default_tense: "present", // O primeiro verbo será conjugado no presente

    inventory: {
        subjects: ["I", "You", "He", "She", "We", "They"],
        auxiliaries: [],
        verbs: [
            {
                base: "want",
                past: "wanted",
                valid_complements: ["to learn English", "to go home", "to eat pizza", "to sleep early"],
                valid_complement_types: ["infinitive"]
            },
            {
                base: "need",
                past: "needed",
                valid_complements: ["to finish this", "to talk to you", "to rest a bit", "to buy a car"],
                valid_complement_types: ["infinitive"]
            },
            {
                base: "like",
                past: "liked",
                valid_complements: ["to travel the world", "to read books", "to cook dinner", "to play soccer"], // ✅ Ajustado
                valid_complement_types: ["infinitive"]
            }
        ],
        // Complementos agora batem exatamente com os valid_complements
        complements: [
            "to learn English", "to go home", "to eat pizza", "to sleep early",
            "to finish this", "to talk to you", "to rest a bit", "to buy a car",
            "to travel the world", "to read books", "to cook dinner", "to play soccer"
        ],
        modifiers: ["now", "today", "tomorrow", "every day"]
    },

    // ✅ A MÁGICA: O frame_recipe agora tem 4 slots, incluindo o modificador opcional
    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "verb", accepts: "main_verb", label: "Verb (Want/Need)", position: 1 },
        { id: "complement", accepts: "complement", label: "TO + Action", position: 2 },
        { id: "modifier", accepts: "modifier", label: "Time", position: 3, isOptional: true }
    ],

    sentences: [
        { text: "I want to learn English.", translation: "Eu quero aprender inglês.", frame_parts: { subject: "I", verb: "want", complement: "to learn English" } },
        { text: "She needs to finish this today.", translation: "Ela precisa terminar isso hoje.", frame_parts: { subject: "She", verb: "need", complement: "to finish this", modifier: "today" } }
    ],

    contexts: [
        { text: "I like to travel the world, but I need to work every day.", translation: "Eu gosto de viajar o mundo, mas preciso trabalhar todo dia." }
    ],

    grammar_rules: [
        { rule: "Infinitive Structure", pattern: "O primeiro verbo é conjugado (He wants). A ação seguinte usa TO + base (to learn).", example: "He WANTS TO LEARN. / She NEEDS TO GO." }
    ],

    exercises: [
        {
            id: "ex_7_1",
            type: "multiple_choice",
            instruction: "Qual frase está correta?",
            options: ["He want to learn.", "He wants to learn.", "He wants to learns."],
            correct_answer: "He wants to learn.",
            audio_text: "He wants to learn.",
            skill: "infinitive_conjugation",
            difficulty: 2
        },
        {
            id: "ex_7_2",
            type: "reorder",
            instruction: "Organize a frase de necessidade:",
            options: ["to", "finish", "She", "this", "needs"],
            correct_answer: ["She", "needs", "to", "finish", "this"],
            audio_text: "She needs to finish this.",
            skill: "infinitive_syntax",
            difficulty: 2
        }
    ]
};

// ============================================================================
// LIÇÃO 8: IMPERATIVE (Comandos e Pedidos)
// ============================================================================
export const mockLesson8: Lesson = {
    id: "lesson_8",
    phase: "foundation",
    title: "Imperative",
    description: "Dando comandos, pedidos e instruções.",
    semantic_field: "INSTRUÇÕES E PEDIDOS",
    default_tense: "present",

    inventory: {
        subjects: [], // Imperativo não tem sujeito explícito
        auxiliaries: ["DON'T"], // Apenas para negativa
        verbs: [
            { base: "open", past: "opened", valid_complements: ["the door", "the window", "your book"], valid_complement_types: ["object"] },
            { base: "close", past: "closed", valid_complements: ["the door", "the window", "your eyes"], valid_complement_types: ["object"] },
            { base: "listen", past: "listened", valid_complements: ["to me", "to the music", "carefully"], valid_complement_types: ["preposition", "adverb"] },
            { base: "read", past: "read", valid_complements: ["the book", "the text", "carefully"], valid_complement_types: ["object", "adverb"] },
            { base: "write", past: "wrote", valid_complements: ["your name", "the answer", "here"], valid_complement_types: ["object", "adverb"] }
        ],
        complements: ["the door", "the window", "your book", "your eyes", "to me", "to the music", "carefully", "the book", "the text", "your name", "the answer", "here"],
        modifiers: ["please", "now", "quickly"]
    },

    frame_recipe: [
        { id: "auxiliary", accepts: "auxiliary", label: "DON'T", position: 0, isOptional: true },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 1 },
        { id: "complement", accepts: "complement", label: "Detail", position: 2, isOptional: true },
        { id: "modifier", accepts: "modifier", label: "Please/Now", position: 3, isOptional: true }
    ],

    sentences: [
        { text: "Open the door, please.", translation: "Abra a porta, por favor.", frame_parts: { verb: "open", complement: "the door", modifier: "please" } },
        { text: "Don't close the window.", translation: "Não feche a janela.", frame_parts: { auxiliary: "don't", verb: "close", complement: "the window" } },
        { text: "Listen to me carefully.", translation: "Me escute com atenção.", frame_parts: { verb: "listen", complement: "to me", modifier: "carefully" } }
    ],

    contexts: [
        { text: "Open your book, please. Read the text. Don't write here.", translation: "Abra seu livro, por favor. Leia o texto. Não escreva aqui." }
    ],

    grammar_rules: [
        { rule: "Imperative Structure", pattern: "Verb (base) + Complement. Para negativa: DON'T + Verb.", example: "OPEN the door. / DON'T CLOSE the window." }
    ],

    exercises: [
        {
            id: "ex_8_1",
            type: "multiple_choice",
            instruction: "Qual comando está correto?",
            options: ["Opens the door.", "Open the door.", "Opening the door."],
            correct_answer: "Open the door.",
            audio_text: "Open the door.",
            skill: "imperative_form",
            difficulty: 1
        },
        {
            id: "ex_8_2",
            type: "reorder",
            instruction: "Organize o comando negativo:",
            options: ["the window", "Don't", "close"],
            correct_answer: ["Don't", "close", "the window"],
            audio_text: "Don't close the window.",
            skill: "imperative_negative",
            difficulty: 2
        },
        {
            id: "ex_8_3",
            type: "listening",
            instruction: " Ouça e organize:",
            options: ["to me", "Listen", "carefully"],
            correct_answer: ["Listen", "to me", "carefully"],
            audio_text: "Listen to me carefully.",
            skill: "listening_imperative",
            difficulty: 2
        }
    ]
};
// ============================================================================
// LIÇÃO 13 - TO BE + FREQUENCY (Estados e Frequência)
// ============================================================================
// src/data/mockLessons.ts

export const mockLesson13: Lesson = {
    id: "lesson_13",
    phase: "expansion",
    title: "TO BE + Frequency + States",
    description: "O frame ganha um estado de ser e a dimensão do tempo.",
    semantic_field: "PESSOAS E DESCRIÇÃO PESSOAL",
    default_tense: "present", // ✅ TO BE é tratado como presente

    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["AM", "IS", "ARE", "AM NOT", "ISN'T", "AREN'T"],

        // ✅ SIMPLIFICADO: Apenas o verbo TO BE
        verbs: [ ],

        complements: ["happy", "sad", "tired", "in love", "in bed", "at home", "at work", "at school", "at the party"],
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
            type: "reorder",
            instruction: "Organize as palavras na ordem correta (preste atenção na frequência):",
            options: ["happy", "always", "is", "She"],
            correct_answer: ["She", "is", "always", "happy"],
            audio_text: "She is always happy.",
            skill: "to_be_frequency_syntax",
            difficulty: 2
        },
        {
            id: "ex_13_2",
            type: "multiple_choice",
            instruction: "Qual frase está gramaticalmente correta?",
            options: ["They isn't at the party.", "They aren't at the party.", "They not at the party."],
            correct_answer: "They aren't at the party.",
            audio_text: "They aren't at the party.",
            skill: "to_be_negative_plural",
            difficulty: 2
        },
        {
            id: "ex_13_3",
            type: "listening",
            instruction: "🎧 Ouça a frase e organize as palavras na ordem correta:",
            options: ["at", "never", "work", "He", "is"],
            correct_answer: ["He", "is", "never", "at", "work"],
            audio_text: "He is never at work.",
            skill: "listening_to_be_frequency",
            difficulty: 3
        },
        {
            id: "ex_13_4",
            type: "multiple_choice",
            instruction: "🎧 Ouça a frase e escolha a tradução em português que corresponde EXATAMENTE ao que você escutou:",
            options: ["Nós estamos sempre em casa.", "Nós não estamos em casa.", "Nós estamos às vezes em casa."],
            correct_answer: "Nós estamos sempre em casa.",
            audio_text: "We are always at home.",
            skill: "listening_to_be_comprehension",
            difficulty: 2
        },
        {
            id: "ex_13_5",
            type: "reorder",
            instruction: "Organize as palavras para formar a frase negativa:",
            options: ["in", "am", "I", "not", "love"],
            correct_answer: ["I", "am", "not", "in", "love"],
            audio_text: "I am not in love.",
            skill: "to_be_negative_syntax",
            difficulty: 1
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
    default_tense: "past", // ✅ Agora o engine sabe que é passado sem precisar do ID

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
        complements: ["to finish", "to go", "beer", "juice", "turkey", "fish", "the food","to your father", "at the meeting", "english"],
        modifiers: ["yesterday", "last night", "already", "all day", "day before yesterday"]
    },

    // Lição 17
    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "DID/DIDN'T", position: 1, isOptional: true },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 2 },
        { id: "complement", accepts: "complement", label: "Object/Infinitive", position: 3 },
        { id: "modifier", accepts: "modifier", label: "Time", position: 4, isOptional: true } // ✅ NOVO
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
        },
        // NOVO: Listening + Reordenação
        {
            id: "ex_17_4",
            type: "listening",
            instruction: "Ouça a frase no passado e organize as palavras:",
            options: ["to", "finish", "didn't", "I", "need"],
            correct_answer: ["I", "didn't", "need", "to", "finish"],
            audio_text: "I didn't need to finish.",
            skill: "listening_past",
            difficulty: 3
        },
        // NOVO: Listening + Múltipla Escolha
        {
            id: "ex_17_5",
            type: "multiple_choice",
            instruction: "🎧 Você ouvirá uma frase no PASSADO. Preste atenção se a ação aconteceu ou não aconteceu. Escolha a tradução em português que corresponde EXATAMENTE ao que você escutou.",
            options: ["Eu precisei terminar.", "Eu não precisei terminar.", "Eu vou precisar terminar."],
            correct_answer: "Eu não precisei terminar.",
            audio_text: "I didn't need to finish.",
            skill: "listening_past_comprehension",
            difficulty: 3
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

            },
            {
                base: "wear",
                past: "wore",
                valid_complements: ["this shirt", "a pink dress", "the suit"],
                valid_complement_types: ["object"],

            },
            {
                base: "sing",
                past: "sang",
                valid_complements: ["at the party", "in the bathroom", "a song"],
                valid_complement_types: ["preposition", "object"],

            },
            {
                base: "ride",
                past: "rode",
                valid_complements: ["their bikes", "your horse", "the bike"],
                valid_complement_types: ["object"],

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
        },
        // NOVO: Listening + Reordenação
        {
            id: "ex_21_4",
            type: "listening",
            instruction: "Ouça a frase no futuro e organize as palavras:",
            options: ["the", "will", "pay", "bill", "She", "tomorrow"],
            correct_answer: ["She", "will", "pay", "the", "bill", "tomorrow"],
            audio_text: "She will pay the bill tomorrow.",
            skill: "listening_future",
            difficulty: 3
        },
        // NOVO: Listening + Múltipla Escolha
        {
            id: "ex_21_5",
            type: "multiple_choice",
            instruction: "🎧 Você ouvirá uma frase no FUTURO. Preste atenção nos detalhes (quem, o quê, quando). Escolha a tradução em português que corresponde EXATAMENTE ao que você escutou.",
            options: ["Ela vai pagar a conta amanhã.", "Ela pagou a conta ontem.", "Ela não vai pagar a conta."],
            correct_answer: "Ela vai pagar a conta amanhã.",
            audio_text: "She will pay the bill tomorrow.",
            skill: "listening_future_comprehension",
            difficulty: 3
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
    default_tense: "continuous", // ✅ Ou perfect, dependendo do foco

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

            },
            {
                base: "cook",
                past: "cooked",
                participle: "cooked",
                ing: "cooking",
                valid_complements: ["dinner", "beans", "lunch"],
                valid_complement_types: ["object"],

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
        },// NOVO: Listening + Reordenação
        {
            id: "ex_26_4",
            type: "listening",
            instruction: "Ouça a frase e organize as palavras:",
            options: ["a", "reading", "am", "book", "I"],
            correct_answer: ["I", "am", "reading", "a", "book"],
            audio_text: "I am reading a book.",
            skill: "listening_continuous",
            difficulty: 2
        },
        // NOVO: Listening + Múltipla Escolha
        {
            id: "ex_26_5",
            type: "multiple_choice",
            instruction: "🎧 Você ouvirá uma frase sobre uma ação que está ACONTECENDO AGORA. Preste atenção na forma do verbo (-ing). Escolha a tradução em português que corresponde EXATAMENTE ao que você escutou.",
            options: ["Eu estou lendo um livro.", "Eu li um livro.", "Eu vou ler um livro."],
            correct_answer: "Eu estou lendo um livro.",
            audio_text: "I am reading a book.",
            skill: "listening_continuous_comprehension",
            difficulty: 2
        }
    ]
};

// Exportar todas as lições
export const mockLessons: Lesson[] = [
    mockLesson1,
    mockLesson2,
    mockLesson3,
    mockLesson4,
    mockLesson5,
    mockLesson7,
    mockLesson8,
    mockLesson13,
    mockLesson17,
    mockLesson21,
    mockLesson26
];