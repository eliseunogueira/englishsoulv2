// src/components/FrameVisualizer.tsx
import { useState, useMemo } from 'react';
import type { Lesson } from '../types/lesson';
import { audioEngine } from '../utils/audio';
import { FrameEngine, type FrameState } from '../utils/frameEngine';

interface FrameVisualizerProps {
    lesson: Lesson;
}

export function FrameVisualizer({ lesson }: FrameVisualizerProps) {
    const [filledSlots, setFilledSlots] = useState<FrameState>({});

    // ✅ Toda a lógica de processamento está no FrameEngine
    const frameResult = useMemo(() => {
        return FrameEngine.processFrame(filledSlots, lesson);
    }, [filledSlots, lesson]);

    const handleWordClick = (word: string, pieceType: string) => {
        // Atualiza o slot
        setFilledSlots(prev => ({ ...prev, [pieceType]: word }));

        // Toca o áudio da palavra clicada
        audioEngine.playWord(word);
    };

    const resetFrame = () => {
        setFilledSlots({});
    };

    const playFullSentence = () => {
        if (frameResult.audioText) {
            audioEngine.playSentence(frameResult.audioText);
        }
    };

// Por esta:
    const isFrameComplete = lesson.frame_recipe
        .filter(slot => !slot.isOptional)
        .every(slot => filledSlots[slot.id as keyof FrameState]);

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
                    const isFilled = filledSlots[slot.id as keyof FrameState];
                    const displayText = frameResult.displayTexts[slot.id] || (isFilled ? isFilled : '___');
                    const suffix = frameResult.suffixes[slot.id];

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
                {displayText}
              </span>

                            {/* Selo de Sufixo (s, ing, pp) */}
                            {suffix && (
                                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  +{suffix}
                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mensagem de Erro (Concordância ou Semântica) */}
            {frameResult.errorMessage && (
                <div className="text-center p-3 rounded-lg mb-6 text-sm font-medium bg-red-900/30 text-red-400 border border-red-500/50">
                    {frameResult.errorMessage}
                </div>
            )}

            {/* Botão Ler Frase Completa */}
            {isFrameComplete && !frameResult.errorMessage && (
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
                            <button
                                key={`s-${idx}`}
                                onClick={() => handleWordClick(subject, 'subject')}
                                className={`px-4 py-2 rounded-md border transition-all text-sm font-bold ${
                                    filledSlots.subject === subject
                                        ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                        : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                }`}
                            >
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
                                <button
                                    key={`a-${idx}`}
                                    onClick={() => handleWordClick(aux, 'auxiliary')}
                                    className={`px-4 py-2 rounded-md border transition-all text-sm ${
                                        filledSlots.auxiliary === aux
                                            ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                            : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                    }`}
                                >
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
                            <button
                                key={`v-${idx}`}
                                onClick={() => handleWordClick(verb.base, 'verb')}
                                className={`px-4 py-2 rounded-md border transition-all text-sm font-medium ${
                                    filledSlots.verb === verb.base
                                        ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                        : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                }`}
                            >
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
                            <button
                                key={`c-${idx}`}
                                onClick={() => handleWordClick(comp, 'complement')}
                                className={`px-4 py-2 rounded-md border transition-all text-sm ${
                                    filledSlots.complement === comp
                                        ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                        : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                }`}
                            >
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
                                <button
                                    key={`m-${idx}`}
                                    onClick={() => handleWordClick(mod, 'modifier')}
                                    className={`px-4 py-2 rounded-md border transition-all text-sm ${
                                        filledSlots.modifier === mod
                                            ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                            : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                    }`}
                                >
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