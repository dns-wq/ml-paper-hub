import { Sparkles, PlusCircle, Loader2, Trophy, RefreshCw } from 'lucide-react';

export default function QuizTab({ quiz, quizState, isGenerating, onGenerate, onLoadMore, onSetAnswer, onSubmit, onReset }) {
  if (!quiz) {
    return (
      <button className="generate-btn" onClick={onGenerate}>
        <Sparkles size={16} /> Generate Quiz
      </button>
    );
  }

  return (
    <div className="quiz-container">
      {quizState.submitted && (
        <div className={`quiz-result ${quizState.score >= 70 ? 'pass' : 'fail'}`}>
          <Trophy size={24} />
          <span>Score: {quizState.score}%</span>
          {quizState.score >= 70 ? ' - Passed!' : ' - Need 70% to pass'}
          <button onClick={onReset}><RefreshCw size={14} /> Retry</button>
        </div>
      )}

      {quiz.questions?.map((q, idx) => {
        const isCorrect =
          (q.type === 'multiple_choice' && quizState.answers[q.id] === q.correct) ||
          (q.type === 'true_false' && quizState.answers[q.id] === q.correct) ||
          (q.type === 'fill_blank' && quizState.answers[q.id]?.toLowerCase().trim() === q.correct.toLowerCase());

        return (
          <div key={q.id} className={`quiz-question ${quizState.submitted ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
            <p className="question-text">{idx + 1}. {q.question}</p>

            {q.type === 'multiple_choice' && (
              <div className="options">
                {q.options.map((opt, i) => (
                  <label key={i} className={quizState.submitted && i === q.correct ? 'correct-answer' : ''}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={quizState.answers[q.id] === i}
                      onChange={() => !quizState.submitted && onSetAnswer(q.id, i)}
                      disabled={quizState.submitted}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'true_false' && (
              <div className="options tf-options">
                {[true, false].map(val => (
                  <label key={val.toString()} className={quizState.submitted && val === q.correct ? 'correct-answer' : ''}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={quizState.answers[q.id] === val}
                      onChange={() => !quizState.submitted && onSetAnswer(q.id, val)}
                      disabled={quizState.submitted}
                    />
                    {val ? 'True' : 'False'}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'fill_blank' && (
              <div className="fill-blank">
                <input
                  type="text"
                  placeholder="Your answer..."
                  value={quizState.answers[q.id] || ''}
                  onChange={e => !quizState.submitted && onSetAnswer(q.id, e.target.value)}
                  disabled={quizState.submitted}
                />
                {quizState.submitted && (
                  <span className="correct-answer-text">Correct: {q.correct}</span>
                )}
              </div>
            )}

            {quizState.submitted && q.explanation && (
              <p className="explanation">{q.explanation}</p>
            )}
          </div>
        );
      })}

      <div className="quiz-actions">
        {!quizState.submitted && quiz.questions?.length > 0 && (
          <button className="submit-quiz" onClick={onSubmit}>
            Submit Quiz
          </button>
        )}
        <button className="more-btn" onClick={onLoadMore} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="spin" size={14} /> : <PlusCircle size={14} />}
          Add More Questions ({quiz.questions?.length || 0} total)
        </button>
      </div>
    </div>
  );
}
