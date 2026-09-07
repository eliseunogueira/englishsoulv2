// src/components/FrameVisualizer.tsx
import { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { audioEngine } from '../utils/audio';
import { GrammarEngine } from '../utils/grammarEngine';

interface FrameVisualizerProps {
    lesson: Lesson;
}

export function FrameVisualizer({ lesson }: FrameVisualizerProps) {
    const [filledSlots, setFilledSlots] = useState<Record<string, string>>({});
    const [validationMessage, setValidationMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

    // =================================================================
    // LÓGICA DE INTERAÇÃO
    // =================================================================

    const handleWordClick = (word: string, pieceType: string) => {
        setValidationMessage(null);
        audioEngine.playWord(word);

        // 1. Validação de Concordância (TO BE, DO/DOES, HAVE/HAS)
        if (pieceType === 'auxiliary') {
            const currentSubject = filledSlots['subject'] || 'I';
            const validation = GrammarEngine.validateAgreement(currentSubject, word);

            if (!validation.isValid) {
                setValidationMessage({
                    text: `Ops! "${currentSubject}" não combina com "${word}". O correto é "${validation.suggestion}".`,
                    type: 'error'
                });
                return; // Bloqueia o clique se estiver errado
            }
        }

        // 2. Atualiza o slot
        const newSlots = { ...filledSlots, [pieceType]: word };
        setFilledSlots(newSlots);

        // 3. Validação Semântica (apenas se preencheu o complemento)
        if (pieceType === 'complement' && newSlots['verb']) {
            validateComplement(word, newSlots);
        }
    };

    const validateComplement = (complement: string, slots: Record<string, string>) => {
        const verbBase = slots['verb'];
        if (!verbBase) return;

        const selectedVerb = lesson.inventory.verbs.find(v => v.base === verbBase);
        if (!selectedVerb) return;

        const isValid = selectedVerb.valid_complements.includes('all') || selectedVerb.valid_complements.includes(complement);

        if (!isValid) {
            const validExamples = selectedVerb.valid_complements.slice(0, 3).join(', ');
            setValidationMessage({
                text: `Ops! "${selectedVerb.base}" geralmente combina com: ${validExamples}.`,
                type: 'error'
            });
        } else {
            setValidationMessage({ text: "✅ Combinação perfeita!", type: 'success' });
        }
    };

    const resetFrame = () => {
        setFilledSlots({});
        setValidationMessage(null);
    };

    // =================================================================
    // MOTOR DE ÁUDIO DA FRASE COMPLETA
    // =================================================================

    const playFullSentence = () => {
        const subject = filledSlots['subject'] || "I";
        const auxiliary = (filledSlots['auxiliary'] || "").toLowerCase();
        const verbBase = filledSlots['verb'];
        const complement = filledSlots['complement'] || '';
        const modifier = filledSlots['modifier'] || '';

        if (!verbBase) return;

        let finalVerb = verbBase;
        const isToBe = ['am', 'is', 'are', 'was', 'were'].includes(auxiliary);
        const isHaveHas = ['have', 'has'].includes(auxiliary);

        // Busca o verbo no inventário para formas especiais (ing, participle)
        const verbObj = lesson.inventory.verbs.find(v => v.base === verbBase);

        // Aplica as regras de transformação do verbo
        if (isToBe) {
            finalVerb = verbObj?.ing || GrammarEngine.getIngForm(verbBase);
        } else if (isHaveHas) {
            finalVerb = verbObj?.participle || (verbBase.endsWith('e') ? verbBase + 'd' : verbBase + 'ed');
        } else if (!auxiliary) {
            finalVerb = GrammarEngine.conjugate(verbBase, 'present', subject);
        }

        // Monta a frase na ordem correta
        const sentenceParts = [subject];
        if (filledSlots['auxiliary']) sentenceParts.push(filledSlots['auxiliary']);
        sentenceParts.push(finalVerb);
        if (complement) sentenceParts.push(complement);
        if (modifier) sentenceParts.push(modifier);

        audioEngine.playSentence(sentenceParts.join(' '));
    };

    const isFrameComplete = filledSlots['subject'] && filledSlots['verb'];

    // =================================================================
    // RENDERIZAÇÃO (UI)
    // =================================================================

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mb-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-soul-gold flex items-center gap-2">
                    🧩 O Frame (Monte a Frase)
                </h3>
                <button onClick={resetFrame} className="text-xs text-gray-400 hover:text-white underline">
                    Limpar
                </button>
            </div>

            {/* Slots Dinâmicos */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {lesson.frame_recipe.map((slot) => {
                    const isFilled = filledSlots[slot.id];

                    let displayText = isFilled;
                    let suffixText = '';

                    // Lógica de Transformação Visual do Verbo
                    if (slot.id === 'verb' && isFilled) {
                        const subject = (filledSlots['subject'] || 'I').toLowerCase();
                        const auxiliary = (filledSlots['auxiliary'] || '').toLowerCase();

                        const isToBe = ['am', 'is', 'are', 'was', 'were', "'m", "'s", "'re"].includes(auxiliary);
                        const isHaveHas = ['have', 'has'].includes(auxiliary);
                        const hasOtherAuxiliary = auxiliary && !isToBe && !isHaveHas;

                        const verbObj = lesson.inventory.verbs.find(v => v.base === isFilled);

                        if (isToBe) {
                            displayText = verbObj?.ing || GrammarEngine.getIngForm(isFilled);
                            suffixText = 'ing';
                        } else if (isHaveHas) {
                            displayText = verbObj?.participle || (isFilled.endsWith('e') ? isFilled + 'd' : isFilled + 'ed');
                            suffixText = 'pp';
                        } else if (hasOtherAuxiliary) {
                            displayText = isFilled;
                            suffixText = '';
                        } else if (['he', 'she', 'it'].includes(subject)) {
                            displayText = GrammarEngine.conjugate(isFilled, 'present', subject);
                            suffixText = displayText !== isFilled ? 's' : '';
                        }
                    }

                    return (
                        <div
                            key={slot.id}
                            className={`relative flex flex-col items-center justify-center w-32 h-24 rounded-lg border-2 transition-all duration-300 ${
                                isFilled ? 'border-soul-gold bg-soul-gold/10' : 'border-dashed border-gray-600 bg-soul-dark'
                            }`}
                        >
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {slot.label}
              </span>
                            <span className={`text-lg font-bold ${isFilled ? 'text-soul-gold' : 'text-gray-600'}`}>
                {displayText || '___'}
              </span>

                            {/* Selo de Sufixo (s, ing, pp) */}
                            {suffixText && (
                                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  +{suffixText}
                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mensagem de Validação */}
            {validationMessage && (
                <div className={`text-center p-3 rounded-lg mb-6 text-sm font-medium ${
                    validationMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-500/50' :
                        validationMessage.type === 'info' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/50' : 'bg-red-900/30 text-red-400 border border-red-500/50'
                }`}>
                    {validationMessage.text}
                </div>
            )}

            {/* Botão Ler Frase Completa */}
            {isFrameComplete && (
                <div className="flex justify-center mb-8">
                    <button
                        onClick={playFullSentence}
                        className="bg-soul-gold text-soul-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 text-lg shadow-lg hover:shadow-soul-gold/20 hover:scale-105"
                    >
                        🔊 Ler Frase Completa
                    </button>
                </div>
            )}

            {/* Banco de Palavras */}
            <div className="space-y-6">
                {/* Sujeitos */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Sujeitos</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {lesson.inventory.subjects.map((subject, idx) => (
                            <button key={`s-${idx}`} onClick={() => handleWordClick(subject, 'subject')} className={`px-4 py-2 rounded-md border transition-all text-sm font-bold ${filledSlots['subject'] === subject ? 'bg-soul-gold text-soul-dark border-soul-gold' : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'}`}>
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Auxiliares */}
                {lesson.inventory.auxiliaries.length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Auxiliares</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {lesson.inventory.auxiliaries.map((aux, idx) => (
                                <button key={`a-${idx}`} onClick={() => handleWordClick(aux, 'auxiliary')} className={`px-4 py-2 rounded-md border transition-all text-sm ${filledSlots['auxiliary'] === aux ? 'bg-soul-gold text-soul-dark border-soul-gold' : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'}`}>
                                    {aux}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Verbos */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Verbos</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {lesson.inventory.verbs.map((verb, idx) => (
                            <button key={`v-${idx}`} onClick={() => handleWordClick(verb.base, 'verb')} className={`px-4 py-2 rounded-md border transition-all text-sm font-medium ${filledSlots['verb'] === verb.base ? 'bg-soul-gold text-soul-dark border-soul-gold' : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'}`}>
                                {verb.base}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Complementos */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Complementos</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {lesson.inventory.complements.map((comp, idx) => (
                            <button key={`c-${idx}`} onClick={() => handleWordClick(comp, 'complement')} className={`px-4 py-2 rounded-md border transition-all text-sm ${filledSlots['complement'] === comp ? 'bg-soul-gold text-soul-dark border-soul-gold' : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'}`}>
                                {comp}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modificadores */}
                {lesson.inventory.modifiers.length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Modificadores</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {lesson.inventory.modifiers.map((mod, idx) => (
                                <button key={`m-${idx}`} onClick={() => handleWordClick(mod, 'modifier')} className={`px-4 py-2 rounded-md border transition-all text-sm ${filledSlots['modifier'] === mod ? 'bg-soul-gold text-soul-dark border-soul-gold' : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'}`}>
                                    {mod}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}