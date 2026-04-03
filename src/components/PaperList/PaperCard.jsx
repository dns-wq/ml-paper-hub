import { Check } from 'lucide-react';
import DifficultyStars from '../common/DifficultyStars.jsx';

const SOURCE_TO_LISTS = {
  ilya: ["Ilya's List"],
  karpathy: ["Karpathy's List"],
  both: ["Ilya's List", "Karpathy's List"],
  user: [],
};

const LIST_COLORS = {
  "Ilya's List": 'list-red',
  "Karpathy's List": 'list-blue',
};

export default function PaperCard({ paper, progress, onClick }) {
  const isCompleted = progress?.completed;
  const lists = paper.lists || SOURCE_TO_LISTS[paper.source] || [];

  return (
    <div
      className={`paper-card ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="paper-info">
        <div className="paper-title">{paper.title}</div>
        <div className="paper-meta-row">
          <span className="paper-authors">{paper.authors} &bull; {paper.year}</span>
          {lists.length > 0 && (
            <span className="list-tags">
              {lists.map(list => (
                <span key={list} className={`list-tag ${LIST_COLORS[list] || 'list-default'}`}>
                  {list}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
      <DifficultyStars level={paper.difficulty} />
      {isCompleted && <Check size={18} color="#00ff88" />}
    </div>
  );
}
