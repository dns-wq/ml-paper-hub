import { useState } from 'react';
import { Sparkles, Loader2, GraduationCap, Send, RotateCcw } from 'lucide-react';
import { callClaude, buildDnaPrompt, buildFeynmanPrompt } from '../../services/api.js';

const RATING_STYLES = {
  excellent: { label: 'Excellent', className: 'rating-excellent' },
  good: { label: 'Good', className: 'rating-good' },
  needs_work: { label: 'Needs Work', className: 'rating-needswork' },
  incorrect: { label: 'Incorrect', className: 'rating-incorrect' }
};

export default function FeynmanTab({ paper, dna, onDnaGenerated }) {
  const [concept, setConcept] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingConcepts, setLoadingConcepts] = useState(false);

  const concepts = dna?.concepts || [];

  const handleLoadConcepts = async () => {
    setLoadingConcepts(true);
    try {
      const text = await callClaude(buildDnaPrompt(paper));
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        onDnaGenerated(parsed);
      }
    } catch (e) {
      console.error('Error loading concepts:', e);
    } finally {
      setLoadingConcepts(false);
    }
  };

  const handleSubmit = async () => {
    if (!explanation.trim() || !concept) return;
    setLoading(true);
    setFeedback(null);

    try {
      const text = await callClaude(buildFeynmanPrompt(paper, concept, explanation.trim()), 1500);
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        setFeedback(JSON.parse(match[0]));
      }
    } catch (e) {
      console.error('Feynman evaluation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConcept(null);
    setExplanation('');
    setFeedback(null);
  };

  // Step 1: No concepts loaded yet
  if (concepts.length === 0) {
    return (
      <div className="feynman-container">
        <div className="feynman-intro">
          <GraduationCap size={32} />
          <h3>Feynman Mode</h3>
          <p>Test your understanding by explaining concepts in your own words. The AI evaluates your accuracy, completeness, and clarity.</p>
        </div>
        <button className="generate-btn" onClick={handleLoadConcepts} disabled={loadingConcepts}>
          {loadingConcepts ? <><Loader2 className="spin" size={16} /> Loading concepts...</> : <><Sparkles size={16} /> Load Concepts</>}
        </button>
      </div>
    );
  }

  // Step 2: Pick a concept
  if (!concept) {
    return (
      <div className="feynman-container">
        <div className="feynman-intro">
          <GraduationCap size={32} />
          <h3>Pick a concept to explain</h3>
          <p>Choose a concept from this paper and explain it as if teaching a smart undergrad.</p>
        </div>
        <div className="concept-grid">
          {concepts.map((c, i) => (
            <button key={i} className="concept-btn" onClick={() => setConcept(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Write explanation + get feedback
  return (
    <div className="feynman-container">
      <div className="feynman-prompt">
        <h3>Explain: <span className="feynman-concept">{concept}</span></h3>
        <p>Write your explanation as if teaching someone who is smart but unfamiliar with this paper.</p>
      </div>

      <textarea
        className="feynman-input"
        placeholder="Type your explanation here..."
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
        disabled={loading || feedback !== null}
        rows={5}
      />

      {!feedback && (
        <div className="feynman-actions">
          <button className="submit-quiz" onClick={handleSubmit} disabled={loading || !explanation.trim()}>
            {loading ? <><Loader2 className="spin" size={16} /> Evaluating...</> : <><Send size={16} /> Submit Explanation</>}
          </button>
          <button className="more-btn" onClick={handleReset}>
            <RotateCcw size={14} /> Pick Different Concept
          </button>
        </div>
      )}

      {feedback && (
        <div className="feynman-feedback">
          <div className={`feynman-rating ${RATING_STYLES[feedback.rating]?.className || ''}`}>
            {RATING_STYLES[feedback.rating]?.label || feedback.rating}
          </div>

          <div className="feedback-section">
            <h4>Accuracy</h4>
            <p>{feedback.accuracy}</p>
          </div>
          <div className="feedback-section">
            <h4>Completeness</h4>
            <p>{feedback.completeness}</p>
          </div>
          <div className="feedback-section">
            <h4>Clarity</h4>
            <p>{feedback.clarity}</p>
          </div>
          <div className="feedback-section improved">
            <h4>Model Explanation</h4>
            <p>{feedback.improved}</p>
          </div>

          <button className="more-btn" onClick={handleReset} style={{ marginTop: '1rem' }}>
            <RotateCcw size={14} /> Try Another Concept
          </button>
        </div>
      )}
    </div>
  );
}
