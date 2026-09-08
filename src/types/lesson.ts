// src/types/lesson.ts

// ============================================================================
// TEORIA UNIFICADA DAS PEÇAS DO ENGLISH SOUL
// ============================================================================

// 1. Tipos Atômicos de Peças (Tudo no curso é uma dessas peças)
export type PieceType =
    | 'subject'       // I, You, He, She, We, They
    | 'auxiliary'     // DO, DOES, DID, WILL, TO BE, CAN, COULD, SHOULD, WOULD
    | 'main_verb'     // eat, drink, be, go, speak
    | 'complement'    // fish, happy, at home, in love, to finish (objetos, estados, infinitivos)
    | 'modifier';     // always, yesterday, by myself, tomorrow, too much

// 2. Categorias de Complementos (O que cada verbo aceita)
export type ComplementType =
    | 'object'        // fish, water, book (recebe ação)
    | 'adjective'     // happy, sad, tired (estado)
    | 'preposition'   // at home, in love, on Sunday (locativo/temporal)
    | 'infinitive'    // to finish, to go, to speak (ação futura)
    | 'gerund';       // swimming, reading (ação em progresso)

// 3. O Verbo Polimórfico (Tem múltiplas formas e regras)
export interface Verb {
    base: string;           // eat
    past?: string;          // ate
    participle?: string;    // eaten (para perfect)
    ing?: string;           // eating (para continuous)

    // O que essa peça aceita no slot de complemento?
    valid_complements: string[];
    valid_complement_types: ComplementType[];

    // Regras especiais (TO BE não usa DO/DON'T, WILL é invariante, etc.)
    special_rules?: {
        no_do_support?: boolean;      // TO BE, CAN, WILL, SHOULD, WOULD
        invariant?: boolean;          // WILL, CAN, SHOULD, WOULD (não muda com sujeito)
        requires_to?: boolean;        // Verbos que exigem TO antes do próximo verbo
    };
}

// 4. O Frame agora é uma "Receita de Slots" (Dinâmico)
export interface FrameSlot {
    id: string;
    accepts: PieceType;
    label: string;              // "Subject", "Auxiliary", "Verb", "Object"
    isOptional?: boolean;       // Auxiliares só aparecem em negativa/pergunta
    position?: number;          // Ordem na frase (0, 1, 2, 3...)
}

// 5. Exercícios com metadados pedagógicos
export type ExerciseType = 'multiple_choice' | 'reorder' | 'fill_blank' | 'listening';


export interface Exercise {
    id: string;
    type: ExerciseType;
    instruction: string;
    question_text?: string;
    options: string[];
    correct_answer: string | string[];
    audio_text?: string;
    skill?: string;             // "syntax", "negative", "third_person", "semantic"
    difficulty?: 1 | 2 | 3;
}

// 6. A Lição (O Contexto Completo)
export interface Lesson {
    id: string;
    phase: 'foundation' | 'expansion' | 'complexity' | 'mastery';
    title: string;
    description: string; // ✅ NOVO: A descrição que antes estava em concept
    semantic_field: string;

    // O inventário de peças disponíveis nesta lição
    inventory: {
        subjects: string[];
        auxiliaries: string[];      // ["DO", "DON'T", "DOES", "DOESN'T", "DID", "DIDN'T", "WILL", "WON'T"]
        verbs: Verb[];
        complements: string[];      // Todos os complementos válidos (objetos, adjetivos, preposições)
        modifiers: string[];        // always, never, yesterday, tomorrow, by myself
    };

    // A receita de como montar a frase (Frame dinâmico)
    frame_recipe: FrameSlot[];

    // Exemplos estruturados (para áudio e contexto)
    sentences: {
        text: string;
        translation: string;
        frame_parts: Record<string, string>;  // { subject: "I", auxiliary: "don't", verb: "eat", object: "fish" }
    }[];

    contexts: {
        text: string;
        translation: string;
    }[];

    // Regras gramaticais específicas desta lição
    grammar_rules: {
        rule: string;
        pattern: string;
        example: string;
    }[];

    // Exercícios (podem vir do backend ou estar pré-definidos)
    exercises: Exercise[];
}