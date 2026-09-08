// src/pages/LessonViewPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { AudioPlayer } from '../components/AudioPlayer';
import { FrameVisualizer } from '../components/FrameVisualizer';
import { VoiceSelector } from '../components/VoiceSelector';
import { ExerciseEngine } from '../components/ExerciseEngine';

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
            <div className="max-w-4xl mx-auto">
                {/* Header com Botão Voltar e Seletor de Voz */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-gray-400 hover:text-soul-gold transition-colors flex items-center gap-2"
                >
                    ← Voltar para as Lições
                </button>

                <header className="mb-8 border-b border-gray-800 pb-6 flex justify-between items-start">
                    <div>
            <span className="text-xs font-bold text-soul-gold uppercase tracking-widest">
              {currentLesson.phase} · {currentLesson.semantic_field}
            </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-2">
                            {currentLesson.title}
                        </h1>
                        <p className="text-gray-400 italic text-lg">
                            "{currentLesson.description}"
                        </p>
                    </div>
                    <VoiceSelector />
                </header>

                {/* A Nova Visualização do Frame (Frame Recipe) */}
                <section className="bg-soul-gray border-2 border-soul-gold/50 rounded-xl p-6 mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">
                        A Receita do Frame (Slots Disponíveis)
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {currentLesson.frame_recipe.map((slot) => (
                            <div
                                key={slot.id}
                                className="bg-soul-dark border border-gray-700 rounded-lg px-4 py-2 flex flex-col items-center"
                            >
                                <span className="text-soul-gold font-bold text-sm">{slot.label}</span>
                                {slot.isOptional && (
                                    <span className="text-[10px] text-gray-500 mt-1">opcional</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* O Inventário de Peças (Antigo Vocabulário) */}
                <section className="mb-8 space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">
                        Inventário de Peças desta Lição
                    </h2>

                    {/* Verbos */}
                    {currentLesson.inventory.verbs.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Verbos Principais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {currentLesson.inventory.verbs.map((verb, idx) => (
                                    <div key={idx} className="bg-soul-gray p-4 rounded-lg border border-gray-800">
                                        <div className="text-soul-gold font-bold text-lg">{verb.base}</div>
                                        {verb.past && <div className="text-gray-500 text-xs">Passado: {verb.past}</div>}
                                        <div className="text-gray-400 text-xs mt-2">
                                            Aceita: {verb.valid_complement_types.join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Auxiliares */}
                    {currentLesson.inventory.auxiliaries.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Auxiliares</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentLesson.inventory.auxiliaries.map((aux, idx) => (
                                    <span key={idx} className="bg-purple-900/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-md text-sm font-bold">
                    {aux}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Modificadores */}
                    {currentLesson.inventory.modifiers.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Modificadores (Tempo, Frequência, Maneira)</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentLesson.inventory.modifiers.map((mod, idx) => (
                                    <span key={idx} className="bg-blue-900/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-md text-sm">
                    {mod}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Componentes Interativos */}
                <FrameVisualizer lesson={currentLesson} />
                <AudioPlayer lesson={currentLesson} />
                {/* Motor de Exercícios */}
                {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                    <ExerciseEngine lesson={currentLesson} />
                )}

            </div>
        </div>
    );
}