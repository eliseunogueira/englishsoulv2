// src/utils/audio.ts

export class EnglishSoulAudio {
    private synth: SpeechSynthesis;
    private selectedVoiceURI: string | null = null;

    constructor() {
        this.synth = window.speechSynthesis;
        // Garante que as vozes sejam carregadas (especialmente no Chrome)
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => {};
        }
    }

    // Novo método: Definir a voz com base na URI salva pelo usuário
    public setVoice(voiceURI: string | null) {
        this.selectedVoiceURI = voiceURI;
    }

    // Novo método: Obter todas as vozes em inglês agrupadas por sotaque
    public getEnglishVoices() {
        const voices = this.synth.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));

        // Agrupar por região para facilitar a UI
        return {
            us: englishVoices.filter(v => v.lang === 'en-US'),
            gb: englishVoices.filter(v => v.lang === 'en-GB'),
            au: englishVoices.filter(v => v.lang === 'en-AU'),
            other: englishVoices.filter(v => !['en-US', 'en-GB', 'en-AU'].includes(v.lang))
        };
    }

    private getActiveVoice(): SpeechSynthesisVoice | null {
        const voices = this.synth.getVoices();
        if (this.selectedVoiceURI) {
            const voice = voices.find(v => v.voiceURI === this.selectedVoiceURI);
            if (voice) return voice;
        }
        // Fallback inteligente: Tenta US, depois GB, depois qualquer uma em inglês
        return voices.find(v => v.lang === 'en-US') ||
            voices.find(v => v.lang.startsWith('en')) ||
            null;
    }

    private speakPromise(text: string, rate: number = 1.0): Promise<void> {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            const voice = this.getActiveVoice();
            if (voice) utterance.voice = voice;

            utterance.lang = voice?.lang || 'en-US';
            utterance.rate = rate;

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();

            this.synth.speak(utterance);
        });
    }

    public speak(text: string, rate: number = 1.0) {
        this.synth.cancel();
        this.speakPromise(text, rate);
    }

    public playWord(word: string) { this.speak(word, 0.7); }
    public playChunk(chunk: string) { this.speak(chunk, 0.9); }
    public playSentence(sentence: string) { this.speak(sentence, 1.0); }

    public async playContext(sentences: string[]) {
        this.synth.cancel();
        for (const sentence of sentences) {
            await this.speakPromise(sentence, 1.0);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
}

export const audioEngine = new EnglishSoulAudio();