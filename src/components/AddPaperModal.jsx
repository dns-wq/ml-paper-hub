import { useState } from 'react';
import { Link, FileText, Loader2 } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_LABELS } from '../data/papers.js';

export default function AddPaperModal({ onAdd, onClose }) {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [manual, setManual] = useState({
    title: '', authors: '', year: '', abstract: '',
    category: 'Language Models', difficulty: 3
  });
  const [loading, setLoading] = useState(false);

  const handleAddByUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);

    const newPaper = {
      id: `paper-${Date.now()}`,
      title: 'Paper from URL',
      authors: 'Unknown',
      year: new Date().getFullYear(),
      category: 'Language Models',
      difficulty: 3,
      url: url,
      source: 'user',
      abstract: 'Abstract to be fetched...'
    };

    onAdd(newPaper);
    onClose();
    setLoading(false);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Add New Paper</h2>

        <div className="mode-tabs">
          <button className={mode === 'url' ? 'active' : ''} onClick={() => setMode('url')}>
            <Link size={16} /> From URL
          </button>
          <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
            <FileText size={16} /> Manual Entry
          </button>
        </div>

        {mode === 'url' ? (
          <div className="url-form">
            <input
              type="text"
              placeholder="Paste arXiv URL or paper link..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button onClick={handleAddByUrl} disabled={loading}>
              {loading ? <Loader2 className="spin" size={16} /> : 'Add Paper'}
            </button>
          </div>
        ) : (
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
