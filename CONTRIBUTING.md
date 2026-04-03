# Contributing to Paper Hub

Thank you for your interest in contributing! This guide will help you get set up.

## Development Setup

```bash
git clone https://github.com/dns-wq/ml-paper-hub.git
cd ml-paper-hub
cp .env.example .env    # Add your Anthropic API key
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server proxies API calls to Anthropic, arXiv, Semantic Scholar, OpenAlex, and DBLP.

## Project Structure

- `src/components/` — React components, organized by feature
- `src/services/api.js` — Claude API wrapper and all prompt templates
- `src/services/paperImport.js` — Multi-source paper search and metadata fetching
- `src/data/papers.js` — Built-in paper list
- `src/i18n/locales/` — Translation files (one JSON per language)
- `src/styles/` — CSS variables (themes) and component styles

## How to Contribute

### Adding Papers to the Default List
Edit `src/data/papers.js`. Each paper needs: `id`, `title`, `authors`, `year`, `category`, `difficulty` (1-5), `url`, `source`, `abstract`.

### Adding a New Language
1. Copy `src/i18n/locales/en.json` to `src/i18n/locales/{code}.json`
2. Translate all values (keep JSON keys in English)
3. Add the import + registration in `src/i18n/index.js`
4. Add the language to `LANGUAGES` in `src/components/LanguagePicker.jsx`
5. Add the language name to `LANGUAGE_NAMES` in `src/services/api.js`

### Adding a New Study Tab
1. Create a component in `src/components/PaperDetail/`
2. Add the prompt builder in `src/services/api.js`
3. Wire it into `PaperDetail.jsx` (import, tab button, render case)
4. Add styles to `src/styles/App.css`

### Adding a New Search Provider
1. Add a proxy route in `vite.config.js`
2. Add a search function in `src/services/paperImport.js`
3. Add the provider to `SEARCH_PROVIDERS` in `AddPaperModal.jsx`

## Code Conventions

- Components are functional with hooks (no class components)
- State that persists across sessions uses `usePersistedState` (localStorage)
- CSS uses custom properties defined in `variables.css` — no hardcoded colors
- Both light and dark themes must be supported for any new styles
- UI strings go in locale files, not hardcoded in components

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Test in both light and dark mode
4. Verify the app builds cleanly: `npm run build`
5. Open a PR with a clear description of what changed and why

## Issues

Use GitHub Issues for bug reports and feature requests. Please include:
- What you expected to happen
- What actually happened
- Browser and OS version
- Screenshots if relevant
