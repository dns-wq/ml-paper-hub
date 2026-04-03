import { useState, useEffect, useCallback } from 'react';
import { Book, Brain, FlaskConical, HelpCircle, MessageCircle, ExternalLink, Target, Check, Loader2, Trash2, Dna, GraduationCap, Scale, FlaskRound } from 'lucide-react';
import DifficultyStars from '../common/DifficultyStars.jsx';
import SummaryTab from './SummaryTab.jsx';
import TheoryTab from './TheoryTab.jsx';
import FindingsTab from './FindingsTab.jsx';
import QuizTab from './QuizTab.jsx';
import QuestionsTab from './QuestionsTab.jsx';
import DnaTab from './DnaTab.jsx';
import FeynmanTab from './FeynmanTab.jsx';
import ClaimsTab from './ClaimsTab.jsx';
import AblationTab from './AblationTab.jsx';

export default function PaperDetail({
  paper,
  content,
  progress,
  isGenerating,
  generateContent,
  quizState,
  setAnswer,
  handleQuizSubmit,
  resetQuiz,
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  chatEndRef,
  askQuestion,
  resetChat,
  onBack,
  onDelete,
  setProgress,
  onUpdateContent
}) {
  const [activeTab, setActiveTab] = useState('summary');
  const paperProgress = progress[paper.id] || {};

  useEffect(() => {
    const autoGenerateTabs = ['summary', 'theory', 'findings'];
    if (autoGenerateTabs.includes(activeTab) && !content[activeTab]) {
      generateContent(paper, activeTab);
    }
  }, [paper.id, activeTab]);

  useEffect(() => {
    resetChat();
  }, [paper.id]);

  const handleBack = () => {
    resetQuiz();
    resetChat();
    onBack();
  };

  const handleDnaGenerated = useCallback((dna) => {
    onUpdateContent(paper.id, 'dna', dna);
  }, [paper.id, onUpdateContent]);

  const handleClaimsGenerated = useCallback((claims) => {
    onUpdateContent(paper.id, 'claims', claims);
  }, [paper.id, onUpdateContent]);

  const handleAblationsGenerated = useCallback((ablations) => {
    onUpdateContent(paper.id, 'ablations', ablations);
  }, [paper.id, onUpdateContent]);

  const renderContent = () => {
    if (isGenerating && !['questions', 'dna', 'feynman', 'claims', 'ablation'].includes(activeTab)) {
      return (
        <div className="loading-state">
          <Loader2 className="spin" size={32} />
          <p>Generating content...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'summary':
        return <SummaryTab content={content.summary} onGenerate={() => generateContent(paper, 'summary')} />;
      case 'theory':
        return <TheoryTab content={content.theory} isGenerating={isGenerating} onGenerate={() => generateContent(paper, 'theory')} onLoadMore={() => generateContent(paper, 'theory', true)} />;
      case 'findings':
        return <FindingsTab content={content.findings} isGenerating={isGenerating} onGenerate={() => generateContent(paper, 'findings')} onLoadMore={() => generateContent(paper, 'findings', true)} />;
      case 'quiz':
        return <QuizTab quiz={content.quiz} quizState={quizState} isGenerating={isGenerating} onGenerate={() => generateContent(paper, 'quiz')} onLoadMore={() => generateContent(paper, 'quiz', true)} onSetAnswer={setAnswer} onSubmit={() => handleQuizSubmit(content.quiz, paper.id, progress, setProgress)} onReset={resetQuiz} />;
      case 'questions':
        return <QuestionsTab chatMessages={chatMessages} chatInput={chatInput} isChatLoading={isChatLoading} chatEndRef={chatEndRef} onInputChange={setChatInput} onSubmit={(q) => askQuestion(paper, q)} />;
      case 'dna':
        return <DnaTab dna={content.dna} onDnaGenerated={handleDnaGenerated} paper={paper} />;
      case 'feynman':
        return <FeynmanTab paper={paper} dna={content.dna} onDnaGenerated={handleDnaGenerated} />;
      case 'claims':
        return <ClaimsTab claims={content.claims} onClaimsGenerated={handleClaimsGenerated} paper={paper} />;
      case 'ablation':
        return <AblationTab ablations={content.ablations} onAblationsGenerated={handleAblationsGenerated} paper={paper} />;
      default:
        return null;
    }
  };

  return (
    <div className="paper-detail">
      <div className="detail-top-bar">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back to Papers
        </button>
        {paper.source === 'user' && (
          <button className="delete-btn" onClick={() => { if (window.confirm(`Delete "${paper.title}"?`)) { onDelete(paper.id); onBack(); } }}>
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>

      <div className="paper-header">
        <h1>{paper.title}</h1>
        <div className="paper-meta">
          <span>{paper.authors}</span>
          <span>&bull;</span>
          <span>{paper.year}</span>
          <span>&bull;</span>
          <DifficultyStars level={paper.difficulty} />
          {paper.url && (
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="paper-link">
              <ExternalLink size={14} /> Original
            </a>
          )}
        </div>
        <p className="abstract">{paper.abstract}</p>
        {paperProgress.bestScore !== undefined && (
          <div className="progress-badge">
            <Target size={14} />
            Best Score: {paperProgress.bestScore}%
            {paperProgress.completed && <Check size={14} />}
          </div>
        )}
      </div>

      <div className="tabs">
        <div className="tab-group">
          <span className="tab-group-label">Study</span>
          <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
            <Book size={14} /> Summary
          </button>
          <button className={activeTab === 'theory' ? 'active' : ''} onClick={() => setActiveTab('theory')}>
            <Brain size={14} /> Theory
          </button>
          <button className={activeTab === 'findings' ? 'active' : ''} onClick={() => setActiveTab('findings')}>
            <FlaskConical size={14} /> Findings
          </button>
        </div>
        <div className="tab-group">
          <span className="tab-group-label">Deep Dive</span>
          <button className={activeTab === 'dna' ? 'active' : ''} onClick={() => setActiveTab('dna')}>
            <Dna size={14} /> DNA
          </button>
          <button className={activeTab === 'claims' ? 'active' : ''} onClick={() => setActiveTab('claims')}>
            <Scale size={14} /> Claims
          </button>
          <button className={activeTab === 'ablation' ? 'active' : ''} onClick={() => setActiveTab('ablation')}>
            <FlaskRound size={14} /> What If?
          </button>
        </div>
        <div className="tab-group">
          <span className="tab-group-label">Practice</span>
          <button className={activeTab === 'feynman' ? 'active' : ''} onClick={() => setActiveTab('feynman')}>
            <GraduationCap size={14} /> Feynman
          </button>
          <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => { setActiveTab('quiz'); resetQuiz(); }}>
            <HelpCircle size={14} /> Quiz
          </button>
          <button className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>
            <MessageCircle size={14} /> Q&A
          </button>
        </div>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}
