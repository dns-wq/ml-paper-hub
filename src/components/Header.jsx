import { useRef } from 'react';
import { Brain, Plus, Download, Upload } from 'lucide-react';

export default function Header({ stats, onAddPaper, onExport, onImport }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <header className="header">
      <h1><Brain size={28} /> ML Paper Study Hub</h1>
      <div className="header-right">
        <div className="stats-bar">
          <div className="stat">
            <div className="stat-value">{stats.completed}/{stats.total}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-label">Avg Score</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.quizzesTaken}</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={onExport} title="Export data">
            <Download size={16} />
          </button>
          <button className="icon-btn" onClick={handleImportClick} title="Import data">
            <Upload size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="add-paper-btn" onClick={onAddPaper}>
            <Plus size={18} /> Add Paper
          </button>
        </div>
      </div>
    </header>
  );
}
