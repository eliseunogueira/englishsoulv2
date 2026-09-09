import type { Lesson } from '../types/lesson';
import { GrammarEngine } from './grammarEngine';

/**
 * Representa o estado atual do frame (o que o aluno clicou até agora).
 */
export interface FrameState {
    subject?: string;
    auxiliary?: string;
    verb?: string;
    complement?: string;
    modifier?: string;
}

/**
 * O resultado processado que a UI vai renderizar.
 */
export interface FrameResult {
    displayTexts: Record<string, string>; // O texto final de cada slot (ex: "drinks", "reading")
    suffixes: Record<string, string>;     // O selo visual (ex: "s", "ing", "pp", "past")
    audioText: string;                    // A frase limpa e ordenada para o TTS
    errorMessage: string | null;          // Mensagem de erro de concordância ou semântica
}

export class FrameEngine {
    /**
     * Processa o estado atual do frame e retorna como ele deve ser exibido e falado.
     * @param state O estado atual dos slots preenchidos.
     * @param lesson A lição atual (fonte de verdade para inventário e receita).
     */
    public static processFrame(state: FrameState, lesson: Lesson): FrameResult {
        const result: FrameResult = {
            displayTexts: {},
            suffixes: {},
            audioText: '',
            errorMessage: null,
        };

        // 1. Validação de Concordância (Sujeito + Auxiliar)
        if (state.auxiliary && state.subject) {
            const validation = GrammarEngine.validateAgreement(state.subject, state.auxiliary);
            if (!validation.isValid) {
                result.errorMessage = `Ops! "${state.subject}" não combina com "${state.auxiliary}". O correto é "${validation.suggestion}".`;
                return result; // Interrompe o processamento se houver erro grave
            }
        }

        // 2. Processamento do Verbo (Transformação Morfológica)
        if (state.verb) {
            const auxiliary = (state.auxiliary || '').toLowerCase();
            const subject = (state.subject || 'I').toLowerCase();

            // Busca o verbo no inventário (Fonte Única da Verdade)
            const verbObj = lesson.inventory.verbs.find(v => v.base === state.verb);

            const isToBe = ['am', 'is', 'are', 'was', 'were', "'m", "'s", "'re"].includes(auxiliary);
            const isHaveHas = ['have', 'has'].includes(auxiliary);
            const hasOtherAuxiliary = auxiliary && !isToBe && !isHaveHas;

            if (isToBe) {
                // TO BE + Verbo principal = Gerúndio (-ing)
                result.displayTexts['verb'] = verbObj?.ing || GrammarEngine.getIngForm(state.verb);
                result.suffixes['verb'] = 'ing';
            } else if (isHaveHas) {
                // HAVE/HAS + Verbo principal = Particípio Passado
                result.displayTexts['verb'] = verbObj?.participle || (state.verb.endsWith('e') ? state.verb + 'd' : state.verb + 'ed');
                result.suffixes['verb'] = 'pp';
            } else if (hasOtherAuxiliary) {
                // DO, DOES, DID, WILL, WON'T = Verbo na forma base
                result.displayTexts['verb'] = state.verb;
                result.suffixes['verb'] = '';
            } else {
                // SEM AUXILIAR: Usa o default_tense declarado na lição
                const tense = lesson.default_tense || 'present';

                if (tense === 'past') {
                    result.displayTexts['verb'] = verbObj?.past || (state.verb.endsWith('e') ? state.verb + 'd' : state.verb + 'ed');
                    result.suffixes['verb'] = 'past';
                } else if (tense === 'future') {
                    result.displayTexts['verb'] = state.verb;
                    result.suffixes['verb'] = '';
                } else {
                    // Presente Simples
                    // Exceção manual para o verbo TO BE caso ele apareça sem auxiliar
                    if (state.verb.toLowerCase() === 'be') {
                        const toBeForms: Record<string, string> = {
                            'i': 'am', 'he': 'is', 'she': 'is', 'it': 'is',
                            'you': 'are', 'we': 'are', 'they': 'are'
                        };
                        result.displayTexts['verb'] = toBeForms[subject] || 'is';
                    } else {
                        // Aplica a regra regular (+s, +es, +ies)
                        result.displayTexts['verb'] = GrammarEngine.conjugateRegular(state.verb, subject);
                    }
                    result.suffixes['verb'] = result.displayTexts['verb'] !== state.verb ? 's' : '';
                }
            }
        }

        // Preenche os textos dos outros slots (sem transformação)
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
        // O áudio obedece exatamente à ordem visual definida na receita da lição.
        const audioParts: string[] = [];
        lesson.frame_recipe.forEach(slot => {
            const slotId = slot.id as keyof FrameState;
            const value = state[slotId];

            if (value) {
                if (slotId === 'verb' && result.displayTexts['verb']) {
                    audioParts.push(result.displayTexts['verb']);
                } else {
                    audioParts.push(value);
                }
            }
        });
        result.audioText = audioParts.join(' ');

        return result;
    }
}