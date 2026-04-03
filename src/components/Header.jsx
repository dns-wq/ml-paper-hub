import { Brain, Plus } from 'lucide-react';

export default function Header({ stats, onAddPaper }) {
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
        <button className="add-paper-btn" onClick={onAddPaper}>
          <Plus size={18} /> Add Paper
        </button>
      </div>
    </header>
  );
}
