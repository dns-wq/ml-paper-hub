import { Star } from 'lucide-react';
import { DIFFICULTY_LABELS } from '../../data/papers.js';

export default function DifficultyStars({ level }) {
  return (
    <div className="difficulty-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          fill={i <= level ? '#f59e0b' : 'none'}
          stroke={i <= level ? '#f59e0b' : '#4b5563'}
        />
      ))}
      <span className="difficulty-label">{DIFFICULTY_LABELS[level]}</span>
    </div>
  );
}
