// src/utils/grammarEngine.ts
export class GrammarEngine {

    /**
     * Conjugação Regular (apenas fallback).
     * A prioridade é sempre o verbObj do inventário.
     */
    public static conjugateRegular(verb: string, subject?: string): string {
        const subj = (subject || 'he').toLowerCase();
        if (!['he', 'she', 'it'].includes(subj)) return verb;

        if (verb.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(verb[verb.length - 2])) {
            return verb.slice(0, -1) + 'ies';
        }
        if (verb.endsWith('s') || verb.endsWith('x') || verb.endsWith('z') ||
            verb.endsWith('ch') || verb.endsWith('sh') || verb.endsWith('o')) {
            return verb + 'es';
        }
        return verb + 's';
    }

    public static getIngForm(verb: string): string {
        if (!verb) return verb;
        if (verb.toLowerCase() === 'be') return 'being';
        if (verb.endsWith('e') && !verb.endsWith('ee')) return verb.slice(0, -1) + 'ing';
        return verb + 'ing';
    }

    public static validateAgreement(subject: string, word: string): { isValid: boolean; suggestion?: string } {
        // ... (mantenha a matriz de concordância completa que já fizemos, ela está perfeita) ...
        const subj = subject.toLowerCase();
        const aux = word.toLowerCase();

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

        const isThirdPerson = ['he', 'she', 'it'].includes(subj);
        const isNonThirdPerson = ['i', 'you', 'we', 'they'].includes(subj);

        if (aux === 'do' || aux === 'don\'t') {
            if (isThirdPerson) return { isValid: false, suggestion: aux === 'do' ? 'does' : 'doesn\'t' };
        }
        if (aux === 'does' || aux === 'doesn\'t') {
            if (isNonThirdPerson) return { isValid: false, suggestion: aux === 'does' ? 'do' : 'don\'t' };
        }

        if (aux === 'has' || aux === "hasn't") {
            if (isNonThirdPerson) return { isValid: false, suggestion: aux === 'has' ? 'have' : "haven't" };
        }
        if (aux === 'have' || aux === "haven't") {
            if (isThirdPerson) return { isValid: false, suggestion: aux === 'have' ? 'has' : "hasn't" };
        }

        return { isValid: true };
    }

    public static prepareForTTS(text: string): string {
        if (!text) return "";
        let processed = text.toLowerCase();
        processed = processed.replace(/\bi\b/g, 'i');
        if (processed.startsWith('i ')) return processed;
        return processed.charAt(0).toUpperCase() + processed.slice(1);
    }
    /**
     * Detecta se um complemento é singular ou plural baseado em heurísticas.
     * Usado como fallback quando complement_number não está definido.
     */
    public static detectNumber(complement: string): 'singular' | 'plural' {
        const lower = complement.toLowerCase();

        // Plural indicators
        if (lower.match(/\b(two|three|four|five|many|several|a lot of|some|few)\b/)) {
            return 'plural';
        }

        // Singular indicators
        if (lower.match(/\b(a|an|one|the)\b/)) {
            return 'singular';
        }

        // Ends with 's' (but not 'ss', 'us', 'is')
        if (lower.endsWith('s') && !lower.endsWith('ss') && !lower.endsWith('us') && !lower.endsWith('is')) {
            return 'plural';
        }

        return 'singular'; // Default
    }

}

