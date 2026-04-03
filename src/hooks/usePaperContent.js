import { useState, useCallback } from 'react';
import {
  callClaude,
  buildSummaryPrompt,
  buildTheoryPrompt,
  buildFindingsPrompt,
  buildQuizPrompt,
  parseQuizResponse
} from '../services/api.js';

export default function usePaperContent(generatedContent, setGeneratedContent) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = useCallback(async (paper, contentType, append = false) => {
    setIsGenerating(true);

    const existingContent = generatedContent[paper.id]?.[contentType];

    const promptBuilders = {
      summary: () => buildSummaryPrompt(paper),
      theory: () => buildTheoryPrompt(paper, append ? existingContent : null),
      findings: () => buildFindingsPrompt(paper, append ? existingContent : null),
      quiz: () => buildQuizPrompt(paper, append ? existingContent?.questions : null)
    };

    try {
      const prompt = promptBuilders[contentType]();
      const text = await callClaude(prompt);

      let content;
      if (contentType === 'quiz') {
        try {
          content = parseQuizResponse(text, append ? existingContent?.questions : null);
        } catch (e) {
          console.error('Quiz parse error:', e);
          content = existingContent || { questions: [] };
        }
      } else if (append && existingContent) {
        content = existingContent + '\n\n' + text;
      } else {
        content = text;
      }

      setGeneratedContent(prev => ({
        ...prev,
        [paper.id]: { ...prev[paper.id], [contentType]: content }
      }));
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generatedContent, setGeneratedContent]);

  return { isGenerating, generateContent };
}
