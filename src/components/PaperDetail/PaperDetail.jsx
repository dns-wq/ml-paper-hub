import { useState, useEffect } from 'react';
import { Book, Brain, FlaskConical, HelpCircle, MessageCircle, ExternalLink, Target, Check, Loader2 } from 'lucide-react';
import DifficultyStars from '../common/DifficultyStars.jsx';
import SummaryTab from './SummaryTab.jsx';
import TheoryTab from './TheoryTab.jsx';
import FindingsTab from './FindingsTab.jsx';
import QuizTab from './QuizTab.jsx';
import QuestionsTab from './QuestionsTab.jsx';

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
  setProgress
}) {
  const [activeTab, setActiveTab] = useState('summary');
  const paperProgress = progress[paper.id] || {};

  useEffect(() => {
    if (!content[activeTab] && activeTab !== 'quiz' && activeTab !== 'questions') {
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

  const renderContent = () => {
    if (isGenerating && activeTab !== 'questions') {
      return (
        <div className="loading-state">
          <Loader2 className="spin" size={32} />
          <p>Generating content...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'summary':
        return (
          <SummaryTab
            content={content.summary}
            onGenerate={() => generateContent(paper, 'summary')}
          />
        );
      case 'theory':
        return (
          <TheoryTab
            content={content.theory}
            isGenerating={isGenerating}
            onGenerate={() => generateContent(paper, 'theory')}
            onLoadMore={() => generateContent(paper, 'theory', true)}
          />
        );
      case 'findings':
        return (
          <FindingsTab
            content={content.findings}
            isGenerating={isGenerating}
            onGenerate={() => generateContent(paper, 'findings')}
            onLoadMore={() => generateContent(paper, 'findings', true)}
          />
        );
      case 'quiz':
        return (
          <QuizTab
            quiz={content.quiz}
            quizState={quizState}
            isGenerating={isGenerating}
            onGenerate={() => generateContent(paper, 'quiz')}
            onLoadMore={() => generateContent(paper, 'quiz', true)}
            onSetAnswer={setAnswer}
            onSubmit={() => handleQuizSubmit(content.quiz, paper.id, progress, setProgress)}
            onReset={resetQuiz}
          />
        );
      case 'questions':
        return (
          <QuestionsTab
            chatMessages={chatMessages}
            chatInput={chatInput}
            isChatLoading={isChatLoading}
            chatEndRef={chatEndRef}
            onInputChange={setChatInput}
            onSubmit={(q) => askQuestion(paper, q)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="paper-detail">
      <button className="back-btn" onClick={handleBack}>
        &larr; Back to Papers
      </button>

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
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
          <Book size={16} /> Summary
        </button>
        <button className={activeTab === 'theory' ? 'active' : ''} onClick={() => setActiveTab('theory')}>
          <Brain size={16} /> Theory
        </button>
        <button className={activeTab === 'findings' ? 'active' : ''} onClick={() => setActiveTab('findings')}>
          <FlaskConical size={16} /> Findings
        </button>
        <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => { setActiveTab('quiz'); resetQuiz(); }}>
          <HelpCircle size={16} /> Quiz
        </button>
        <button className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>
          <MessageCircle size={16} /> Questions
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}
