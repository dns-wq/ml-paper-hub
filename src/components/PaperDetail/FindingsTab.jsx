import { Sparkles, PlusCircle, Loader2 } from 'lucide-react';

export default function FindingsTab({ content, isGenerating, onGenerate, onLoadMore }) {
  return (
    <div className="content-section">
      <div className="content-text">
        {content || (
          <button className="generate-btn" onClick={onGenerate}>
            <Sparkles size={16} /> Generate Key Findings
          </button>
        )}
      </div>
      {content && (
        <button className="more-btn" onClick={onLoadMore} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="spin" size={14} /> : <PlusCircle size={14} />}
          Load More Findings
        </button>
      )}
    </div>
  );
}
