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

    // Toda a lógica de processamento está no FrameEngine
    const frameResult = useMemo(() => {
        return FrameEngine.processFrame(filledSlots, lesson);
    }, [filledSlots, lesson]);

    const handleWordClick = (word: string, pieceType: string) => {
        setFilledSlots(prev => ({ ...prev, [pieceType]: word }));
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

    // O frame está completo quando todos os slots obrigatórios estão preenchidos
    const isFrameComplete = lesson.frame_recipe
        .filter(slot => !slot.isOptional)
        .every(slot => filledSlots[slot.id as keyof FrameState]);

    // ============================================================================
    // RENDERIZAÇÃO DINÂMICA DOS SLOTS DO FRAME
    // ============================================================================
    const renderFrameSlots = () => {
        return lesson.frame_recipe.map((slot) => {
            const slotId = slot.id as keyof FrameState;
            const isFilled = filledSlots[slotId];
            const displayText = frameResult.displayTexts[slot.id] || (isFilled ? String(isFilled) : '___');
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

                    {suffix && (
                        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              +{suffix}
            </span>
                    )}
                </div>
            );
        });
    };

    // ============================================================================
    // RENDERIZAÇÃO DINÂMICA DO BANCO DE PALAVRAS (INVENTÁRIO)
    // ============================================================================

    // Mapeamento: tipo de peça (accepts) -> dados do inventário + label da seção
    const inventorySections: {
        type: string;
        label: string;
        items: string[];
        slotId: keyof FrameState;
    }[] = [
        {
            type: 'subject',
            label: 'Sujeitos',
            items: lesson.inventory.subjects,
            slotId: 'subject'
        },
        {
            type: 'auxiliary',
            label: 'Auxiliares',
            items: lesson.inventory.auxiliaries,
            slotId: 'auxiliary'
        },
        {
            type: 'question_word',
            label: 'Question Words',
            items: lesson.inventory.question_words || [],
            slotId: 'question_word'
        },
        {
            type: 'there_be',
            label: 'There is/are',
            items: lesson.inventory.there_be || [],
            slotId: 'there_be'
        },
        {
            type: 'main_verb',
            label: 'Verbos',
            items: lesson.inventory.verbs.map(v => v.base),
            slotId: 'verb'
        },
        {
            type: 'complement',
            label: 'Complementos',
            items: lesson.inventory.complements,
            slotId: 'complement'
        },
        {
            type: 'modifier',
            label: 'Modificadores',
            items: lesson.inventory.modifiers,
            slotId: 'modifier'
        },
    ];

    const renderInventoryButtons = () => {
        return inventorySections
            .filter(section => section.items.length > 0) // Só renderiza seções com itens
            .map((section) => (
                <div key={section.type}>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
                        {section.label}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {section.items.map((item, idx) => {
                            const isSelected = filledSlots[section.slotId] === item;
                            return (
                                <button
                                    key={`${section.type}-${idx}`}
                                    onClick={() => handleWordClick(item, section.slotId)}
                                    className={`px-4 py-2 rounded-md border transition-all text-sm font-bold ${
                                        isSelected
                                            ? 'bg-soul-gold text-soul-dark border-soul-gold'
                                            : 'bg-soul-dark border-gray-700 text-gray-300 hover:border-soul-gold hover:text-soul-gold'
                                    }`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ));
    };

    // ============================================================================
    // RENDERIZAÇÃO PRINCIPAL
    // ============================================================================
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

            {/* Slots Dinâmicos do Frame */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {renderFrameSlots()}
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

            {/* Banco de Palavras (Inventário Dinâmico) */}
            <div className="space-y-6">
                {renderInventoryButtons()}
            </div>
        </div>
    );
}