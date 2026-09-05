// src/pages/LessonViewPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { AudioPlayer } from '../components/AudioPlayer';
import { VoiceSelector } from '../components/VoiceSelector';

export function LessonViewPage() {
    const currentLesson = useAppStore((state) => state.currentLesson);
    const navigate = useNavigate();

    if (!currentLesson) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                <p>Lição não encontrada.</p>
                <button onClick={() => navigate('/')} className="text-soul-gold ml-2 underline">Voltar</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-soul-dark text-soul-text p-6 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header com Botão Voltar */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-gray-400 hover:text-soul-gold transition-colors flex items-center gap-2"
                >
                    ← Voltar para as Lições
                </button>

                {/* Cabeçalho da Lição */}
                <header className="mb-8 border-b border-gray-800 pb-6">
                    <span className="text-xs font-bold text-soul-gold uppercase tracking-widest">
                        {currentLesson.phase} · {currentLesson.semantic_field}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">
                        {currentLesson.title}
                    </h1>
                    <p className="text-gray-400 italic">
                        "{currentLesson.concept.description}"
                    </p>
                    <VoiceSelector /> {/* <-- AQUI */}
                </header>

                {/* O Frame Visual */}
                <section className="bg-soul-gray border-2 border-soul-gold/50 rounded-xl p-6 mb-8 text-center">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                        O Esqueleto (Core Frame)
                    </h2>
                    <div className="text-2xl md:text-3xl font-mono font-bold text-soul-gold tracking-wide">
                        {currentLesson.concept.core_frame}
                    </div>
                </section>

                {/* Vocabulário Rápido */}
                {currentLesson.vocabulary.verbs.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4">Verbos da Lição</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentLesson.vocabulary.verbs.map((verb, idx) => (
                                <div key={idx} className="bg-soul-gray p-4 rounded-lg border border-gray-800">
                                    <div className="text-soul-gold font-bold text-lg">{verb.base}</div>
                                    <div className="text-gray-500 text-sm">Passado: {verb.past}</div>
                                    <div className="text-gray-400 text-xs mt-2">
                                        Combina com: {verb.valid_objects.join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* O Player de Áudio em 4 Camadas */}
                <AudioPlayer lesson={currentLesson} />

            </div>
        </div>
    );
}