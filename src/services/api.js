const API_URL = '/api/anthropic/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export async function callClaude(prompt, maxTokens = 2500) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
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

export function parseQuizResponse(text, existingQuestions) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return existingQuestions ? { questions: existingQuestions } : { questions: [] };

  const newQuiz = JSON.parse(jsonMatch[0]);
  if (existingQuestions?.length) {
    return { questions: [...existingQuestions, ...newQuiz.questions] };
  }
  return newQuiz;
}
