import { useMemo } from 'react';
import { ArrowLeft, Trophy, Target, BookOpen, Brain, TrendingUp } from 'lucide-react';
import { DIFFICULTY_LABELS } from '../data/papers.js';

export default function ProgressDashboard({ papers, progress, generatedContent, onBack }) {
  const stats = useMemo(() => {
    const completed = [];
    const inProgress = [];
    const notStarted = [];
    let totalScore = 0;
    let quizCount = 0;

    papers.forEach(paper => {
      const p = progress[paper.id];
      const content = generatedContent[paper.id];
      const hasContent = content && Object.keys(content).length > 0;

      if (p?.completed) {
        completed.push(paper);
      } else if (hasContent || p?.bestScore !== undefined) {
        inProgress.push(paper);
      } else {
        notStarted.push(paper);
      }

      if (p?.bestScore !== undefined) {
        totalScore += p.bestScore;
        quizCount++;
      }
    });

    // Content stats
    let summaries = 0, theories = 0, findings = 0, dnas = 0, claims = 0, quizzes = 0;
    Object.values(generatedContent).forEach(c => {
      if (c.summary) summaries++;
      if (c.theory) theories++;
      if (c.findings) findings++;
      if (c.dna) dnas++;
      if (c.claims) claims++;
      if (c.quiz) quizzes++;
    });

    // Difficulty distribution
    const byDifficulty = {};
    papers.forEach(p => {
      const d = p.difficulty;
      if (!byDifficulty[d]) byDifficulty[d] = { total: 0, completed: 0 };
      byDifficulty[d].total++;
      if (progress[p.id]?.completed) byDifficulty[d].completed++;
    });

    return {
      completed, inProgress, notStarted,
      avgScore: quizCount > 0 ? Math.round(totalScore / quizCount) : 0,
      quizCount,
      summaries, theories, findings, dnas, claims, quizzes,
      byDifficulty,
      completionRate: papers.length > 0 ? Math.round((completed.length / papers.length) * 100) : 0
    };
  }, [papers, progress, generatedContent]);

  return (
    <div className="dashboard">
      <button className="back-btn" onClick={onBack}>&larr; Back to Papers</button>
      <h2 className="dashboard-title"><TrendingUp size={22} /> Study Progress</h2>

      <div className="dashboard-overview">
        <div className="dash-card">
          <div className="dash-card-value">{stats.completionRate}%</div>
          <div className="dash-card-label">Completion Rate</div>
          <div className="dash-progress-bar">
            <div className="dash-progress-fill" style={{ width: `${stats.completionRate}%` }} />
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-value">{stats.completed.length}</div>
          <div className="dash-card-label">Papers Completed</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-value">{stats.avgScore}%</div>
          <div className="dash-card-label">Average Quiz Score</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-value">{stats.quizCount}</div>
          <div className="dash-card-label">Quizzes Taken</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dash-section">
          <h3>Content Generated</h3>
          <div className="dash-content-stats">
            <div className="dash-content-item">
              <span className="dash-content-count">{stats.summaries}</span>
              <span>Summaries</span>
            </div>
            <div className="dash-content-item">
              <span className="dash-content-count">{stats.theories}</span>
              <span>Theory Analyses</span>
            </div>
            <div className="dash-content-item">
              <span className="dash-content-count">{stats.findings}</span>
              <span>Findings</span>
            </div>
            <div className="dash-content-item">
              <span className="dash-content-count">{stats.dnas}</span>
              <span>Paper DNAs</span>
            </div>
            <div className="dash-content-item">
              <span className="dash-content-count">{stats.claims}</span>
              <span>Claim Maps</span>
            </div>
            <div className="dash-content-item">
              <span className="dash-content-count">{stats.quizzes}</span>
              <span>Quizzes</span>
            </div>
          </div>
        </div>

        <div className="dash-section">
          <h3>By Difficulty</h3>
          <div className="dash-difficulty-bars">
            {Object.entries(DIFFICULTY_LABELS).map(([level, label]) => {
              const data = stats.byDifficulty[level] || { total: 0, completed: 0 };
              if (data.total === 0) return null;
              const pct = Math.round((data.completed / data.total) * 100);
              return (
                <div key={level} className="dash-diff-row">
                  <span className="dash-diff-label">{label}</span>
                  <div className="dash-diff-bar">
                    <div className="dash-diff-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="dash-diff-count">{data.completed}/{data.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {stats.inProgress.length > 0 && (
          <div className="dash-section">
            <h3>In Progress ({stats.inProgress.length})</h3>
            <div className="dash-paper-list">
              {stats.inProgress.map(paper => (
                <div key={paper.id} className="dash-paper-item">
                  <span className="dash-paper-title">{paper.title}</span>
                  {progress[paper.id]?.bestScore !== undefined && (
                    <span className="dash-paper-score">Best: {progress[paper.id].bestScore}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.completed.length > 0 && (
          <div className="dash-section">
            <h3>Completed ({stats.completed.length})</h3>
            <div className="dash-paper-list">
              {stats.completed.map(paper => (
                <div key={paper.id} className="dash-paper-item completed">
                  <Trophy size={14} />
                  <span className="dash-paper-title">{paper.title}</span>
                  <span className="dash-paper-score">{progress[paper.id]?.bestScore}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
