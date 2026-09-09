// src/utils/grammarEngine.ts

export class GrammarEngine {

    // Dicionário de verbos irregulares e exceções do TO BE / HAVE / DO
    private static irregulars: Record<string, Record<string, string>> = {
        'be': { 'i': 'am', 'he': 'is', 'she': 'is', 'it': 'is', 'we': 'are', 'you': 'are', 'they': 'are' },
        'have': { 'he': 'has', 'she': 'has', 'it': 'has' },
        'do': { 'he': 'does', 'she': 'does', 'it': 'does' },
        'speak': { 'past': 'spoke' },
        'eat': { 'past': 'ate' },
        'drink': { 'past': 'drank' }
    };

    /**
     * Conjugação Pura e Determinística (Sem bibliotecas externas)
     */
    public static conjugate(verb: string, tense: 'present' | 'past' | 'future', subject?: string): string {
        const subj = (subject || 'he').toLowerCase();
        const isThirdPerson = ['he', 'she', 'it'].includes(subj);

        // Se não for 3ª pessoa do singular, o verbo no presente fica na base
        if (tense === 'present' && !isThirdPerson) {
            return verb;
        }

        //se esta no passado
        if (tense === 'past') {
            // Verifica irregulares
            if (this.irregulars[verb]?.past) {
                return this.irregulars[verb].past;
            }
            // Regulares: adiciona "ed"
            if (verb.endsWith('e')) return verb + 'd';
            if (verb.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(verb[verb.length - 2])) {
                return verb.slice(0, -1) + 'ied';
            }
            return verb + 'ed';
        }

        // 1. Verifica irregulares (TO BE, HAVE, DO)
        if (this.irregulars[verb] && this.irregulars[verb][subj]) {
            return this.irregulars[verb][subj];
        }

        // Se for passado ou futuro, por enquanto retornamos o base (vamos expandir depois)
        if (tense !== 'present') return verb;

        // 2. Regras Regulares da 3ª Pessoa (He/She/It)
        // Termina em 'y' precedido de consoante -> tira o 'y' e põe 'ies' (carry -> carries)
        if (verb.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(verb[verb.length - 2])) {
            return verb.slice(0, -1) + 'ies';
        }

        // Termina em s, x, z, ch, sh, o -> adiciona 'es' (watch -> watches, go -> goes)
        if (verb.endsWith('s') || verb.endsWith('x') || verb.endsWith('z') ||
            verb.endsWith('ch') || verb.endsWith('sh') || verb.endsWith('o')) {
            return verb + 'es';
        }

        // Regra padrão -> adiciona 's' (drink -> drinks, speak -> speaks)
        return verb + 's';
    }

    // src/utils/grammarEngine.ts

    public static validateAgreement(subject: string, word: string): { isValid: boolean; suggestion?: string } {
        const subj = subject.toLowerCase();
        const aux = word.toLowerCase();

        // ==========================================
        // 1. VERBO TO BE - AFIRMATIVAS (am, is, are)
        // ==========================================
        if (aux === 'is') {
            if (subj === 'i') return { isValid: false, suggestion: 'am' };
            if (['you', 'we', 'they'].includes(subj)) return { isValid: false, suggestion: 'are' };
        }
        if (aux === 'are') {
            if (subj === 'i') return { isValid: false, suggestion: 'am' };
            if (['he', 'she', 'it'].includes(subj)) return { isValid: false, suggestion: 'is' };
        }
        if (aux === 'am') {
            if (subj !== 'i') {
                const suggestion = ['he', 'she', 'it'].includes(subj) ? 'is' : 'are';
                return { isValid: false, suggestion };
            }
        }

        // ==========================================
        // 2. VERBO TO BE - NEGATIVAS (am not, isn't, aren't)
        // ==========================================
        if (aux === 'am not') {
            if (subj !== 'i') {
                const suggestion = ['he', 'she', 'it'].includes(subj) ? "isn't" : "aren't";
                return { isValid: false, suggestion };
            }
        }
        if (aux === "isn't") {
            if (subj === 'i') return { isValid: false, suggestion: "am not" };
            if (['you', 'we', 'they'].includes(subj)) return { isValid: false, suggestion: "aren't" };
        }
        if (aux === "aren't") {
            if (subj === 'i') return { isValid: false, suggestion: "am not" };
            if (['he', 'she', 'it'].includes(subj)) return { isValid: false, suggestion: "isn't" };
        }

        // ==========================================
        // 3. AUXILIARES DO / DOES (Lição 1)
        // ==========================================
        const isThirdPerson = ['he', 'she', 'it'].includes(subj);
        const isNonThirdPerson = ['i', 'you', 'we', 'they'].includes(subj);

        if (aux === 'do' || aux === 'don\'t') {
            if (isThirdPerson) return { isValid: false, suggestion: aux === 'do' ? 'does' : 'doesn\'t' };
        }
        if (aux === 'does' || aux === 'doesn\'t') {
            if (isNonThirdPerson) return { isValid: false, suggestion: aux === 'does' ? 'do' : 'don\'t' };
        }

        // ==========================================
        // 4. AUXILIARES HAVE / HAS (Lição 26) - ATUALIZADO
        // ==========================================

        // HAVE / HAVEN'T (Usado com I, You, We, They)
        if (aux === 'have' || aux === "haven't") {
            if (isThirdPerson) {
                return { isValid: false, suggestion: aux === 'have' ? 'has' : "hasn't" };
            }
        }

        // HAS / HASN'T (Usado com He, She, It)
        if (aux === 'has' || aux === "hasn't") {
            if (isNonThirdPerson) {
                return { isValid: false, suggestion: aux === 'has' ? 'have' : "haven't" };
            }
        }

        return { isValid: true };
    }



    /**
     * Gera a forma -ING (Gerúndio/Particípio Presente)
     * Aplica as regras básicas de ortografia do inglês.
     */
    public static getIngForm(verb: string): string {
        if (!verb) return verb;

        // 1. Verbos terminados em 'e' (que não seja 'ee'): tira o 'e' e põe 'ing'
        // Ex: make -> making, write -> writing, dance -> dancing
        // 🚨 EXCEÇÃO CLÁSSICA: O verbo "be" mantém o 'e' e vira "being"
        if (verb.toLowerCase() === 'be') {
            return 'being';
        }
        if (verb.endsWith('e') && !verb.endsWith('ee')) {
            return verb.slice(0, -1) + 'ing';
        }

        // 2. Regra padrão: apenas adiciona 'ing'
        // Ex: drink -> drinking, speak -> speaking, read -> reading
        return verb + 'ing';
    }


    /**
     * Prepara o texto para o TTS (Web Speech API)
     */
    public static prepareForTTS(text: string): string {
        if (!text) return "";
        let processed = text.toLowerCase();
        processed = processed.replace(/\bi\b/g, 'i');
        if (processed.startsWith('i ')) return processed;
        return processed.charAt(0).toUpperCase() + processed.slice(1);
    }
}