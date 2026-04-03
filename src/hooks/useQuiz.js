import { useState, useCallback } from 'react';

export default function useQuiz() {
  const [quizState, setQuizState] = useState({ answers: {}, submitted: false, score: null });

  const handleQuizSubmit = useCallback((quiz, paperId, progress, setProgress) => {
    if (!quiz?.questions) return;

    let correct = 0;
    quiz.questions.forEach(q => {
      const answer = quizState.answers[q.id];
      if (q.type === 'multiple_choice' && answer === q.correct) correct++;
      if (q.type === 'true_false' && answer === q.correct) correct++;
      if (q.type === 'fill_blank' && answer?.toLowerCase().trim() === q.correct.toLowerCase()) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    setQuizState(prev => ({ ...prev, submitted: true, score }));

    const currentBest = progress[paperId]?.bestScore || 0;
    setProgress(prev => ({
      ...prev,
      [paperId]: {
        ...prev[paperId],
        bestScore: Math.max(currentBest, score),
        completed: score >= 70 || prev[paperId]?.completed,
        lastAttempt: new Date().toISOString()
      }
    }));
  }, [quizState.answers]);

  const setAnswer = useCallback((questionId, value) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizState({ answers: {}, submitted: false, score: null });
  }, []);

  return { quizState, setAnswer, handleQuizSubmit, resetQuiz };
}
