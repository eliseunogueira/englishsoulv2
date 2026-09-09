// src/utils/frameEngine.ts
import type { Lesson } from '../types/lesson';
import { GrammarEngine } from './grammarEngine';

export interface FrameState {
    subject?: string;
    auxiliary?: string;
    verb?: string;
    complement?: string;
    modifier?: string;
}

export interface FrameResult {
    displayTexts: Record<string, string>; // O que aparece no slot (ex: "drinks", "reading")
    suffixes: Record<string, string>;     // O selo (ex: "s", "ing", "pp")
    audioText: string;                    // A frase final limpa para o TTS
    errorMessage: string | null;          // Mensagem de erro de concordância/semântica
}

export class FrameEngine {
    /**
     * Processa o estado atual do frame e retorna como ele deve ser exibido e falado.
     */
    public static processFrame(state: FrameState, lesson: Lesson): FrameResult {
        const result: FrameResult = {
            displayTexts: {},
            suffixes: {},
            audioText: '',
            errorMessage: null,
        };

        // 1. Validação de Concordância (Auxiliar + Sujeito)
        if (state.auxiliary && state.subject) {
            const validation = GrammarEngine.validateAgreement(state.subject, state.auxiliary);
            if (!validation.isValid) {
                result.errorMessage = `Ops! "${state.subject}" não combina com "${state.auxiliary}". O correto é "${validation.suggestion}".`;
                return result; // Interrompe o processamento se houver erro grave de concordância
            }
        }

        // 2. Processamento do Verbo (Transformação Morfológica)
        if (state.verb) {
            const auxiliary = (state.auxiliary || '').toLowerCase();
            const subject = (state.subject || 'I').toLowerCase();
            const verbObj = lesson.inventory.verbs.find(v => v.base === state.verb);

            const isToBe = ['am', 'is', 'are', 'was', 'were', "'m", "'s", "'re"].includes(auxiliary);
            const isHaveHas = ['have', 'has'].includes(auxiliary);
            const hasOtherAuxiliary = auxiliary && !isToBe && !isHaveHas;

            // Adicione esta verificação:
            const isLesson17 = lesson.id === 'lesson_17';
            const isPastTense = isLesson17 && !auxiliary; // Lição 17 sem auxiliar = passado


            if (isToBe) {
                result.displayTexts['verb'] = verbObj?.ing || GrammarEngine.getIngForm(state.verb);
                result.suffixes['verb'] = 'ing';
            } else if (isHaveHas) {
                result.displayTexts['verb'] = verbObj?.participle || (state.verb.endsWith('e') ? state.verb + 'd' : state.verb + 'ed');
                result.suffixes['verb'] = 'pp';
            } else if (hasOtherAuxiliary) {
                result.displayTexts['verb'] = state.verb;
                result.suffixes['verb'] = '';
            }
            else if (isPastTense) {
                // ✅ NOVO: Lição 17 sem auxiliar = conjugar no passado
                result.displayTexts['verb'] = verbObj?.past || (state.verb.endsWith('e') ? state.verb + 'd' : state.verb + 'ed');
                result.suffixes['verb'] = 'past';
            }


            else if (['he', 'she', 'it'].includes(subject)) {
                const conjugated = GrammarEngine.conjugate(state.verb, 'present', subject);
                result.displayTexts['verb'] = conjugated;
                result.suffixes['verb'] = conjugated !== state.verb ? 's' : '';
            } else {
                result.displayTexts['verb'] = state.verb;
                result.suffixes['verb'] = '';
            }
        }

        // Preenche os outros textos de exibição (sem transformação)
        if (state.subject) result.displayTexts['subject'] = state.subject;
        if (state.auxiliary) result.displayTexts['auxiliary'] = state.auxiliary;
        if (state.complement) result.displayTexts['complement'] = state.complement;
        if (state.modifier) result.displayTexts['modifier'] = state.modifier;

        // 3. Validação Semântica (Verbo + Complemento)
        if (state.verb && state.complement) {
            const verbObj = lesson.inventory.verbs.find(v => v.base === state.verb);
            if (verbObj) {
                const isValid = verbObj.valid_complements.includes('all') || verbObj.valid_complements.includes(state.complement);
                if (!isValid) {
                    const examples = verbObj.valid_complements.slice(0, 3).join(', ');
                    result.errorMessage = `Ops! "${state.verb}" geralmente combina com: ${examples}.`;
                }
            }
        }
        // 4. Montagem da Frase de Áudio (Dinâmica baseada no frame_recipe)
        const audioParts: string[] = [];

        // O segredo: usamos a ordem exata do frame_recipe da lição!
        lesson.frame_recipe.forEach(slot => {
            const slotId = slot.id as keyof FrameState;
            const value = state[slotId];

            // Se o slot estiver preenchido
            if (value) {
                // Se for o slot do verbo, usamos a forma transformada (ex: "spoke", "reading", "drinks")
                if (slotId === 'verb' && result.displayTexts['verb']) {
                    audioParts.push(result.displayTexts['verb']);
                }
                // Para todos os outros slots (sujeito, auxiliar, complemento, modificador), usamos o valor original
                else {
                    audioParts.push(value);
                }
            }
        });

        result.audioText = audioParts.join(' ');

        return result;
    }
}