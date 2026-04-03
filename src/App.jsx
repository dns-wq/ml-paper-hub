import { useState, useMemo } from 'react';
import { INITIAL_PAPERS } from './data/papers.js';
import usePersistedState from './hooks/usePersistedState.js';
import usePaperContent from './hooks/usePaperContent.js';
import useQuiz from './hooks/useQuiz.js';
import useChat from './hooks/useChat.js';
import Header from './components/Header.jsx';
import PaperList from './components/PaperList/PaperList.jsx';
import PaperDetail from './components/PaperDetail/PaperDetail.jsx';
import AddPaperModal from './components/AddPaperModal.jsx';

export default function App() {
  const [papers, setPapers] = usePersistedState('papers', INITIAL_PAPERS);
  const [progress, setProgress] = usePersistedState('progress', {});
  const [generatedContent, setGeneratedContent] = usePersistedState('generatedContent', {});
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { isGenerating, generateContent } = usePaperContent(generatedContent, setGeneratedContent);
  const { quizState, setAnswer, handleQuizSubmit, resetQuiz } = useQuiz();
  const { chatMessages, chatInput, setChatInput, isChatLoading, chatEndRef, resetChat, askQuestion } = useChat(generatedContent);

  const groupedPapers = useMemo(() => {
    const sorted = [...papers].sort((a, b) => a.difficulty - b.difficulty);
    const groups = {};
    sorted.forEach(paper => {
      if (!groups[paper.category]) groups[paper.category] = [];
      groups[paper.category].push(paper);
    });
    return groups;
  }, [papers]);

  const stats = useMemo(() => {
    const completed = Object.values(progress).filter(p => p.completed).length;
    const totalScore = Object.values(progress).reduce((sum, p) => sum + (p.bestScore || 0), 0);
    const quizzesTaken = Object.values(progress).filter(p => p.bestScore !== undefined).length;
    return {
      completed,
      total: papers.length,
      avgScore: quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0,
      quizzesTaken
    };
  }, [progress, papers]);

  return (
    <div className="app">
      {selectedPaper ? (
        <PaperDetail
          paper={selectedPaper}
          content={generatedContent[selectedPaper.id] || {}}
          progress={progress}
          isGenerating={isGenerating}
          generateContent={generateContent}
          quizState={quizState}
          setAnswer={setAnswer}
          handleQuizSubmit={handleQuizSubmit}
          resetQuiz={resetQuiz}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isChatLoading={isChatLoading}
          chatEndRef={chatEndRef}
          askQuestion={askQuestion}
          resetChat={resetChat}
          onBack={() => setSelectedPaper(null)}
          setProgress={setProgress}
        />
      ) : (
        <>
          <Header stats={stats} onAddPaper={() => setShowAddModal(true)} />
          <PaperList
            groupedPapers={groupedPapers}
            progress={progress}
            onSelectPaper={setSelectedPaper}
          />
        </>
      )}

      {showAddModal && (
        <AddPaperModal
          onAdd={(paper) => setPapers(prev => [...prev, paper])}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
