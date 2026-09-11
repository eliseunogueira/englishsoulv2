// src/components/SkillDiagnostic.tsx
import { useAppStore } from '../store/useAppStore';

export function SkillDiagnostic() {
    const skillProgress = useAppStore((state) => state.skillProgress);

    // Calcular accuracy por skill
    const skillsWithAccuracy = Object.values(skillProgress)
        .filter(s => s.attempts >= 2) // Só mostrar skills com pelo menos 2 tentativas (evita ruído)
        .map(s => ({
            ...s,
            accuracy: Math.round((s.correct / s.attempts) * 100)
        }))
        .sort((a, b) => a.accuracy - b.accuracy); // Ordenar do pior para o melhor

    const weakSkills = skillsWithAccuracy.filter(s => s.accuracy < 80);
    const strongSkills = skillsWithAccuracy.filter(s => s.accuracy >= 80);

    if (skillsWithAccuracy.length === 0) {
        return (
            <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mb-8 text-center">
                <p className="text-gray-400 italic">
                    Complete alguns exercícios para ver seu diagnóstico de habilidades.
                </p>
            </div>
        );
    }

    const skillLabels: Record<string, string> = {
        // Lição 1 & Gerais
        'third_person': 'Terceira Pessoa (+S)',
        'present_simple_syntax': 'Estrutura Presente Simples',

        // Lição 2 & 4 (Modais)
        'modal_invariance': 'Modais Invariáveis (CAN/SHOULD)',
        'modal_syntax': 'Sintaxe de Modais',

        // Lição 3 (WH-Questions)
        'wh_question_syntax': 'Estrutura de WH-Questions',
        'wh_question_reorder': 'Reordenação WH-Questions',
        'listening_wh_question': 'Listening WH-Questions',

        // Lição 5 (There is/are)
        'there_be_agreement': 'Concordância There is/are',
        'there_be_syntax': 'Sintaxe There is/are',

        // Lição 7 (Infinitivo)
        'infinitive_conjugation': 'Conjugação com Infinitivo',
        'infinitive_syntax': 'Sintaxe de Infinitivo',

        // Lição 8 (Imperativo)
        'imperative_form': 'Forma Imperativa',
        'imperative_negative': 'Imperativo Negativo',
        'listening_imperative': 'Listening Imperativo',

        // Lição 13 (TO BE)
        'to_be_frequency_syntax': 'TO BE + Frequência',
        'to_be_negative_syntax': 'TO BE Negativo',
        'listening_to_be_frequency': 'Listening TO BE + Freq.',
        'listening_to_be_comprehension': 'Comp. Auditiva TO BE',

        // Lição 17 (Passado)
        'past_negative': 'Passado Negativo (DIDN\'T)',
        'past_syntax': 'Sintaxe Passado Simples',
        'listening_past': 'Listening Passado',

        // Lição 21 (Futuro)
        'future_invariant': 'Futuro com WILL',
        'future_syntax': 'Sintaxe Futuro',

        // Lição 26 (Continuous/Perfect)
        'present_continuous': 'Presente Contínuo (-ING)',
        'present_perfect': 'Present Perfect',

        // Gerais / Listening
        'listening_comprehension': 'Compreensão Auditiva',
        'listening_syntax': 'Sintaxe (Listening)',
        'syntax': 'Sintaxe Geral',
    };

    const getLabel = (skill: string) => skillLabels[skill] || skill.replace(/_/g, ' ');

    return (
        <div className="bg-soul-gray border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-soul-gold mb-6 flex items-center gap-2">
                🔍 Diagnóstico de Habilidades
            </h2>

            {/* Skills Fracas */}
            {weakSkills.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">
                        ⚠️ Habilidades que Precisam de Atenção
                    </h3>
                    <div className="space-y-3">
                        {weakSkills.map(skill => (
                            <div key={skill.skill} className="bg-soul-dark border border-red-500/30 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium">{getLabel(skill.skill)}</span>
                                    <span className="text-red-400 font-bold">{skill.accuracy}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                    <div
                                        className="h-2 rounded-full bg-red-500 transition-all duration-500"
                                        style={{ width: `${skill.accuracy}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {skill.correct}/{skill.attempts} acertos • Última prática: {new Date(skill.lastAttempt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills Fortes */}
            {strongSkills.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">
                        ✅ Habilidades Dominadas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {strongSkills.map(skill => (
                            <div key={skill.skill} className="bg-soul-dark border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                                <span className="text-gray-300 text-sm">{getLabel(skill.skill)}</span>
                                <span className="text-green-400 font-bold text-sm">{skill.accuracy}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mensagem motivacional baseada no diagnóstico */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-gray-400 text-sm italic">
                    {weakSkills.length === 0
                        ? "🎉 Excelente! Todas as suas habilidades estão acima de 80%. Continue assim!"
                        : `Foque em praticar ${weakSkills.length} habilidade${weakSkills.length > 1 ? 's' : ''} no Modo Revisão.`}
                </p>
            </div>
        </div>
    );
}