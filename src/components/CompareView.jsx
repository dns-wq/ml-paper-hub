import { useState } from 'react';
import { ArrowLeft, Loader2, Search, GitCompareArrows } from 'lucide-react';
import { callClaude, buildComparisonPrompt } from '../services/api.js';
import DifficultyStars from './common/DifficultyStars.jsx';

export default function CompareView({ paperA, papers, onBack }) {
  const [paperB, setPaperB] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papers.filter(p => {
    if (p.id === paperA.id) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q);
  });

  const handleCompare = async (selected) => {
    setPaperB(selected);
    setLoading(true);
    try {
      const text = await callClaude(buildComparisonPrompt(paperA, selected), 3000, { jsonResponse: true });
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        setComparison(JSON.parse(match[0]));
      }
    } catch (e) {
      console.error('Comparison error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Pick paper B
  if (!paperB) {
    return (
      <div className="compare-view">
        <button className="back-btn" onClick={onBack}>&larr; Back</button>

        <div className="compare-header">
          <h2>Compare Papers</h2>
          <p>Select a paper to compare with:</p>
        </div>

        <div className="compare-paper-a">
          <div className="compare-label">Paper A</div>
          <h3>{paperA.title}</h3>
          <span className="compare-meta">{paperA.authors} &bull; {paperA.year}</span>
        </div>

        <div className="compare-picker">
          <div className="compare-label">Paper B &mdash; pick from your library</div>
          <div className="compare-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Filter papers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="compare-paper-list">
            {filteredPapers.map(p => (
              <div key={p.id} className="compare-paper-option" onClick={() => handleCompare(p)}>
                <div className="compare-option-info">
                  <div className="compare-option-title">{p.title}</div>
                  <div className="compare-option-meta">{p.authors} &bull; {p.year}</div>
                </div>
                <DifficultyStars level={p.difficulty} />
              </div>
            ))}
            {filteredPapers.length === 0 && (
              <div className="no-results">No matching papers found.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show comparison
  return (
    <div className="compare-view">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>

      <div className="compare-header">
        <GitCompareArrows size={24} />
        <h2>Paper Comparison</h2>
      </div>

      <div className="compare-papers-row">
        <div className="compare-paper-card">
          <div className="compare-label">Paper A</div>
          <h3>{paperA.title}</h3>
          <span className="compare-meta">{paperA.authors} &bull; {paperA.year}</span>
          {paperA.abstract && <p className="compare-abstract">{paperA.abstract}</p>}
        </div>
        <div className="compare-vs">vs</div>
        <div className="compare-paper-card">
          <div className="compare-label">Paper B</div>
          <h3>{paperB.title}</h3>
          <span className="compare-meta">{paperB.authors} &bull; {paperB.year}</span>
          {paperB.abstract && <p className="compare-abstract">{paperB.abstract}</p>}
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <Loader2 className="spin" size={32} />
          <p>Generating comparison analysis...</p>
        </div>
      )}

      {comparison && (
        <div className="compare-analysis">
          {comparison.shared_concepts?.length > 0 && (
            <div className="compare-section">
              <h4>Shared Concepts</h4>
              <div className="dna-chips">
                {comparison.shared_concepts.map((c, i) => (
                  <span key={i} className="dna-chip chip-cyan">{c}</span>
                ))}
              </div>
            </div>
          )}

          {comparison.approach_differences?.length > 0 && (
            <div className="compare-section">
              <h4>Approach Differences</h4>
              <div className="compare-diff-table">
                <div className="compare-diff-header">
                  <span>Aspect</span>
                  <span>{paperA.title.length > 30 ? paperA.title.slice(0, 30) + '...' : paperA.title}</span>
                  <span>{paperB.title.length > 30 ? paperB.title.slice(0, 30) + '...' : paperB.title}</span>
                </div>
                {comparison.approach_differences.map((diff, i) => (
                  <div key={i} className="compare-diff-row">
                    <span className="compare-diff-aspect">{diff.aspect}</span>
                    <span>{diff.paper_a}</span>
                    <span>{diff.paper_b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {comparison.performance_comparison && (
            <div className="compare-section">
              <h4>Performance</h4>
              <p>{comparison.performance_comparison}</p>
            </div>
          )}

          {comparison.historical_context && (
            <div className="compare-section">
              <h4>Historical Context</h4>
              <p>{comparison.historical_context}</p>
            </div>
          )}

          {comparison.when_to_use && (
            <div className="compare-section">
              <h4>When to Use Each</h4>
              <div className="compare-when-to-use">
                <div className="when-card">
                  <strong>{paperA.title.length > 40 ? paperA.title.slice(0, 40) + '...' : paperA.title}</strong>
                  <p>{comparison.when_to_use.paper_a}</p>
                </div>
                <div className="when-card">
                  <strong>{paperB.title.length > 40 ? paperB.title.slice(0, 40) + '...' : paperB.title}</strong>
                  <p>{comparison.when_to_use.paper_b}</p>
                </div>
              </div>
            </div>
          )}

          {comparison.synthesis && (
            <div className="compare-section synthesis">
              <h4>Synthesis</h4>
              <p>{comparison.synthesis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
