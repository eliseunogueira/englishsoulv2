// src/components/VoiceSelector.tsx
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { audioEngine } from '../utils/audio';

export function VoiceSelector() {
    const { preferredVoiceURI, setPreferredVoice } = useAppStore();
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const allVoices = window.speechSynthesis.getVoices();
        const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
        setVoices(englishVoices);

        audioEngine.setVoice(preferredVoiceURI);
    }, [preferredVoiceURI]);

    const currentVoice = voices.find(v => v.voiceURI === preferredVoiceURI);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-soul-gray border border-gray-700 hover:border-soul-gold text-gray-300 px-4 py-2 rounded-lg transition-all text-sm"
            >
                🎙️ {currentVoice ? currentVoice.name : 'Voz Padrão do Sistema'}
                <span className="text-xs text-gray-500">▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-soul-gray border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    <div
                        className={`p-3 cursor-pointer hover:bg-gray-800 text-sm ${!preferredVoiceURI ? 'text-soul-gold font-bold' : 'text-gray-300'}`}
                        onClick={() => {
                            setPreferredVoice(null);
                            setIsOpen(false);
                        }}
                    >
                        Padrão do Sistema (Recomendado)
                    </div>

                    <div className="border-t border-gray-700 p-2 text-xs font-bold text-gray-500 uppercase">🇸 American English</div>
                    {voices.filter(v => v.lang === 'en-US').map(voice => (
                        <div
                            key={voice.voiceURI}
                            className={`p-3 cursor-pointer hover:bg-gray-800 text-sm truncate ${preferredVoiceURI === voice.voiceURI ? 'text-soul-gold font-bold' : 'text-gray-300'}`}
                            onClick={() => {
                                setPreferredVoice(voice.voiceURI);
                                setIsOpen(false);
                                audioEngine.playWord("Hello");
                            }}
                        >
                            {voice.name}
                        </div>
                    ))}

                    <div className="border-t border-gray-700 p-2 text-xs font-bold text-gray-500 uppercase">🇬🇧 British English</div>
                    {voices.filter(v => v.lang === 'en-GB').map(voice => (
                        <div
                            key={voice.voiceURI}
                            className={`p-3 cursor-pointer hover:bg-gray-800 text-sm truncate ${preferredVoiceURI === voice.voiceURI ? 'text-soul-gold font-bold' : 'text-gray-300'}`}
                            onClick={() => {
                                setPreferredVoice(voice.voiceURI);
                                setIsOpen(false);
                                audioEngine.playWord("Hello");
                            }}
                        >
                            {voice.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}