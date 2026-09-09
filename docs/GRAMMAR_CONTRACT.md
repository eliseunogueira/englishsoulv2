# 📜 Grammar Contract: English Soul

**Versão:** 1.0.0  
**Objetivo:** Definir o comportamento linguístico e pedagógico esperado do motor interno do English Soul, servindo como baseline para testes de regressão e futura integração com bibliotecas externas (ex: RiTa).

---

## 1. Regras de Concordância (Subject-Auxiliary Agreement)

O sistema **DEVE** bloquear e sugerir a correção para as seguintes combinações inválidas de Sujeito + Auxiliar:

| Sujeito | Auxiliar Válido | Auxiliar Inválido (Bloquear e Sugerir) |
|---------|----------------|----------------------------------------|
| **I** | am, have, do, don't, will, won't | is (→ am), are (→ am), has (→ have), does (→ do), doesn't (→ don't) |
| **You / We / They** | are, have, do, don't, will, won't | am (→ are), is (→ are), has (→ have), does (→ do), doesn't (→ don't) |
| **He / She / It** | is, has, does, doesn't, will, won't | am (→ is), are (→ is), have (→ has), do (→ does), don't (→ doesn't) |

> **Regra Pedagógica:** O verbo TO BE é independente. Ele **NUNCA** usa DO/DOES/DID como auxiliar para negação ou interrogação.

---

## 2. Regras de Transformação Morfológica

O sistema **DEVE** aplicar as seguintes transformações ao verbo principal com base no auxiliar ou tempo verbal:

### 2.1. Presente Simples (Sem auxiliar ou DO/DOES)
- **Regra Geral:** Adicionar `s` ao verbo base para He/She/It (ex: `drink` → `drinks`).
- **Exceção Ortográfica 1:** Verbos terminados em consoante + `y` → remover `y`, adicionar `ies` (ex: `carry` → `carries`).
- **Exceção Ortográfica 2:** Verbos terminados em `s`, `x`, `z`, `ch`, `sh`, `o` → adicionar `es` (ex: `watch` → `watches`, `go` → `goes`).
- **Irregulares Fixos:** `be` → `am/is/are`, `have` → `has`, `do` → `does`.

### 2.2. Presente Contínuo (Auxiliar: AM / IS / ARE)
- **Regra Geral:** Adicionar `ing` ao verbo base.
- **Exceção Ortográfica:** Verbos terminados em `e` (que não seja `ee`) → remover `e`, adicionar `ing` (ex: `make` → `making`).
- **Exceção Absoluta:** O verbo `be` → `being` (NUNCA `bing`).

### 2.3. Passado Simples e Futuro (Auxiliar: DID / DIDN'T / WILL / WON'T)
- **Regra de Ouro:** O verbo principal **DEVE** permanecer na forma **BASE**, independentemente do sujeito.
- **Exemplo:** `She` + `didn't` + `need` (NUNCA `needed`). `He` + `will` + `go` (NUNCA `goes`).

### 2.4. Presente Perfect (Auxiliar: HAVE / HAS)
- **Regra:** O verbo principal deve usar a forma de **Particípio Passado**.
- **Fonte da Verdade:** Priorizar o campo `participle` do inventário da lição (ex: `be` → `been`, `eat` → `eaten`).
- **Fallback:** Se não houver no inventário, aplicar regra de regulares (`+ed` ou `+d` se terminar em `e`).

---

## 3. Validação Semântica (Complementos)

O sistema **DEVE** validar se o complemento escolhido é semanticamente válido para o verbo selecionado, consultando o array `valid_complements` no inventário da lição.

- **Cenário de Sucesso:** Verbo `drink` + Complemento `water` → ✅ Permitido.
- **Cenário de Falha:** Verbo `drink` + Complemento `fish` → ❌ Bloqueado. Exibir mensagem: *"Ops! 'drink' geralmente combina com: water, coffee, beer."*
- **Coringa:** Se o verbo tiver `"all"` em `valid_complements`, qualquer complemento é aceito (ex: verbo `need`).

---

## 4. Contrato de Normalização de Áudio (TTS)

Antes de qualquer texto ser enviado para a `SpeechSynthesisUtterance`, ele **DEVE** passar pela função `prepareForTTS`:

1. Converter toda a string para **minúsculas** (para evitar que o TTS solestre siglas como "D-I-D", "A-M", "W-I-L-L").
2. Forçar o pronome "I" isolado a permanecer minúsculo (`i`) para evitar a leitura "Capital I".
3. Capitalizar apenas a primeira letra da frase para manter a naturalidade, **exceto** se a frase começar com "i " (para manter a regra 2).

---

## 5. Casos de Teste Executáveis (Regression Tests)

Estes são os cenários que o `GrammarEngine` e o `FrameVisualizer` devem processar corretamente. Qualquer mudança no código que faça um destes testes falhar é considerada um **bug de regressão**.

### Lição 1: Present Simple
| Input (Subject + Verb + Comp) | Expected Output (Display & Audio) | Status |
|-------------------------------|-----------------------------------|--------|
| I + drink + water | I drink water | ✅ Pass |
| He + drink + water | He **drinks** water (+s badge) | ✅ Pass |
| She + don't + eat + fish | **BLOCKED** (Suggest: doesn't) | ✅ Pass |
| They + doesn't + speak | **BLOCKED** (Suggest: don't) | ✅ Pass |

### Lição 13: TO BE + Frequency
| Input (Subject + Aux + Comp) | Expected Output (Display & Audio) | Status |
|------------------------------|-----------------------------------|--------|
| I + am + happy | I am happy | ✅ Pass |
| You + is + tired | **BLOCKED** (Suggest: are) | ✅ Pass |
| He + aren't + at home | **BLOCKED** (Suggest: isn't) | ✅ Pass |
| She + be + in love | She **is** in love | ✅ Pass |

### Lição 17: Past Simple
| Input (Subject + Aux + Verb + Comp) | Expected Output (Display & Audio) | Status |
|-------------------------------------|-----------------------------------|--------|
| I + didn't + need + to finish | I didn't **need** to finish | ✅ Pass |
| He + didn't + needed + help | **BLOCKED/CORRECTED** to: He didn't **need** help | ✅ Pass |
| They + DID + spoke + english | **BLOCKED/CORRECTED** to: They DID **speak** english | ✅ Pass |

### Lição 21: Future WILL
| Input (Subject + Aux + Verb + Comp) | Expected Output (Display & Audio) | Status |
|-------------------------------------|-----------------------------------|--------|
| She + will + pay + the bill | She will **pay** the bill | ✅ Pass |
| He + will + goes + home | **BLOCKED/CORRECTED** to: He will **go** home | ✅ Pass |
| I + won't + wear + the suit | I won't **wear** the suit | ✅ Pass |

### Lição 26: Continuous & Perfect
| Input (Subject + Aux + Verb + Comp) | Expected Output (Display & Audio) | Status |
|-------------------------------------|-----------------------------------|--------|
| I + am + read + a book | I am **reading** a book (+ing badge) | ✅ Pass |
| You + are + be + happy | You are **being** happy (+ing badge) | ✅ Pass |
| He + have + be + to Paris | **BLOCKED** (Suggest: has) | ✅ Pass |
| I + have + be + to Paris | I have **been** to Paris (pp badge) | ✅ Pass |

---

## 6. Fronteira de Responsabilidade (English Soul vs. External Library)

| Funcionalidade | Responsável Atualmente | Destino Futuro (Pós-Validação) |
|----------------|------------------------|--------------------------------|
| Subject-Auxiliary Agreement | English Soul (`GrammarEngine`) | **Manter no English Soul** (Pedagógico) |
| DID/WILL + Base Verb Rule | English Soul (`FrameVisualizer`) | **Manter no English Soul** (Pedagógico) |
| Semantic Validity (`valid_complements`) | English Soul (`Lesson Inventory`) | **Manter no English Soul** (Curadoria) |
| Regular Conjugation (`+s`, `+es`, `+ies`) | English Soul (`GrammarEngine`) | **Candidato a Delegação** (ex: RiTa) |
| Irregular Past/Participle Lookup | English Soul (`Lesson Inventory`) | **Candidato a Delegação** (ex: RiTa) |
| TTS Normalization (lowercase, "i") | English Soul (`GrammarEngine`) | **Manter no English Soul** (UX específica) |
| Phonemes / Word Stress | Não implementado | **Delegar** (ex: RiTa `getPhonemes`) |