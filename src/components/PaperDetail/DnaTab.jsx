import { useState } from 'react';
import { Sparkles, Loader2, Dna } from 'lucide-react';
import { callClaude, buildDnaPrompt } from '../../services/api.js';

const FIELD_LABELS = {
  concepts: 'Key Concepts',
  methods: 'Methods & Techniques',
  datasets: 'Datasets',
  metrics: 'Metrics & Results',
  prerequisites: 'Prerequisites',
  contributions: 'Novel Contributions',
  limitations: 'Limitations',
  applications: 'Applications'
};

const FIELD_COLORS = {
  concepts: 'chip-cyan',
  methods: 'chip-green',
  datasets: 'chip-purple',
  metrics: 'chip-yellow',
  prerequisites: 'chip-orange',
  contributions: 'chip-blue',
  limitations: 'chip-red',
  applications: 'chip-teal'
};

export default function DnaTab({ dna, onDnaGenerated, paper }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await callClaude(buildDnaPrompt(paper), 2500, { jsonResponse: true });
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        onDnaGenerated(parsed);
      }
    } catch (e) {
      console.error('DNA generation error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="spin" size={32} />
        <p>Extracting Paper DNA...</p>
      </div>
    );
  }

  if (!dna) {
    return (
      <button className="generate-btn" onClick={handleGenerate}>
        <Dna size={16} /> Extract Paper DNA
      </button>
    );
  }

  return (
    <div className="dna-container">
      {Object.entries(FIELD_LABELS).map(([field, label]) => {
        const items = dna[field];
        if (!items || items.length === 0) return null;
        return (
          <div key={field} className="dna-field">
            <h4 className="dna-field-label">{label}</h4>
            <div className="dna-chips">
              {items.map((item, i) => (
                <span key={i} className={`dna-chip ${FIELD_COLORS[field]}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
