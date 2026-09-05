// src/components/AudioPlayer.tsx
import type { Lesson } from '../types/lesson';
import { audioEngine } from '../utils/audio';

interface AudioPlayerProps {
    lesson: Lesson;
}

export function AudioPlayer({ lesson }: AudioPlayerProps) {
    // Se a lição não tiver dados de áudio, não renderiza nada
    if (!lesson.chunks?.length && !lesson.sentences?.length && !lesson.contexts?.length) {
        return null;
    }

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-bold text-soul-gold mb-6 flex items-center gap-2">
                🎧 Áudio Inteligente (4 Camadas)
            </h3>

            {/* CAMADA 1: CHUNKS */}
            {lesson.chunks && lesson.chunks.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Nível 1: Chunks (Memorize inteiro)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {lesson.chunks.map((chunk, idx) => (
                            <button
                                key={idx}
                                onClick={() => audioEngine.playChunk(chunk)}
                                className="bg-soul-dark border border-gray-700 hover:border-soul-gold text-gray-300 hover:text-soul-gold px-4 py-2 rounded-lg transition-all text-sm"
                            >
                                🔊 {chunk}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CAMADA 2: SENTENCES */}
            {lesson.sentences && lesson.sentences.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Nível 2: Sentences (Estrutura completa)
                    </h4>
                    <div className="space-y-2">
                        {lesson.sentences.map((sentence, idx) => (
                            <button
                                key={idx}
                                onClick={() => audioEngine.playSentence(sentence.text)}
                                className="w-full text-left bg-soul-dark border border-gray-700 hover:border-soul-gold p-4 rounded-lg transition-all group"
                            >
                                <div className="text-gray-200 group-hover:text-white font-medium">
                                    🔊 {sentence.text}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">
                                    {sentence.translation}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CAMADA 3: CONTEXTS */}
            {lesson.contexts && lesson.contexts.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Nível 3: Contexts (Fluência natural)
                    </h4>
                    <div className="space-y-2">
                        {lesson.contexts.map((context, idx) => {
                            // Separa o texto em frases para a pausa do áudio
                            const sentencesArray = context.text.split('. ')
                                .filter(s => s.trim().length > 0)
                                .map(s => s.endsWith('.') ? s : s + '.');

                            return (
                                <button
                                    key={idx}
                                    onClick={() => audioEngine.playContext(sentencesArray)}
                                    className="w-full text-left bg-gradient-to-r from-soul-dark to-gray-900 border border-soul-gold/30 hover:border-soul-gold p-4 rounded-lg transition-all"
                                >
                                    <div className="text-soul-gold font-bold mb-1 flex items-center gap-2">
                                        🎬 Contexto
                                    </div>
                                    <div className="text-gray-300 italic">
                                        "{context.text}"
                                    </div>
                                    <div className="text-gray-500 text-sm mt-2">
                                        {context.translation}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}