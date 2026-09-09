// src/components/AudioPlayer.tsx
import { audioEngine } from '../utils/audio';
import type { Lesson } from '../types/lesson';

interface AudioPlayerProps {
    lesson: Lesson;
}

export function AudioPlayer({ lesson }: AudioPlayerProps) {
    // Verifica se há conteúdo para renderizar
    if (!lesson.sentences?.length && !lesson.contexts?.length) {
        return null;
    }

    const playAudio = (text: string) => {
        audioEngine.playSentence(text);
    };

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-soul-gold mb-6 flex items-center gap-2">
                🎧 Camadas de Áudio
            </h3>

            {/* Camada 1: Sentenças Individuais */}
            {lesson.sentences && lesson.sentences.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Frases do Frame
                    </p>
                    <div className="space-y-2">
                        {lesson.sentences.map((sentence, idx: number) => (
                            <button
                                key={`sentence-${idx}`}
                                onClick={() => playAudio(sentence.text)}
                                className="w-full text-left p-3 bg-soul-dark border border-gray-700 rounded-lg hover:border-soul-gold hover:text-soul-gold transition-all text-sm group"
                            >
                                <div className="text-gray-300 group-hover:text-soul-gold">
                                    {sentence.text}
                                </div>
                                <div className="text-gray-500 text-xs mt-1">
                                    {sentence.translation}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Camada 2: Contextos */}
            {lesson.contexts && lesson.contexts.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Contexto Completo
                    </p>
                    <div className="space-y-2">
                        {lesson.contexts.map((context, idx: number) => (
                            <button
                                key={`context-${idx}`}
                                onClick={() => playAudio(context.text)}
                                className="w-full text-left p-3 bg-soul-dark border border-gray-700 rounded-lg hover:border-soul-gold hover:text-soul-gold transition-all text-sm group"
                            >
                                <div className="text-gray-300 group-hover:text-soul-gold">
                                    {context.text}
                                </div>
                                <div className="text-gray-500 text-xs mt-1">
                                    {context.translation}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}