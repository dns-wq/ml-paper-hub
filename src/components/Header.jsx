import { useRef } from 'react';
import { BookOpen, Plus, Download, Upload, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle.jsx';
import LanguagePicker from './LanguagePicker.jsx';

export default function Header({ stats, onAddPaper, onExport, onImport, theme, onToggleTheme, onSettings, onShowDashboard }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <header className="header">
      <h1><BookOpen size={22} /> {t('app.title')}</h1>
      <div className="header-right">
        <div className="stats-bar clickable" onClick={onShowDashboard} title="View progress dashboard">
          <div className="stat">
            <div className="stat-value">{stats.completed}/{stats.total}</div>
            <div className="stat-label">{t('header.completed')}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-label">{t('header.avgScore')}</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.quizzesTaken}</div>
            <div className="stat-label">{t('header.quizzes')}</div>
          </div>
        </div>
        <div className="header-actions">
          <LanguagePicker />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="icon-btn" onClick={onSettings} title="Settings">
            <Settings size={16} />
          </button>
          <button className="icon-btn" onClick={onExport} title={t('header.export')}>
            <Download size={16} />
          </button>
          <button className="icon-btn" onClick={handleImportClick} title={t('header.import')}>
            <Upload size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="add-paper-btn" onClick={onAddPaper}>
            <Plus size={16} /> {t('header.addPaper')}
          </button>
        </div>
      </div>
    </header>
  );
}
