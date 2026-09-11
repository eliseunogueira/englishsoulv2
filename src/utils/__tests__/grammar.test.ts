// src/utils/__tests__/grammar.test.ts
import { describe, it, expect } from 'vitest';
import { GrammarEngine } from '../grammarEngine';
import { FrameEngine, type FrameState } from '../frameEngine';
import type { Lesson } from '../../types/lesson';

// Mock de uma lição genérica para testar o FrameEngine
const mockLesson: Lesson = {
    id: "test_lesson",
    phase: "foundation",
    title: "Test",
    description: "Test",
    semantic_field: "Test",
    default_tense: "present",
    inventory: {
        subjects: ["I", "You", "He", "She", "It", "We", "They"],
        auxiliaries: ["DO", "DOES", "DON'T", "DOESN'T", "CAN", "CAN'T", "WILL", "WON'T"],
        verbs: [
            { base: "drink", past: "drank", valid_complements: ["water", "coffee"], valid_complement_types: ["object"] },
            { base: "speak", past: "spoke", valid_complements: ["English", "loudly"], valid_complement_types: ["object", "adverb"] },
            { base: "be", ing: "being", participle: "been", valid_complements: ["happy", "tired"], valid_complement_types: ["adjective"], special_rules: { no_do_support: true } }
        ],
        complements: ["water", "coffee", "English", "loudly", "happy", "tired"],
        modifiers: []
    },
    frame_recipe: [
        { id: "subject", accepts: "subject", label: "Subject", position: 0 },
        { id: "auxiliary", accepts: "auxiliary", label: "Aux", position: 1, isOptional: true },
        { id: "verb", accepts: "main_verb", label: "Verb", position: 2 },
        { id: "complement", accepts: "complement", label: "Comp", position: 3 }
    ],
    sentences: [],
    contexts: [],
    grammar_rules: [],
    exercises: []
};

describe('GrammarEngine - Regras de Concordância', () => {
    it('Deve bloquear "He" + "don\'t" e sugerir "doesn\'t"', () => {
        const result = GrammarEngine.validateAgreement('He', 'don\'t');
        expect(result.isValid).toBe(false);
        expect(result.suggestion).toBe('doesn\'t');
    });

    it('Deve bloquear "I" + "is" e sugerir "am"', () => {
        const result = GrammarEngine.validateAgreement('I', 'is');
        expect(result.isValid).toBe(false);
        expect(result.suggestion).toBe('am');
    });

    it('Deve permitir "They" + "are"', () => {
        const result = GrammarEngine.validateAgreement('They', 'are');
        expect(result.isValid).toBe(true);
    });
});

describe('FrameEngine - Transformação Morfológica (O Contrato)', () => {

    it('Lição 1: He + drink + water -> "He drinks water"', () => {
        const state: FrameState = { subject: 'He', verb: 'drink', complement: 'water' };
        const result = FrameEngine.processFrame(state, mockLesson);

        expect(result.displayTexts['verb']).toBe('drinks');
        expect(result.suffixes['verb']).toBe('s');
        expect(result.audioText).toBe('He drinks water');
        expect(result.errorMessage).toBeNull();
    });

    it('Lição 2 (Modal): He + CAN + speak + English -> "He can speak English"', () => {
        const state: FrameState = { subject: 'He', auxiliary: 'CAN', verb: 'speak', complement: 'English' };
        const result = FrameEngine.processFrame(state, mockLesson);

        expect(result.displayTexts['verb']).toBe('speak'); // Invariável!
        expect(result.suffixes['verb']).toBe('');
        expect(result.audioText).toBe('He CAN speak English');
    });

    it('Lição 17 (Passado): He + drink + water (default_tense: past) -> "He drank water"', () => {
        // Sobrescrevemos o default_tense para simular a Lição 17
        const pastLesson = { ...mockLesson, default_tense: 'past' as const };
        const state: FrameState = { subject: 'He', verb: 'drink', complement: 'water' };
        const result = FrameEngine.processFrame(state, pastLesson);

        expect(result.displayTexts['verb']).toBe('drank');
        expect(result.suffixes['verb']).toBe('past');
        expect(result.audioText).toBe('He drank water');
    });

    it('Validação Semântica: He + drink + English -> Deve dar erro', () => {
        const state: FrameState = { subject: 'He', verb: 'drink', complement: 'English' };
        const result = FrameEngine.processFrame(state, mockLesson);

        expect(result.errorMessage).toContain('drink');
    });
});