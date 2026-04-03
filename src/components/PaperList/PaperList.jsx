import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import PaperCard from './PaperCard.jsx';

export default function PaperList({ groupedPapers, progress, onSelectPaper }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="papers-grid">
      {Object.entries(groupedPapers).map(([category, categoryPapers]) => (
        <div key={category} className="category-group">
          <div className="category-header" onClick={() => toggleCategory(category)}>
            {expandedCategories[category] === false ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
            <h3>{category}</h3>
            <span className="category-count">{categoryPapers.length}</span>
          </div>

          {expandedCategories[category] !== false && (
            <div className="papers-in-category">
              {categoryPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  progress={progress[paper.id]}
                  onClick={() => onSelectPaper(paper)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
