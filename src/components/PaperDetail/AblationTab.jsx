import { useState } from 'react';
import { Loader2, FlaskRound, Send } from 'lucide-react';
import { callClaude, buildAblationPrompt } from '../../services/api.js';

const CATEGORY_LABELS = {
  architecture: 'Architecture',
  loss_function: 'Loss Function',
  training: 'Training',
  data: 'Data',
  evaluation: 'Evaluation'
};

export default function AblationTab({ ablations, onAblationsGenerated, paper }) {
  const [loading, setLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await callClaude(buildAblationPrompt(paper), 3000, { jsonResponse: true });
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        onAblationsGenerated(parsed);
      }
    } catch (e) {
      console.error('Ablation analysis error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomQuestion = async () => {
    if (!customQuestion.trim()) return;
    setCustomLoading(true);
    setCustomAnswer(null);
    try {
      const answer = await callClaude(buildAblationPrompt(paper, customQuestion.trim()), 2000);
      setCustomAnswer(answer);
    } catch (e) {
      console.error('Custom what-if error:', e);
    } finally {
      setCustomLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="spin" size={32} />
        <p>Analyzing design decisions...</p>
      </div>
    );
  }

  if (!ablations) {
    return (
      <button className="generate-btn" onClick={handleGenerate}>
        <FlaskRound size={16} /> Analyze Design Decisions
      </button>
    );
  }

  const decisions = ablations.decisions || [];

  return (
    <div className="ablation-container">
      <div className="ablation-decisions">
        {decisions.map((d, idx) => (
          <div
            key={idx}
            className={`ablation-card ${expandedIdx === idx ? 'expanded' : ''}`}
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <div className="ablation-header">
              <span className="ablation-category">
                {CATEGORY_LABELS[d.category] || d.category}
              </span>
              <h4 className="ablation-decision">{d.decision}</h4>
            </div>
            {expandedIdx === idx && (
              <div className="ablation-details">
                <div className="ablation-field">
                  <strong>What if?</strong>
                  <p>{d.what_if}</p>
                </div>
                <div className="ablation-field">
                  <strong>Why this choice?</strong>
                  <p>{d.why_chosen}</p>
                </div>
                {d.alternatives_tried && (
                  <div className="ablation-field">
                    <strong>Alternatives tried</strong>
                    <p>{d.alternatives_tried}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ablation-custom">
        <h4>Ask your own "What if?"</h4>
        <div className="ablation-custom-input">
          <input
            type="text"
            placeholder="What if they used a different activation function?"
            value={customQuestion}
            onChange={e => setCustomQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomQuestion()}
            disabled={customLoading}
          />
          <button onClick={handleCustomQuestion} disabled={customLoading || !customQuestion.trim()}>
            {customLoading ? <Loader2 className="spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
        {customAnswer && (
          <div className="ablation-custom-answer">
            {customAnswer}
          </div>
        )}
      </div>
    </div>
  );
}
