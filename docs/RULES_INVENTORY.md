# Inventário de Regras do English Soul

## Regras Morfológicas (Conjugação/Transformação)

| Regra | Implementação Atual | Deve ir para RiTa? | Justificativa |
|-------|---------------------|-------------------|---------------|
| He/She/It + verb → +s | GrammarEngine.conjugate() | ✅ Sim | Regra universal do inglês |
| Verbos terminados em 'y' → ies | GrammarEngine.conjugate() | ✅ Sim | Regra ortográfica padrão |
| Verbos terminados em s/x/z/ch/sh/o → es | GrammarEngine.conjugate() | ✅ Sim | Regra ortográfica padrão |
| be → am/is/are | GrammarEngine.irregulars | ❌ Não | TO BE é patrimônio pedagógico do método |
| have → has | GrammarEngine.irregulars | ❌ Não | Concordância específica do English Soul |
| do → does | GrammarEngine.irregulars | ❌ Não | Concordância específica do English Soul |
| be → being | GrammarEngine.getIngForm() | ✅ Sim | Regra morfológica padrão |
| make → making (tira o 'e') | GrammarEngine.getIngForm() | ✅ Sim | Regra ortográfica padrão |
| be → been (particípio) | lesson.inventory.verbs[].participle | ❌ Não | Dado curado manualmente |
| eat → ate (passado irregular) | Não implementado ainda | ✅ Sim | RiTa tem dicionário completo |
| go → went (passado irregular) | Não implementado ainda | ✅ Sim | RiTa tem dicionário completo |

## Regras de Concordância (Agreement)

| Regra | Implementação Atual | Deve ir para RiTa? | Justificativa |
|-------|---------------------|-------------------|---------------|
| I → am, He → is, They → are | GrammarEngine.validateAgreement() | ❌ Não | TO BE é central na pedagogia |
| I/You/We/They → have, He/She/It → has | GrammarEngine.validateAgreement() | ❌ Não | Present Perfect é patrimônio do método |
| I/You/We/They → do, He/She/It → does | GrammarEngine.validateAgreement() | ❌ Não | DO/DOES é patrimônio do método |
| DID + verbo base | FrameVisualizer (lógica inline) | ❌ Não | Transformação estrutural do método |
| WILL + verbo base | FrameVisualizer (lógica inline) | ❌ Não | Invariância é patrimônio do método |

## Regras Semânticas (Validação de Complementos)

| Regra | Implementação Atual | Deve ir para RiTa? | Justificativa |
|-------|---------------------|-------------------|---------------|
| drink → water/coffee/beer | lesson.inventory.verbs[].valid_complements | ❌ Não | Curadoria pedagógica do English Soul |
| eat → fish/meat | lesson.inventory.verbs[].valid_complements | ❌ Não | Curadoria pedagógica do English Soul |
| speak → english/portuguese | lesson.inventory.verbs[].valid_complements | ❌ Não | Curadoria pedagógica do English Soul |

## Regras de Áudio/TTS

| Regra | Implementação Atual | Deve ir para RiTa? | Justificativa |
|-------|---------------------|-------------------|---------------|
| "I" → "i" (evitar "Capital I") | GrammarEngine.prepareForTTS() | ✅ Sim | Normalização de texto |
| "DID" → "did" (evitar soletração) | GrammarEngine.prepareForTTS() | ✅ Sim | Normalização de texto |
| Phonemes (IPA) | Não implementado | ✅ Sim | RiTa tem getPhonemes() |
| Word Stress | Não implementado | ✅ Sim | RiTa tem getStresses() |