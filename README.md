# Paper Hub

An interactive study tool for ML, CS, and STEM research papers. AI-powered summaries, deep study features, and multilingual support.

**Paper Hub is not another "chat with your PDF" tool.** It's designed for *active study* — testing your understanding, analyzing claims critically, exploring design decisions, and building deep comprehension of academic papers.

## Features

### Study Tools (per paper)
- **Summary / Theory / Findings** — AI-generated overviews with "load more" pagination
- **Paper DNA** — Structured extraction of key concepts, methods, datasets, metrics, prerequisites, and contributions as tagged chips
- **Feynman Mode** — Explain concepts in your own words; AI evaluates accuracy, completeness, and clarity
- **Claim Extractor** — Maps every paper claim to its evidence strength (empirical / cited / assumed / speculative)
- **Ablation Explorer** — Analyzes key design decisions with "what if?" counterfactual reasoning
- **Quiz** — Generated quizzes with multiple choice, true/false, and fill-in-the-blank questions
- **Q&A** — Ask questions with citation-aware answers
- **Comparison Mode** — Side-by-side analysis of two papers

### Paper Discovery
- **Multi-source search** — Semantic Scholar (225M+ papers), OpenAlex (450M+ works), DBLP (CS conferences including CCF-ranked Chinese venues)
- **URL import** — Paste an arXiv or Semantic Scholar URL, auto-fetch metadata
- **Manual entry** — Add any paper by hand

### Library Management
- Search, filter by difficulty/source, sort by category/title/year
- Reading list tags (Ilya's List, Karpathy's List, user-created)
- Progress tracking with quiz scores
- JSON export/import for backup and sharing

### Internationalization
7 languages: English, Simplified Chinese, Traditional Chinese, French, Spanish, Japanese, Korean. AI-generated content responds in the user's selected language.

### Themes
Light mode (default) and dark mode with an academic, clean design.

## Quick Start

```bash
git clone https://github.com/dns-wq/ml-paper-hub.git
cd ml-paper-hub
cp .env.example .env    # Add your Anthropic API key
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### API Key

Paper Hub uses the Anthropic Claude API for AI features. Get an API key at [console.anthropic.com](https://console.anthropic.com/) and add it to `.env`:

```
VITE_ANTHROPIC_API_KEY=your-key-here
```

The key is injected server-side via Vite's dev proxy — it never reaches the browser.

## Architecture

```
src/
  App.jsx                          # Root component, state management
  components/
    Header.jsx                     # Stats, actions, theme/language toggles
    SearchBar.jsx                  # Library search + filter panel
    AddPaperModal.jsx              # Multi-source paper search + import
    CompareView.jsx                # Side-by-side paper comparison
    ThemeToggle.jsx                # Light/dark mode
    LanguagePicker.jsx             # 7-language dropdown
    PaperList/                     # Category groups + paper cards
    PaperDetail/                   # 9 study tabs (Summary, Theory, Findings,
                                   #   DNA, Claims, What If?, Feynman, Quiz, Q&A)
    common/                        # Shared components
  data/papers.js                   # 34 built-in papers from Ilya + Karpathy lists
  services/
    api.js                         # Claude API wrapper + prompt builders
    paperImport.js                 # arXiv, Semantic Scholar, OpenAlex, DBLP
    storage.js                     # localStorage utility
  hooks/                           # usePersistedState, usePaperContent, useQuiz, useChat
  i18n/                            # react-i18next config + 7 locale files
  styles/
    variables.css                  # Theme tokens (light + dark)
    App.css                        # All component styles
```

**Stack:** React 19, Vite 6, react-i18next, Lucide icons. No backend — fully client-side with a Vite dev proxy for API calls.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and contribution guidelines.

## License

MIT
