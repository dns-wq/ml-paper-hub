/**
 * Paper import service — fetches metadata from arXiv and Semantic Scholar APIs.
 *
 * arXiv API: Free, no key needed, returns XML. Good for arxiv URLs.
 * Semantic Scholar API: Free (rate-limited), returns JSON with citation data.
 */

// In dev, use Vite proxy to avoid CORS. In production, call APIs directly.
const isDev = import.meta.env.DEV;
const ARXIV_BASE = isDev ? '/api/arxiv' : 'https://export.arxiv.org';
const S2_BASE = isDev ? '/api/s2' : 'https://api.semanticscholar.org';
const OPENALEX_BASE = isDev ? '/api/openalex' : 'https://api.openalex.org';
const DBLP_BASE = isDev ? '/api/dblp' : 'https://dblp.org';

function extractArxivId(url) {
  // Matches: arxiv.org/abs/1706.03762, arxiv.org/pdf/1706.03762, arxiv.org/abs/1706.03762v3
  const match = url.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5}(?:v\d+)?)/);
  return match ? match[1].replace(/v\d+$/, '') : null;
}

function generatePaperId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

export async function fetchArxivMetadata(url) {
  const arxivId = extractArxivId(url);
  if (!arxivId) return null;

  const apiUrl = `${ARXIV_BASE}/api/query?id_list=${arxivId}`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`arXiv API error: ${response.status}`);

  const xml = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const entry = doc.querySelector('entry');
  if (!entry) throw new Error('Paper not found on arXiv');

  const title = entry.querySelector('title')?.textContent?.trim().replace(/\s+/g, ' ');
  if (!title || title === 'Error') throw new Error('Paper not found on arXiv');

  const authors = Array.from(entry.querySelectorAll('author name'))
    .map(n => n.textContent.trim());
  const abstract = entry.querySelector('summary')?.textContent?.trim().replace(/\s+/g, ' ');
  const published = entry.querySelector('published')?.textContent;
  const year = published ? new Date(published).getFullYear() : new Date().getFullYear();

  // Extract arXiv categories for auto-categorization
  const categories = Array.from(entry.querySelectorAll('category'))
    .map(c => c.getAttribute('term'));

  return {
    id: generatePaperId(title),
    title,
    authors: formatAuthors(authors),
    year,
    abstract: abstract || '',
    url: `https://arxiv.org/abs/${arxivId}`,
    arxivId,
    arxivCategories: categories,
    category: guessCategory(categories, title, abstract),
    difficulty: 3,
    source: 'user',
  };
}

export async function fetchSemanticScholarMetadata(url) {
  // Try paper lookup by URL, arXiv ID, or DOI
  const arxivId = extractArxivId(url);
  let apiUrl;

  if (arxivId) {
    apiUrl = `${S2_BASE}/graph/v1/paper/ARXIV:${arxivId}`;
  } else {
    apiUrl = `${S2_BASE}/graph/v1/paper/URL:${encodeURIComponent(url)}`;
  }

  const fields = 'title,authors,abstract,year,citationCount,referenceCount,fieldsOfStudy,externalIds';
  const response = await fetch(`${apiUrl}?fields=${fields}`);
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.title) return null;

  const authors = (data.authors || []).map(a => a.name);

  return {
    id: generatePaperId(data.title),
    title: data.title,
    authors: formatAuthors(authors),
    year: data.year || new Date().getFullYear(),
    abstract: data.abstract || '',
    url: arxivId ? `https://arxiv.org/abs/${arxivId}` : url,
    arxivId: data.externalIds?.ArXiv || null,
    semanticScholarId: data.paperId || null,
    citationCount: data.citationCount,
    referenceCount: data.referenceCount,
    fieldsOfStudy: data.fieldsOfStudy || [],
    category: guessCategory(data.fieldsOfStudy || [], data.title, data.abstract),
    difficulty: 3,
    source: 'user',
  };
}

/**
 * Main import function — tries arXiv first, falls back to Semantic Scholar.
 */
export async function importPaper(url) {
  const trimmedUrl = url.trim();

  // Try arXiv first for arxiv URLs
  if (trimmedUrl.includes('arxiv.org')) {
    try {
      const paper = await fetchArxivMetadata(trimmedUrl);
      if (paper) {
        // Enrich with Semantic Scholar data (citation counts, etc.)
        try {
          const s2Data = await fetchSemanticScholarMetadata(trimmedUrl);
          if (s2Data) {
            paper.semanticScholarId = s2Data.semanticScholarId;
            paper.citationCount = s2Data.citationCount;
            paper.referenceCount = s2Data.referenceCount;
            paper.fieldsOfStudy = s2Data.fieldsOfStudy;
          }
        } catch {
          // S2 enrichment is optional
        }
        return paper;
      }
    } catch (e) {
      console.warn('arXiv fetch failed, trying Semantic Scholar:', e.message);
    }
  }

  // Fallback to Semantic Scholar for any URL
  const paper = await fetchSemanticScholarMetadata(trimmedUrl);
  if (paper) return paper;

  throw new Error('Could not fetch paper metadata. Please enter details manually.');
}

/**
 * Multi-source paper search. Searches the selected provider.
 * Providers: 'semantic_scholar', 'openalex', 'dblp'
 */
export async function searchPapers(query, provider = 'semantic_scholar') {
  switch (provider) {
    case 'openalex': return searchOpenAlex(query);
    case 'dblp': return searchDblp(query);
    case 'semantic_scholar':
    default: return searchSemanticScholar(query);
  }
}

async function searchSemanticScholar(query) {
  const params = new URLSearchParams({
    query,
    limit: '10',
    fields: 'title,authors,abstract,year,citationCount,externalIds,fieldsOfStudy'
  });

  const response = await fetch(`${S2_BASE}/graph/v1/paper/search?${params}`);
  if (!response.ok) throw new Error(`Semantic Scholar search failed: ${response.status}`);

  const data = await response.json();
  if (!data.data?.length) return [];

  return data.data.map(paper => ({
    id: generatePaperId(paper.title),
    title: paper.title,
    authors: formatAuthors((paper.authors || []).map(a => a.name)),
    year: paper.year || null,
    abstract: paper.abstract || '',
    url: paper.externalIds?.ArXiv
      ? `https://arxiv.org/abs/${paper.externalIds.ArXiv}`
      : `https://www.semanticscholar.org/paper/${paper.paperId}`,
    arxivId: paper.externalIds?.ArXiv || null,
    semanticScholarId: paper.paperId || null,
    citationCount: paper.citationCount,
    fieldsOfStudy: paper.fieldsOfStudy || [],
    category: guessCategory(paper.fieldsOfStudy || [], paper.title, paper.abstract),
    difficulty: 3,
    source: 'user',
    _provider: 'Semantic Scholar',
  }));
}

async function searchOpenAlex(query) {
  const params = new URLSearchParams({
    search: query,
    per_page: '10',
    select: 'id,title,authorships,publication_year,cited_by_count,primary_location,abstract_inverted_index,concepts,language'
  });

  const response = await fetch(`${OPENALEX_BASE}/works?${params}`);
  if (!response.ok) throw new Error(`OpenAlex search failed: ${response.status}`);

  const data = await response.json();
  if (!data.results?.length) return [];

  return data.results.map(work => {
    const authors = (work.authorships || []).map(a => a.author?.display_name).filter(Boolean);
    const abstract = invertedIndexToText(work.abstract_inverted_index);
    const concepts = (work.concepts || []).map(c => c.display_name);
    const url = work.primary_location?.landing_page_url || work.id;

    return {
      id: generatePaperId(work.title || 'untitled'),
      title: work.title || 'Untitled',
      authors: formatAuthors(authors),
      year: work.publication_year || null,
      abstract,
      url,
      citationCount: work.cited_by_count,
      category: guessCategory(concepts, work.title || '', abstract),
      difficulty: 3,
      source: 'user',
      language: work.language || null,
      _provider: 'OpenAlex',
    };
  });
}

async function searchDblp(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    h: '10', // max results
  });

  const response = await fetch(`${DBLP_BASE}/search/publ/api?${params}`);
  if (!response.ok) throw new Error(`DBLP search failed: ${response.status}`);

  const data = await response.json();
  const hits = data.result?.hits?.hit;
  if (!hits?.length) return [];

  return hits.map(hit => {
    const info = hit.info || {};
    const authors = Array.isArray(info.authors?.author)
      ? info.authors.author.map(a => typeof a === 'string' ? a : a.text)
      : info.authors?.author ? [typeof info.authors.author === 'string' ? info.authors.author : info.authors.author.text] : [];

    const venue = info.venue || '';
    const title = info.title?.replace(/\.$/, '') || 'Untitled';

    return {
      id: generatePaperId(title),
      title,
      authors: formatAuthors(authors),
      year: info.year ? parseInt(info.year) : null,
      abstract: '', // DBLP doesn't provide abstracts
      url: info.ee || info.url || '',
      venue,
      category: guessCategory([], title, venue),
      difficulty: 3,
      source: 'user',
      _provider: 'DBLP',
    };
  });
}

/**
 * Convert OpenAlex inverted abstract index to plain text.
 * OpenAlex stores abstracts as {word: [positions]} for compression.
 */
function invertedIndexToText(invertedIndex) {
  if (!invertedIndex) return '';
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.join(' ');
}

// --- Helpers ---

function formatAuthors(authors) {
  if (!authors.length) return 'Unknown';
  if (authors.length <= 3) return authors.join(', ');
  return `${authors[0]} et al.`;
}

const CATEGORY_MAP = {
  // arXiv categories → app categories
  'cs.CL': 'Language Models',
  'cs.LG': 'Theory',
  'cs.CV': 'Computer Vision',
  'cs.AI': 'Reasoning',
  'cs.NE': 'Theory',
  'cs.IR': 'Retrieval',
  'cs.SD': 'Speech',
  'cs.MA': 'Reinforcement Learning',
  'stat.ML': 'Theory',
  // Semantic Scholar fields → app categories
  'Computer Science': 'Language Models',
  'Mathematics': 'Theory',
  'Physics': 'Theory',
  'Biology': 'Theory',
};

const KEYWORD_CATEGORIES = [
  { keywords: ['transformer', 'attention mechanism', 'self-attention'], category: 'Transformers' },
  { keywords: ['attention'], category: 'Attention Mechanisms' },
  { keywords: ['recurrent', 'rnn', 'lstm', 'gru'], category: 'Recurrent Networks' },
  { keywords: ['language model', 'gpt', 'bert', 'llm'], category: 'Language Models' },
  { keywords: ['scaling law', 'scaling'], category: 'Scaling' },
  { keywords: ['image', 'visual', 'convolutional', 'cnn', 'vision'], category: 'Computer Vision' },
  { keywords: ['sequence', 'seq2seq'], category: 'Sequence Models' },
  { keywords: ['memory', 'neural turing'], category: 'Memory Networks' },
  { keywords: ['reasoning', 'relational'], category: 'Reasoning' },
  { keywords: ['graph neural', 'graph network', 'message passing'], category: 'Graph Networks' },
  { keywords: ['generative', 'vae', 'gan', 'diffusion'], category: 'Generative Models' },
  { keywords: ['speech', 'audio'], category: 'Speech' },
  { keywords: ['retrieval', 'dense passage', 'rag'], category: 'Retrieval' },
  { keywords: ['alignment', 'rlhf', 'dpo', 'instruction'], category: 'Alignment' },
  { keywords: ['reinforcement learning', 'reward', 'policy gradient'], category: 'Reinforcement Learning' },
  { keywords: ['multimodal', 'vision-language'], category: 'Multimodal' },
];

function guessCategory(fieldsOrCategories, title = '', abstract = '') {
  // Try direct mapping from arXiv categories or S2 fields
  for (const field of fieldsOrCategories) {
    if (CATEGORY_MAP[field]) return CATEGORY_MAP[field];
  }

  // Try keyword matching on title + abstract
  const text = `${title} ${abstract}`.toLowerCase();
  for (const { keywords, category } of KEYWORD_CATEGORIES) {
    if (keywords.some(kw => text.includes(kw))) return category;
  }

  return 'Language Models'; // default
}
