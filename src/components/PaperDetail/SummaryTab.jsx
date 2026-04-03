import { Sparkles } from 'lucide-react';

export default function SummaryTab({ content, onGenerate }) {
  return (
    <div className="content-text">
      {content || (
        <button className="generate-btn" onClick={onGenerate}>
          <Sparkles size={16} /> Generate Summary
        </button>
      )}
    </div>
  );
}
