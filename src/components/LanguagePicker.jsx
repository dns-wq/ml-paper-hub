import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'zh', label: '简中', full: '简体中文' },
  { code: 'zh-TW', label: '繁中', full: '繁體中文' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'ja', label: 'JA', full: '日本語' },
  { code: 'ko', label: 'KO', full: '한국어' },
];

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setOpen(false);
  };

  return (
    <div className="lang-picker-wrapper">
      <button className="lang-picker-btn" onClick={() => setOpen(!open)}>
        <Globe size={14} />
        <span>{current.label}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="lang-picker-backdrop" onClick={() => setOpen(false)} />
          <div className="lang-picker-dropdown">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                className={`lang-dropdown-item ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => handleChange(lang.code)}
              >
                <span className="lang-code">{lang.label}</span>
                <span className="lang-full">{lang.full}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
