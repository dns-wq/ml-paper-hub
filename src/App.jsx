import { useState, useMemo } from 'react';
import { INITIAL_PAPERS } from './data/papers.js';
import usePersistedState from './hooks/usePersistedState.js';
import usePaperContent from './hooks/usePaperContent.js';
import useQuiz from './hooks/useQuiz.js';
import useChat from './hooks/useChat.js';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import PaperList from './components/PaperList/PaperList.jsx';
import PaperDetail from './components/PaperDetail/PaperDetail.jsx';
import AddPaperModal from './components/AddPaperModal.jsx';

const DEFAULT_FILTERS = { query: '', difficulty: [], source: [], sort: 'category' };

export default function App() {
  const [papers, setPapers] = usePersistedState('papers', INITIAL_PAPERS);
  const [progress, setProgress] = usePersistedState('progress', {});
  const [generatedContent, setGeneratedContent] = usePersistedState('generatedContent', {});
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { isGenerating, generateContent } = usePaperContent(generatedContent, setGeneratedContent);
  const { quizState, setAnswer, handleQuizSubmit, resetQuiz } = useQuiz();
  const { chatMessages, chatInput, setChatInput, isChatLoading, chatEndRef, resetChat, askQuestion } = useChat(generatedContent);

  // Apply filters and search
  const filteredPapers = useMemo(() => {
    let result = [...papers];

    // Text search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        (p.abstract && p.abstract.toLowerCase().includes(q))
      );
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      result = result.filter(p => filters.difficulty.includes(p.difficulty));
    }

    // Source filter
    if (filters.source.length > 0) {
      result = result.filter(p => filters.source.includes(p.source));
    }

    // Sort
    switch (filters.sort) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'difficulty':
        result.sort((a, b) => a.difficulty - b.difficulty);
        break;
      default: // 'category' — sort by difficulty within groups
        result.sort((a, b) => a.difficulty - b.difficulty);
    }

    return result;
  }, [papers, filters]);

  // Group papers by category (only for category sort mode)
  const groupedPapers = useMemo(() => {
    if (filters.sort !== 'category') {
      return { 'All Papers': filteredPapers };
    }
    const groups = {};
    filteredPapers.forEach(paper => {
      if (!groups[paper.category]) groups[paper.category] = [];
      groups[paper.category].push(paper);
    });
    return groups;
  }, [filteredPapers, filters.sort]);

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

  const handleDeletePaper = (paperId) => {
    setPapers(prev => prev.filter(p => p.id !== paperId));
    setProgress(prev => {
      const next = { ...prev };
      delete next[paperId];
      return next;
    });
    setGeneratedContent(prev => {
      const next = { ...prev };
      delete next[paperId];
      return next;
    });
  };

  const handleExport = () => {
    const data = { papers, progress, generatedContent, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ml-paper-hub-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.papers) {
          // Merge: add papers that don't already exist
          setPapers(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPapers = data.papers.filter(p => !existingIds.has(p.id));
            return [...prev, ...newPapers];
          });
        }
        if (data.progress) {
          setProgress(prev => ({ ...prev, ...data.progress }));
        }
        if (data.generatedContent) {
          setGeneratedContent(prev => ({ ...prev, ...data.generatedContent }));
        }
      } catch {
        alert('Invalid export file.');
      }
    };
    reader.readAsText(file);
  };

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
          onDelete={handleDeletePaper}
          setProgress={setProgress}
          onUpdateContent={(paperId, field, value) => {
            setGeneratedContent(prev => ({
              ...prev,
              [paperId]: { ...prev[paperId], [field]: value }
            }));
          }}
        />
      ) : (
        <>
          <Header
            stats={stats}
            onAddPaper={() => setShowAddModal(true)}
            onExport={handleExport}
            onImport={handleImport}
          />
          <SearchBar filters={filters} onFiltersChange={setFilters} />
          <PaperList
            groupedPapers={groupedPapers}
            progress={progress}
            onSelectPaper={setSelectedPaper}
            resultCount={filteredPapers.length}
            totalCount={papers.length}
            isFiltered={filters.query || filters.difficulty.length > 0 || filters.source.length > 0}
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
