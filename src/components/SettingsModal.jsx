import { useState } from 'react';
import { Key, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsModal({ onClose }) {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState(localStorage.getItem('anthropic_api_key') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('anthropic_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('anthropic_api_key');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('anthropic_api_key');
    setApiKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="settings-section">
          <label className="settings-label">
            <Key size={14} /> Anthropic API Key
          </label>
          <p className="settings-hint">
            Required for AI features (summaries, quizzes, Feynman mode, etc.). Get a key at{' '}
            <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">console.anthropic.com</a>.
          </p>
          <input
            type="password"
            className="settings-input"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <div className="settings-actions">
            <button className="add-paper-btn" onClick={handleSave}>
              {saved ? 'Saved!' : 'Save Key'}
            </button>
            {apiKey && (
              <button className="delete-btn" onClick={handleClear}>
                Clear Key
              </button>
            )}
          </div>
          <div className="settings-security">
            <AlertTriangle size={12} />
            <span>Your key is stored locally in your browser and sent directly to Anthropic. It is never sent to any other server.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
