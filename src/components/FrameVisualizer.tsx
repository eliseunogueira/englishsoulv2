// src/components/FrameVisualizer.tsx
import { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { audioEngine } from '../utils/audio';

interface FrameVisualizerProps {
    lesson: Lesson;
}

export function FrameVisualizer({ lesson }: FrameVisualizerProps) {
    const frameParts = lesson.concept.core_frame.split(' + ');
    const [filledSlots, setFilledSlots] = useState<Record<number, string>>({});
    const [validationMessage, setValidationMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleWordClick = (word: string, type: 'subject' | 'verb' | 'object') => {
        audioEngine.playWord(word);
        setValidationMessage(null);

        let targetSlotIndex = -1;
        if (type === 'subject') targetSlotIndex = 0;
        else if (type === 'verb') targetSlotIndex = 1;
        else if (type === 'object') targetSlotIndex = 2;

        if (targetSlotIndex !== -1) {
            const newSlots = { ...filledSlots, [targetSlotIndex]: word };
            setFilledSlots(newSlots);

            if (newSlots[1] && newSlots[2]) {
                validateCombination(newSlots[1], newSlots[2]);
            }
        }
    };

    const validateCombination = (verbBase: string, object: string) => {
        const selectedVerb = lesson.vocabulary.verbs.find(v => v.base === verbBase);

        if (selectedVerb) {
            const isValid = selectedVerb.valid_objects.includes('all') || selectedVerb.valid_objects.includes(object);

            if (!isValid) {
                const validExamples = selectedVerb.valid_objects.slice(0, 3).join(', ');
                setValidationMessage({
                    text: `Ops! Em inglês, nós geralmente "${selectedVerb.base}" (ex: ${validExamples}). "${object}" não combina com este verbo.`,
                    type: 'error'
                });
            } else {
                setValidationMessage({
                    text: "✅ Combinação perfeita! A frase faz sentido.",
                    type: 'success'
                });
                const subject = filledSlots[0] || "I";
                audioEngine.playSentence(`${subject} ${verbBase} ${object}.`);
            }
        }
    };

    const resetFrame = () => {
        setFilledSlots({});
        setValidationMessage(null);
    };

    const allAvailableObjects = Array.from(new Set([
        ...lesson.vocabulary.nouns,
        ...lesson.vocabulary.verbs.flatMap(v => v.valid_objects.filter(vo => vo !== 'all'))
    ]));

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-soul-gold flex items-center gap-2">
                    🧩 O Frame (Monte a Frase)
                </h3>
                <button
                    onClick={resetFrame}
                    className="text-xs text-gray-400 hover:text-white underline"
                >
                    Limpar
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {frameParts.map((part, index) => {
                    const isFilled = filledSlots[index];
                    return (
                        <div
                            key={index}
                            className={`
                flex flex-col items-center justify-center w-32 h-24 rounded-lg border-2 transition-all duration-300
                ${isFilled
                                ? 'border-soul-gold bg-soul-gold/10'
                                : 'border-dashed border-gray-600 bg-soul-dark'}
              `}
                        >
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {part}
              </span>
                            <span className={`text-lg font-bold ${isFilled ? 'text-soul-gold' : 'text-gray-600'}`}>
                {isFilled || '___'}
              </span>
                        </div>
                    );
                })}
            </div>

            {validationMessage && (
                <div className={`text-center p-3 rounded-lg mb-6 text-sm font-medium ${
                    validationMessage.type === 'success'
                        ? 'bg-green-900/30 text-green-400 border border-green-500/50'
                        : 'bg-red-900/30 text-red-400 border border-red-500/50'
                }`}>
                    {validationMessage.text}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">1. Escolha o Sujeito</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {lesson.vocabulary.pronouns.map((pronoun, idx) => (
                            <button
                                key={`p-${idx}`}
                                onClick={() => handleWordClick(pronoun, 'subject')}
                                className={`px-4 py-2 rounded-md border transition-all text-sm font-bold ${
                                    filledSlots[0] === pronoun
                                        ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                        : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                }`}
                            >
                                {pronoun}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">2. Escolha a Ação</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {lesson.vocabulary.verbs.map((verb, idx) => (
                            <button
                                key={`v-${idx}`}
                                onClick={() => handleWordClick(verb.base, 'verb')}
                                className={`px-4 py-2 rounded-md border transition-all text-sm font-medium ${
                                    filledSlots[1] === verb.base
                                        ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                        : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                }`}
                            >
                                {verb.base}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">3. Escolha o Objeto</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {allAvailableObjects.map((obj, idx) => (
                            <button
                                key={`o-${idx}`}
                                onClick={() => handleWordClick(obj, 'object')}
                                className={`px-4 py-2 rounded-md border transition-all text-sm ${
                                    filledSlots[2] === obj
                                        ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                        : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                }`}
                            >
                                {obj}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}