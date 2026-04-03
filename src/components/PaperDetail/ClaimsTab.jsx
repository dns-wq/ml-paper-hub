import { useState } from 'react';
import { Loader2, Scale } from 'lucide-react';
import { callClaude, buildClaimsPrompt } from '../../services/api.js';

const EVIDENCE_CONFIG = {
  empirical: { label: 'Empirical', className: 'evidence-empirical', description: 'Demonstrated with experiments in this paper' },
  cited: { label: 'Cited', className: 'evidence-cited', description: 'Supported by citing prior work' },
  assumed: { label: 'Assumed', className: 'evidence-assumed', description: 'Stated without evidence' },
  speculative: { label: 'Speculative', className: 'evidence-speculative', description: 'Hypothesis or future work' }
};

export default function ClaimsTab({ claims, onClaimsGenerated, paper }) {
  const [loading, setLoading] = useState(false);
  const [filterEvidence, setFilterEvidence] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await callClaude(buildClaimsPrompt(paper), 3000, { jsonResponse: true });
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        onClaimsGenerated(parsed);
      }
    } catch (e) {
      console.error('Claims extraction error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="spin" size={32} />
        <p>Extracting and classifying claims...</p>
      </div>
    );
  }

  if (!claims) {
    return (
      <button className="generate-btn" onClick={handleGenerate}>
        <Scale size={16} /> Extract Claims
      </button>
    );
  }

  const claimsList = claims.claims || [];
  const filtered = filterEvidence ? claimsList.filter(c => c.evidence === filterEvidence) : claimsList;

  // Count by evidence type
  const counts = {};
  claimsList.forEach(c => { counts[c.evidence] = (counts[c.evidence] || 0) + 1; });

  return (
    <div className="claims-container">
      <div className="claims-legend">
        {Object.entries(EVIDENCE_CONFIG).map(([type, config]) => (
          <button
            key={type}
            className={`claims-legend-item ${config.className} ${filterEvidence === type ? 'active' : ''}`}
            onClick={() => setFilterEvidence(filterEvidence === type ? null : type)}
          >
            <span className="claims-legend-dot" />
            {config.label} ({counts[type] || 0})
          </button>
        ))}
      </div>

      <div className="claims-list">
        {filtered.map((claim, idx) => {
          const config = EVIDENCE_CONFIG[claim.evidence] || EVIDENCE_CONFIG.assumed;
          return (
            <div key={idx} className={`claim-card ${config.className}`}>
              <div className="claim-header">
                <span className={`claim-badge ${config.className}`}>{config.label}</span>
                {claim.context && <span className="claim-context">{claim.context}</span>}
              </div>
              <p className="claim-text">{claim.claim}</p>
              {claim.note && <p className="claim-note">{claim.note}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
