import { Check } from 'lucide-react';
import DifficultyStars from '../common/DifficultyStars.jsx';

export default function PaperCard({ paper, progress, onClick }) {
  const isCompleted = progress?.completed;

  return (
    <div
      className={`paper-card ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="paper-info">
        <div className="paper-title">{paper.title}</div>
        <div className="paper-authors">{paper.authors} &bull; {paper.year}</div>
      </div>
      <DifficultyStars level={paper.difficulty} />
      <span className={`source-badge ${paper.source}`}>
        {paper.source === 'both' ? 'Both' : paper.source === 'ilya' ? 'Ilya' : paper.source === 'karpathy' ? 'Karpathy' : 'Added'}
      </span>
      {isCompleted && <Check size={18} color="#00ff88" />}
    </div>
  );
}
