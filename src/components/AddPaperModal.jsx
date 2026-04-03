import { useState } from 'react';
import { Search, Link, FileText, Loader2, AlertCircle, Plus, Globe } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_LABELS } from '../data/papers.js';
import { importPaper, searchPapers } from '../services/paperImport.js';

const SEARCH_PROVIDERS = [
  { id: 'semantic_scholar', label: 'Semantic Scholar', description: '225M+ papers, AI-ranked relevance' },
  { id: 'openalex', label: 'OpenAlex', description: '450M+ works, strong international coverage' },
  { id: 'dblp', label: 'DBLP', description: 'CS conferences & journals including CCF-ranked' },
];

export default function AddPaperModal({ onAdd, onClose }) {
  const [mode, setMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [provider, setProvider] = useState('semantic_scholar');
  const [url, setUrl] = useState('');
  const [manual, setManual] = useState({
    title: '', authors: '', year: '', abstract: '',
    category: 'Language Models', difficulty: 3
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const results = await searchPapers(searchQuery.trim(), provider);
      if (results.length === 0) {
        setError('No papers found. Try different keywords or another source.');
      } else {
        setSearchResults(results);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromSearch = (paper) => {
    // Remove internal _provider field before adding
    const { _provider, ...cleanPaper } = paper;
    onAdd(cleanPaper);
    onClose();
  };

  const handleAddByUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const paper = await importPaper(url);
      onAdd(paper);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManual = () => {
    const newPaper = {
      id: `paper-${Date.now()}`,
      ...manual,
      year: parseInt(manual.year) || new Date().getFullYear(),
      difficulty: parseInt(manual.difficulty),
      url: '',
      source: 'user'
    };
    onAdd(newPaper);
    onClose();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSearchResults([]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <h2>Add New Paper</h2>

        <div className="mode-tabs">
          <button className={mode === 'search' ? 'active' : ''} onClick={() => switchMode('search')}>
            <Search size={16} /> Search
          </button>
          <button className={mode === 'url' ? 'active' : ''} onClick={() => switchMode('url')}>
            <Link size={16} /> From URL
          </button>
          <button className={mode === 'manual' ? 'active' : ''} onClick={() => switchMode('manual')}>
            <FileText size={16} /> Manual
          </button>
        </div>

        {mode === 'search' && (
          <div className="search-form">
            <div className="provider-selector">
              {SEARCH_PROVIDERS.map(p => (
                <button
                  key={p.id}
                  className={`provider-btn ${provider === p.id ? 'active' : ''}`}
                  onClick={() => { setProvider(p.id); setSearchResults([]); setError(null); }}
                  title={p.description}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <form className="search-input-row" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={`Search ${SEARCH_PROVIDERS.find(p => p.id === provider)?.label}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={loading || !searchQuery.trim()}>
                {loading ? <Loader2 className="spin" size={16} /> : <Search size={16} />}
              </button>
            </form>

            {error && (
              <div className="import-error">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((paper, idx) => (
                  <div key={idx} className="search-result-card">
                    <div className="search-result-info">
                      <div className="search-result-title">{paper.title}</div>
                      <div className="search-result-meta">
                        {paper.authors}
                        {paper.year && ` \u00B7 ${paper.year}`}
                        {paper.citationCount > 0 && ` \u00B7 ${paper.citationCount} citations`}
                        {paper.venue && ` \u00B7 ${paper.venue}`}
                        {paper.language && paper.language !== 'en' && (
                          <span className="lang-badge">
                            <Globe size={10} /> {paper.language.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {paper.abstract && (
                        <div className="search-result-abstract">
                          {paper.abstract.length > 200
                            ? paper.abstract.slice(0, 200) + '...'
                            : paper.abstract}
                        </div>
                      )}
                      {!paper.abstract && paper._provider === 'DBLP' && (
                        <div className="search-result-abstract" style={{ fontStyle: 'italic' }}>
                          DBLP does not provide abstracts — paper will be added with metadata only.
                        </div>
                      )}
                    </div>
                    <button
                      className="add-result-btn"
                      onClick={() => handleAddFromSearch(paper)}
                      title="Add this paper"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchResults.length === 0 && !error && (
              <p className="url-hint">
                {provider === 'semantic_scholar' && 'Search 225M+ papers with AI-powered relevance ranking.'}
                {provider === 'openalex' && 'Search 450M+ scholarly works with strong international and multilingual coverage.'}
                {provider === 'dblp' && 'Search CS conferences and journals, including CCF-ranked Chinese venues (NLPCC, CCL, etc.).'}
              </p>
            )}
          </div>
        )}

        {mode === 'url' && (
          <div className="url-form">
            <input
              type="text"
              placeholder="Paste arXiv URL, Semantic Scholar URL, or paper link..."
              value={url}
              onChange={e => { setUrl(e.target.value); setError(null); }}
            />
            {error && (
              <div className="import-error">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            <button onClick={handleAddByUrl} disabled={loading || !url.trim()}>
              {loading ? (
                <><Loader2 className="spin" size={16} /> Fetching metadata...</>
              ) : (
                'Import Paper'
              )}
            </button>
            <p className="url-hint">
              Supports arXiv and Semantic Scholar URLs. Automatically fetches title, authors, abstract, and citation data.
            </p>
          </div>
        )}

        {mode === 'manual' && (
          <div className="manual-form">
            <input placeholder="Title" value={manual.title} onChange={e => setManual(prev => ({ ...prev, title: e.target.value }))} />
            <input placeholder="Authors" value={manual.authors} onChange={e => setManual(prev => ({ ...prev, authors: e.target.value }))} />
            <input placeholder="Year" type="number" value={manual.year} onChange={e => setManual(prev => ({ ...prev, year: e.target.value }))} />
            <select value={manual.category} onChange={e => setManual(prev => ({ ...prev, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={manual.difficulty} onChange={e => setManual(prev => ({ ...prev, difficulty: e.target.value }))}>
              {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
            </select>
            <textarea placeholder="Abstract" value={manual.abstract} onChange={e => setManual(prev => ({ ...prev, abstract: e.target.value }))} />
            <button onClick={handleAddManual}>Add Paper</button>
          </div>
        )}
      </div>
    </div>
  );
}
