import { useState, useCallback, useRef } from 'react';
import {
  callClaude,
  buildSummaryPrompt,
  buildTheoryPrompt,
  buildFindingsPrompt,
  buildQuizPrompt,
  parseQuizResponse
} from '../services/api.js';

export default function usePaperContent(generatedContent, setGeneratedContent) {
  const [generating, setGenerating] = useState({});
  const activeRequests = useRef({});

  const isGenerating = Object.values(generating).some(Boolean);
  const isGeneratingType = (type) => !!generating[type];

  const generateContent = useCallback(async (paper, contentType, append = false) => {
    // Prevent duplicate requests for same paper+type
    const key = `${paper.id}:${contentType}`;
    if (activeRequests.current[key]) return;
    activeRequests.current[key] = true;

    setGenerating(prev => ({ ...prev, [contentType]: true }));

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
      setGenerating(prev => ({ ...prev, [contentType]: false }));
      delete activeRequests.current[key];
    }
  }, [generatedContent, setGeneratedContent]);

  /**
   * Pre-load Summary, Theory, and Findings in parallel.
   * Skips any that are already cached.
   */
  const prefetchStudyTabs = useCallback((paper) => {
    const cached = generatedContent[paper.id] || {};
    const toFetch = ['summary', 'theory', 'findings'].filter(type => !cached[type]);
    toFetch.forEach(type => generateContent(paper, type));
  }, [generatedContent, generateContent]);

  return { isGenerating, isGeneratingType, generateContent, prefetchStudyTabs };
}
