const API_URL = '/api/anthropic/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

const LANGUAGE_NAMES = { en: 'English', zh: 'Chinese (Simplified)' };

/**
 * Returns an instruction to append to prompts when the user's language isn't English.
 * For JSON prompts, asks Claude to keep JSON keys in English but translate values.
 */
export function getLanguageInstruction(isJsonResponse = false) {
  const lang = localStorage.getItem('language') || 'en';
  if (lang === 'en') return '';
  const langName = LANGUAGE_NAMES[lang] || lang;
  if (isJsonResponse) {
    return `\n\nIMPORTANT: Keep all JSON keys in English, but write all text values (explanations, descriptions, claims, etc.) in ${langName}.`;
  }
  return `\n\nIMPORTANT: Write your entire response in ${langName}.`;
}

export async function callClaude(prompt, maxTokens = 2500, { jsonResponse = false } = {}) {
  // Append language instruction if user isn't using English
  const langInstruction = getLanguageInstruction(jsonResponse);
  const fullPrompt = prompt + langInstruction;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: fullPrompt }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

export function buildSummaryPrompt(paper) {
  return `You are an expert ML researcher. Create an executive summary for this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Provide a concise executive summary (300-400 words) that covers:
1. The core problem being solved
2. The key innovation or contribution
3. Why this paper matters in the field
4. Main takeaways for practitioners

Format as clean prose paragraphs. Be technical but accessible.`;
}

export function buildTheoryPrompt(paper, existingContent) {
  if (existingContent) {
    return `You are an expert ML researcher. Continue the theoretical deep dive for this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Previous content already covered:
${existingContent}

Now provide ADDITIONAL theoretical content (400-500 words) covering NEW aspects not yet discussed:
- Additional mathematical formulations or derivations
- Deeper analysis of specific components
- Connections to other theoretical frameworks
- Advanced topics or edge cases

Do NOT repeat what was already covered. Start with new material directly.`;
  }

  return `You are an expert ML researcher. Create a deep dive into the theoretical and mathematical foundations of this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Provide a detailed explanation (500-700 words) covering:
1. Mathematical formulations and key equations (use LaTeX notation like $equation$)
2. Theoretical foundations and assumptions
3. How this builds on or differs from prior work
4. Intuitive explanations of complex concepts

Focus on the "why" behind the math, not just the "what". Make it accessible but rigorous.`;
}

export function buildFindingsPrompt(paper, existingContent) {
  if (existingContent) {
    return `You are an expert ML researcher. Continue discussing significant findings from this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Previous findings already covered:
${existingContent}

Now provide ADDITIONAL significant findings (300-400 words) not yet discussed:
- Additional experimental insights
- Secondary results or ablations
- Broader implications
- Connections to subsequent work

Do NOT repeat what was already covered. Start with new material directly.`;
  }

  return `You are an expert ML researcher. Summarize the most significant and novel findings from this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Provide a focused summary (300-400 words) of:
1. Key experimental results that were surprising or impactful
2. Novel discoveries or insights
3. Limitations acknowledged by the authors
4. Impact on subsequent research

Skip routine experimental setup. Focus only on what's genuinely new or important.`;
}

export function buildQuizPrompt(paper, existingQuestions) {
  if (existingQuestions?.length) {
    return `You are an expert ML educator. Create ADDITIONAL quiz questions for this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Existing questions already created: ${existingQuestions.length} questions

Create 5 NEW questions that test DIFFERENT concepts in this JSON format:
{
  "questions": [
    {
      "id": ${existingQuestions.length + 1},
      "type": "multiple_choice",
      "question": "Question text here?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Brief explanation"
    }
  ]
}

Include a mix of 3 multiple choice, 1 true/false, 1 fill blank. Return ONLY valid JSON.`;
  }

  return `You are an expert ML educator. Create a comprehensive quiz testing understanding of this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Create exactly 10 questions in this JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text here?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Brief explanation of correct answer"
    },
    {
      "id": 2,
      "type": "true_false",
      "question": "Statement to evaluate",
      "correct": true,
      "explanation": "Why this is true/false"
    },
    {
      "id": 3,
      "type": "fill_blank",
      "question": "The _____ mechanism allows the model to...",
      "correct": "attention",
      "explanation": "Explanation"
    }
  ]
}

Include a mix:
- 5 multiple choice (testing concepts, not memorization)
- 3 true/false (common misconceptions)
- 2 fill in the blank (key terminology)

Questions should test understanding, not trivia. Return ONLY valid JSON.`;
}

export function buildChatPrompt(paper, generatedContext, question) {
  const ctx = generatedContext || {};
  const fullContext = `
Paper Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

${ctx.summary ? `Executive Summary:\n${ctx.summary}` : ''}

${ctx.theory ? `Theoretical Foundations:\n${ctx.theory}` : ''}

${ctx.findings ? `Key Findings:\n${ctx.findings}` : ''}
`.trim();

  return `You are an expert ML researcher helping someone understand this paper. Answer their question using ONLY information from the paper context provided below.

PAPER CONTEXT:
${fullContext}

USER QUESTION: ${question}

CRITICAL: You must cite specific sentences from the context. Format your response as follows:
1. Provide your answer with inline citations using [Citation X] markers
2. At the end, list all citations in this exact format:

CITATIONS:
[Citation 1]: "exact quoted sentence from the context"
[Citation 2]: "exact quoted sentence from the context"

If the question cannot be answered from the provided context, say so clearly. Be precise and cite specific sentences.`;
}

// --- Phase 3: Deep Study Features ---

export function buildDnaPrompt(paper) {
  return `You are an expert researcher. Extract a structured "Paper DNA" fingerprint for this paper.

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Return a JSON object with these fields:
{
  "concepts": ["key concept 1", "key concept 2", ...],
  "methods": ["method or technique 1", "method 2", ...],
  "datasets": ["dataset 1", "dataset 2", ...],
  "metrics": ["metric: value", ...],
  "prerequisites": ["concept you should know before reading", ...],
  "contributions": ["what this paper introduces that is new", ...],
  "limitations": ["acknowledged limitation 1", ...],
  "applications": ["practical application or use case", ...]
}

Be specific and concise — each item should be 2-8 words. Include 3-8 items per field. Leave empty arrays [] for fields with no relevant content. Return ONLY valid JSON.`;
}

export function buildFeynmanPrompt(paper, concept, userExplanation) {
  return `You are a patient, rigorous ML educator using the Feynman technique. A student just tried to explain a concept from this paper in their own words. Evaluate their explanation.

Paper: "${paper.title}" by ${paper.authors} (${paper.year})
Abstract: ${paper.abstract}

Concept they were asked to explain: "${concept}"

Student's explanation:
"${userExplanation}"

Evaluate on three axes and provide specific, constructive feedback:

1. **Accuracy** — Did they get anything factually wrong? Be specific about what's incorrect.
2. **Completeness** — What key aspects did they miss? What would make their explanation more complete?
3. **Clarity** — Would a smart non-expert understand this? What could be clearer?

Then provide:
4. **Rating** — One of: "excellent", "good", "needs_work", "incorrect"
5. **Improved explanation** — A concise, correct version in 2-3 sentences.

Format as JSON:
{
  "accuracy": "feedback text",
  "completeness": "feedback text",
  "clarity": "feedback text",
  "rating": "excellent|good|needs_work|incorrect",
  "improved": "the correct concise explanation"
}

Be encouraging but honest. Point out specific gaps, don't just say "good job." Return ONLY valid JSON.`;
}

export function buildClaimsPrompt(paper) {
  return `You are an expert critical reader. Extract and classify every significant claim from this paper.

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

For each claim, classify its evidence strength:
- "empirical": Directly demonstrated with experiments/data in this paper
- "cited": Supported by citing prior work
- "assumed": Stated without evidence or citation
- "speculative": Future work, hypothesis, or conjecture

Return JSON:
{
  "claims": [
    {
      "claim": "concise statement of the claim",
      "evidence": "empirical|cited|assumed|speculative",
      "context": "which section/aspect of the paper this relates to",
      "note": "brief note on the supporting evidence or why it's classified this way"
    }
  ]
}

Extract 8-15 significant claims. Focus on the paper's core arguments, not trivial statements like "we use Python." Return ONLY valid JSON.`;
}

export function buildAblationPrompt(paper, customQuestion) {
  if (customQuestion) {
    return `You are an expert ML researcher analyzing design decisions in this paper.

Paper: "${paper.title}" by ${paper.authors} (${paper.year})
Abstract: ${paper.abstract}

The user asks this "what if?" question:
"${customQuestion}"

Provide a thorough analysis:
1. **Likely effect** — What would probably happen?
2. **Trade-offs** — What would be gained vs. lost?
3. **Prior work** — Has anyone tried this? What happened?
4. **Deeper reason** — Why did the authors make their original choice?

Be specific and cite relevant work where possible. Keep it to 200-300 words.`;
  }

  return `You are an expert ML researcher. Identify the key design decisions in this paper and generate counterfactual analyses.

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Return JSON with the paper's key decisions and what-if analyses:
{
  "decisions": [
    {
      "decision": "concise description of the design choice",
      "category": "architecture|loss_function|training|data|evaluation",
      "what_if": "what would likely happen with a different choice",
      "why_chosen": "why the authors made this specific choice",
      "alternatives_tried": "whether anyone has tried alternatives (be specific)"
    }
  ]
}

Identify 5-8 key decisions. Focus on choices that materially affect the paper's results, not trivial implementation details. Return ONLY valid JSON.`;
}

export function buildComparisonPrompt(paperA, paperB) {
  return `You are an expert ML researcher. Compare these two papers side by side.

Paper A: "${paperA.title}" by ${paperA.authors} (${paperA.year})
Abstract: ${paperA.abstract}

Paper B: "${paperB.title}" by ${paperB.authors} (${paperB.year})
Abstract: ${paperB.abstract}

Provide a structured comparison in JSON:
{
  "shared_concepts": ["concepts both papers address"],
  "approach_differences": [
    {"aspect": "aspect name", "paper_a": "A's approach", "paper_b": "B's approach"}
  ],
  "performance_comparison": "which performs better and on what (if comparable)",
  "historical_context": "how these papers relate chronologically and intellectually",
  "when_to_use": {"paper_a": "when you'd prefer A's approach", "paper_b": "when you'd prefer B's approach"},
  "synthesis": "what you learn by reading both that you wouldn't from either alone"
}

Return ONLY valid JSON.`;
}

export function parseQuizResponse(text, existingQuestions) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return existingQuestions ? { questions: existingQuestions } : { questions: [] };

  const newQuiz = JSON.parse(jsonMatch[0]);
  if (existingQuestions?.length) {
    return { questions: [...existingQuestions, ...newQuiz.questions] };
  }
  return newQuiz;
}
