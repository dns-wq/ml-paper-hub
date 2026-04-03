import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
];

export default function LanguagePicker() {
  const { i18n } = useTranslation();

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="lang-picker">
      <Globe size={14} />
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => handleChange(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
