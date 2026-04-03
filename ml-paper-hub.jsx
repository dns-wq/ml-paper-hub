import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Book, Brain, FlaskConical, HelpCircle, ChevronRight, ChevronDown, Plus, Link, FileText, Check, Star, Loader2, RefreshCw, ExternalLink, Trophy, Target, Sparkles, MessageCircle, Send, Quote, PlusCircle } from 'lucide-react';

// Initial paper data from Ilya's and Karpathy's lists
const INITIAL_PAPERS = [
  // Foundational - Transformers & Attention
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al.',
    year: 2017,
    category: 'Transformers',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1706.03762',
    source: 'ilya',
    abstract: 'Introduces the Transformer architecture, relying entirely on self-attention mechanisms without recurrence or convolutions.'
  },
  {
    id: 'neural-machine-translation-attention',
    title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
    authors: 'Bahdanau, Cho, Bengio',
    year: 2014,
    category: 'Attention Mechanisms',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1409.0473',
    source: 'ilya',
    abstract: 'Introduces the attention mechanism for neural machine translation, allowing models to focus on relevant parts of the input.'
  },
  {
    id: 'unreasonable-effectiveness-rnn',
    title: 'The Unreasonable Effectiveness of Recurrent Neural Networks',
    authors: 'Andrej Karpathy',
    year: 2015,
    category: 'Recurrent Networks',
    difficulty: 2,
    url: 'https://karpathy.github.io/2015/05/21/rnn-effectiveness/',
    source: 'ilya',
    abstract: 'Blog post demonstrating the surprising power of RNNs for character-level language modeling across various domains.'
  },
  {
    id: 'understanding-lstm',
    title: 'Understanding LSTM Networks',
    authors: 'Christopher Olah',
    year: 2015,
    category: 'Recurrent Networks',
    difficulty: 2,
    url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/',
    source: 'ilya',
    abstract: 'Visual explanation of LSTM architecture and how it solves the vanishing gradient problem in RNNs.'
  },
  {
    id: 'rnn-regularization',
    title: 'Recurrent Neural Network Regularization',
    authors: 'Zaremba, Sutskever, Vinyals',
    year: 2014,
    category: 'Recurrent Networks',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1409.2329',
    source: 'ilya',
    abstract: 'Presents dropout techniques specifically designed for RNNs to prevent overfitting.'
  },
  {
    id: 'scaling-laws',
    title: 'Scaling Laws for Neural Language Models',
    authors: 'Kaplan et al. (OpenAI)',
    year: 2020,
    category: 'Scaling',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2001.08361',
    source: 'both',
    abstract: 'Empirical study showing power-law relationships between model performance and size, data, and compute.'
  },
  {
    id: 'gpipe',
    title: 'GPipe: Easy Scaling with Micro-Batch Pipeline Parallelism',
    authors: 'Huang et al. (Google)',
    year: 2018,
    category: 'Scaling',
    difficulty: 4,
    url: 'https://arxiv.org/abs/1811.06965',
    source: 'ilya',
    abstract: 'Introduces pipeline parallelism for training very large neural networks across multiple accelerators.'
  },
  {
    id: 'alexnet',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    authors: 'Krizhevsky, Sutskever, Hinton',
    year: 2012,
    category: 'Computer Vision',
    difficulty: 2,
    url: 'https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
    source: 'ilya',
    abstract: 'The AlexNet paper that sparked the deep learning revolution by winning ImageNet 2012.'
  },
  {
    id: 'resnet',
    title: 'Deep Residual Learning for Image Recognition',
    authors: 'He et al. (Microsoft)',
    year: 2015,
    category: 'Computer Vision',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1512.03385',
    source: 'ilya',
    abstract: 'Introduces residual connections enabling training of very deep networks (100+ layers).'
  },
  {
    id: 'identity-mappings-resnet',
    title: 'Identity Mappings in Deep Residual Networks',
    authors: 'He et al.',
    year: 2016,
    category: 'Computer Vision',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1603.05027',
    source: 'ilya',
    abstract: 'Analyzes residual networks and proposes improved designs for better gradient flow.'
  },
  {
    id: 'dilated-convolutions',
    title: 'Multi-Scale Context Aggregation by Dilated Convolutions',
    authors: 'Yu, Koltun',
    year: 2015,
    category: 'Computer Vision',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1511.07122',
    source: 'ilya',
    abstract: 'Introduces dilated/atrous convolutions for dense prediction without losing resolution.'
  },
  {
    id: 'gpt2',
    title: 'Language Models are Unsupervised Multitask Learners',
    authors: 'Radford et al. (OpenAI)',
    year: 2019,
    category: 'Language Models',
    difficulty: 2,
    url: 'https://d4mucfpksywv.cloudfront.net/better-language-models/language_models_are_unsupervised_multitask_learners.pdf',
    source: 'karpathy',
    abstract: 'GPT-2 paper showing that language models can perform many tasks zero-shot through next-token prediction.'
  },
  {
    id: 'gpt3',
    title: 'Language Models are Few-Shot Learners',
    authors: 'Brown et al. (OpenAI)',
    year: 2020,
    category: 'Language Models',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2005.14165',
    source: 'karpathy',
    abstract: 'GPT-3 paper demonstrating emergent few-shot learning capabilities at scale.'
  },
  {
    id: 'instructgpt',
    title: 'Training language models to follow instructions with human feedback',
    authors: 'Ouyang et al. (OpenAI)',
    year: 2022,
    category: 'Alignment',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2203.02155',
    source: 'karpathy',
    abstract: 'InstructGPT/RLHF paper showing how to align language models with human intent.'
  },
  {
    id: 'pointer-networks',
    title: 'Pointer Networks',
    authors: 'Vinyals, Fortunato, Jaitly',
    year: 2015,
    category: 'Sequence Models',
    difficulty: 4,
    url: 'https://arxiv.org/abs/1506.03134',
    source: 'ilya',
    abstract: 'Neural architecture that learns to point to elements in the input sequence for variable-length outputs.'
  },
  {
    id: 'order-matters',
    title: 'Order Matters: Sequence to Sequence for Sets',
    authors: 'Vinyals, Bengio, Kudlur',
    year: 2015,
    category: 'Sequence Models',
    difficulty: 4,
    url: 'https://arxiv.org/abs/1511.06391',
    source: 'ilya',
    abstract: 'Explores how input/output ordering affects seq2seq models when dealing with sets.'
  },
  {
    id: 'neural-turing-machines',
    title: 'Neural Turing Machines',
    authors: 'Graves, Wayne, Danihelka',
    year: 2014,
    category: 'Memory Networks',
    difficulty: 5,
    url: 'https://arxiv.org/abs/1410.5401',
    source: 'ilya',
    abstract: 'Combines neural networks with external memory for learning algorithmic tasks.'
  },
  {
    id: 'relational-reasoning',
    title: 'A Simple Neural Network Module for Relational Reasoning',
    authors: 'Santoro et al. (DeepMind)',
    year: 2017,
    category: 'Reasoning',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1706.01427',
    source: 'ilya',
    abstract: 'Introduces Relation Networks for learning to reason about relationships between objects.'
  },
  {
    id: 'relational-rnns',
    title: 'Relational Recurrent Neural Networks',
    authors: 'Santoro et al.',
    year: 2018,
    category: 'Memory Networks',
    difficulty: 4,
    url: 'https://arxiv.org/abs/1806.01822',
    source: 'ilya',
    abstract: 'Extends RNNs with relational memory cores using multi-head attention.'
  },
  {
    id: 'neural-message-passing',
    title: 'Neural Message Passing for Quantum Chemistry',
    authors: 'Gilmer et al.',
    year: 2017,
    category: 'Graph Networks',
    difficulty: 4,
    url: 'https://arxiv.org/abs/1704.01212',
    source: 'ilya',
    abstract: 'Unifying framework for graph neural networks applied to molecular property prediction.'
  },
  {
    id: 'variational-lossy-autoencoder',
    title: 'Variational Lossy Autoencoder',
    authors: 'Chen et al.',
    year: 2016,
    category: 'Generative Models',
    difficulty: 4,
    url: 'https://arxiv.org/abs/1611.02731',
    source: 'ilya',
    abstract: 'Combines VAEs with autoregressive models for controllable representation learning.'
  },
  {
    id: 'mdl-weights',
    title: 'Keeping Neural Networks Simple by Minimizing the Description Length of the Weights',
    authors: 'Hinton, van Camp',
    year: 1993,
    category: 'Theory',
    difficulty: 4,
    url: 'https://www.cs.toronto.edu/~hinton/absps/colt93.pdf',
    source: 'ilya',
    abstract: 'Foundational paper on using MDL principle for neural network regularization.'
  },
  {
    id: 'deep-speech-2',
    title: 'Deep Speech 2: End-to-End Speech Recognition in English and Mandarin',
    authors: 'Amodei et al. (Baidu)',
    year: 2015,
    category: 'Speech',
    difficulty: 3,
    url: 'https://arxiv.org/abs/1512.02595',
    source: 'ilya',
    abstract: 'End-to-end deep learning approach to speech recognition across languages.'
  },
  {
    id: 'complexodynamics',
    title: 'The First Law of Complexodynamics',
    authors: 'Scott Aaronson',
    year: 2011,
    category: 'Complexity Theory',
    difficulty: 5,
    url: 'https://scottaaronson.blog/?p=762',
    source: 'ilya',
    abstract: 'Explores why complexity rises then falls in closed systems, unlike entropy.'
  },
  {
    id: 'coffee-automaton',
    title: 'Quantifying the Rise and Fall of Complexity in Closed Systems: The Coffee Automaton',
    authors: 'Aaronson, Carroll, Ouellette',
    year: 2014,
    category: 'Complexity Theory',
    difficulty: 5,
    url: 'https://arxiv.org/abs/1405.6903',
    source: 'ilya',
    abstract: 'Empirical study of complexity dynamics using cellular automata.'
  },
  {
    id: 'mdl-tutorial',
    title: 'A Tutorial Introduction to the Minimum Description Length Principle',
    authors: 'Peter Grünwald',
    year: 2004,
    category: 'Information Theory',
    difficulty: 4,
    url: 'https://arxiv.org/abs/math/0406077',
    source: 'ilya',
    abstract: 'Comprehensive introduction to MDL for model selection and inference.'
  },
  {
    id: 'machine-superintelligence',
    title: 'Machine Super Intelligence',
    authors: 'Shane Legg',
    year: 2008,
    category: 'AGI Theory',
    difficulty: 4,
    url: 'https://www.vetta.org/documents/Machine_Super_Intelligence.pdf',
    source: 'ilya',
    abstract: 'PhD thesis on formal measures of machine intelligence and paths to superintelligence.'
  },
  {
    id: 'llava',
    title: 'Visual Instruction Tuning (LLaVA)',
    authors: 'Liu et al.',
    year: 2023,
    category: 'Multimodal',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2304.08485',
    source: 'karpathy',
    abstract: 'Large Language and Vision Assistant combining vision encoders with LLMs.'
  },
  {
    id: 'dense-passage-retrieval',
    title: 'Dense Passage Retrieval for Open-Domain Question Answering',
    authors: 'Karpukhin et al. (Facebook)',
    year: 2020,
    category: 'Retrieval',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2004.04906',
    source: 'both',
    abstract: 'Introduces DPR for dense retrieval outperforming sparse methods like BM25.'
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Lewis et al. (Facebook)',
    year: 2020,
    category: 'Retrieval',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2005.11401',
    source: 'both',
    abstract: 'Combines retrieval with generation for knowledge-grounded language models.'
  },
  {
    id: 'zephyr',
    title: 'Zephyr: Direct Distillation of LM Alignment',
    authors: 'Tunstall et al. (HuggingFace)',
    year: 2023,
    category: 'Alignment',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2310.16944',
    source: 'both',
    abstract: 'Distilled DPO approach for aligning small LMs without human feedback.'
  },
  {
    id: 'lost-in-middle',
    title: 'Lost in the Middle: How Language Models Use Long Contexts',
    authors: 'Liu et al. (Stanford)',
    year: 2023,
    category: 'Analysis',
    difficulty: 2,
    url: 'https://arxiv.org/abs/2307.03172',
    source: 'both',
    abstract: 'Reveals U-shaped attention pattern where LLMs struggle with middle context.'
  },
  {
    id: 'alphago',
    title: 'Mastering the game of Go with deep neural networks and tree search',
    authors: 'Silver et al. (DeepMind)',
    year: 2016,
    category: 'Reinforcement Learning',
    difficulty: 4,
    url: 'https://www.nature.com/articles/nature16961',
    source: 'karpathy',
    abstract: 'AlphaGo: First program to defeat a professional Go player.'
  },
  {
    id: 'multi-token-prediction',
    title: 'Better & Faster Large Language Models via Multi-token Prediction',
    authors: 'Gloeckle et al. (Meta)',
    year: 2024,
    category: 'Language Models',
    difficulty: 3,
    url: 'https://arxiv.org/abs/2404.19737',
    source: 'both',
    abstract: 'Training LLMs to predict multiple tokens simultaneously for efficiency.'
  }
];

const CATEGORIES = [
  'Transformers', 'Attention Mechanisms', 'Recurrent Networks', 'Language Models',
  'Scaling', 'Computer Vision', 'Sequence Models', 'Memory Networks', 'Reasoning',
  'Graph Networks', 'Generative Models', 'Theory', 'Speech', 'Complexity Theory',
  'Information Theory', 'AGI Theory', 'Multimodal', 'Retrieval', 'Alignment',
  'Analysis', 'Reinforcement Learning'
];

const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Research'
};

// Storage utilities
const Storage = {
  get: (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
};

// Main App Component
export default function MLPaperHub() {
  const [papers, setPapers] = useState(() => Storage.get('papers', INITIAL_PAPERS));
  const [progress, setProgress] = useState(() => Storage.get('progress', {}));
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [generatedContent, setGeneratedContent] = useState(() => Storage.get('generatedContent', {}));
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [quizState, setQuizState] = useState({ answers: {}, submitted: false, score: null });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Persist state changes
  useEffect(() => {
    Storage.set('papers', papers);
  }, [papers]);

  useEffect(() => {
    Storage.set('progress', progress);
  }, [progress]);

  useEffect(() => {
    Storage.set('generatedContent', generatedContent);
  }, [generatedContent]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Generate content for a paper using Claude API
  const generateContent = useCallback(async (paper, contentType, append = false) => {
    setIsGenerating(true);
    
    const existingContent = generatedContent[paper.id]?.[contentType];
    
    const prompts = {
      summary: `You are an expert ML researcher. Create an executive summary for this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Provide a concise executive summary (300-400 words) that covers:
1. The core problem being solved
2. The key innovation or contribution
3. Why this paper matters in the field
4. Main takeaways for practitioners

Format as clean prose paragraphs. Be technical but accessible.`,

      theory: append && existingContent ? `You are an expert ML researcher. Continue the theoretical deep dive for this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Previous content already covered:
${existingContent}

Now provide ADDITIONAL theoretical content (400-500 words) covering NEW aspects not yet discussed:
- Additional mathematical formulations or derivations
- Deeper analysis of specific components
- Connections to other theoretical frameworks
- Advanced topics or edge cases

Do NOT repeat what was already covered. Start with new material directly.` : `You are an expert ML researcher. Create a deep dive into the theoretical and mathematical foundations of this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Provide a detailed explanation (500-700 words) covering:
1. Mathematical formulations and key equations (use LaTeX notation like $equation$)
2. Theoretical foundations and assumptions
3. How this builds on or differs from prior work
4. Intuitive explanations of complex concepts

Focus on the "why" behind the math, not just the "what". Make it accessible but rigorous.`,

      findings: append && existingContent ? `You are an expert ML researcher. Continue discussing significant findings from this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Previous findings already covered:
${existingContent}

Now provide ADDITIONAL significant findings (300-400 words) not yet discussed:
- Additional experimental insights
- Secondary results or ablations
- Broader implications
- Connections to subsequent work

Do NOT repeat what was already covered. Start with new material directly.` : `You are an expert ML researcher. Summarize the most significant and novel findings from this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Provide a focused summary (300-400 words) of:
1. Key experimental results that were surprising or impactful
2. Novel discoveries or insights
3. Limitations acknowledged by the authors
4. Impact on subsequent research

Skip routine experimental setup. Focus only on what's genuinely new or important.`,

      quiz: append && existingContent?.questions ? `You are an expert ML educator. Create ADDITIONAL quiz questions for this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Existing questions already created: ${existingContent.questions.length} questions

Create 5 NEW questions that test DIFFERENT concepts in this JSON format:
{
  "questions": [
    {
      "id": ${existingContent.questions.length + 1},
      "type": "multiple_choice",
      "question": "Question text here?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Brief explanation"
    }
  ]
}

Include a mix of 3 multiple choice, 1 true/false, 1 fill blank. Return ONLY valid JSON.` : `You are an expert ML educator. Create a comprehensive quiz testing understanding of this paper:

Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

Create exactly 10 questions in this JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text here?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Brief explanation of correct answer"
    },
    {
      "id": 2,
      "type": "true_false",
      "question": "Statement to evaluate",
      "correct": true,
      "explanation": "Why this is true/false"
    },
    {
      "id": 3,
      "type": "fill_blank",
      "question": "The _____ mechanism allows the model to...",
      "correct": "attention",
      "explanation": "Explanation"
    }
  ]
}

Include a mix:
- 5 multiple choice (testing concepts, not memorization)
- 3 true/false (common misconceptions)
- 2 fill in the blank (key terminology)

Questions should test understanding, not trivia. Return ONLY valid JSON.`
    };

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2500,
          messages: [{ role: 'user', content: prompts[contentType] }]
        })
      });

      const data = await response.json();
      let content = data.content?.[0]?.text || '';

      // Parse quiz JSON
      if (contentType === 'quiz') {
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const newQuiz = JSON.parse(jsonMatch[0]);
            if (append && existingContent?.questions) {
              content = { questions: [...existingContent.questions, ...newQuiz.questions] };
            } else {
              content = newQuiz;
            }
          }
        } catch (e) {
          console.error('Quiz parse error:', e);
          content = existingContent || { questions: [] };
        }
      } else if (append && existingContent) {
        content = existingContent + '\n\n' + content;
      }

      setGeneratedContent(prev => ({
        ...prev,
        [paper.id]: { ...prev[paper.id], [contentType]: content }
      }));
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [generatedContent]);

  // Ask question about paper with citations
  const askQuestion = useCallback(async (paper, question) => {
    setIsChatLoading(true);
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);

    const context = generatedContent[paper.id] || {};
    const fullContext = `
Paper Title: ${paper.title}
Authors: ${paper.authors}
Year: ${paper.year}
Abstract: ${paper.abstract}

${context.summary ? `Executive Summary:\n${context.summary}` : ''}

${context.theory ? `Theoretical Foundations:\n${context.theory}` : ''}

${context.findings ? `Key Findings:\n${context.findings}` : ''}
`.trim();

    const prompt = `You are an expert ML researcher helping someone understand this paper. Answer their question using ONLY information from the paper context provided below.

PAPER CONTEXT:
${fullContext}

USER QUESTION: ${question}

CRITICAL: You must cite specific sentences from the context. Format your response as follows:
1. Provide your answer with inline citations using [Citation X] markers
2. At the end, list all citations in this exact format:

CITATIONS:
[Citation 1]: "exact quoted sentence from the context"
[Citation 2]: "exact quoted sentence from the context"

If the question cannot be answered from the provided context, say so clearly. Be precise and cite specific sentences.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      const answer = data.content?.[0]?.text || 'Sorry, I could not generate an answer.';
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not connect to API.' }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [generatedContent]);

  // Group papers by category (sorted by difficulty within each category)
  const groupedPapers = React.useMemo(() => {
    const sorted = [...papers].sort((a, b) => a.difficulty - b.difficulty);
    const groups = {};
    sorted.forEach(paper => {
      if (!groups[paper.category]) groups[paper.category] = [];
      groups[paper.category].push(paper);
    });
    return groups;
  }, [papers]);

  // Stats
  const stats = React.useMemo(() => {
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

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleQuizSubmit = () => {
    const quiz = generatedContent[selectedPaper.id]?.quiz;
    if (!quiz?.questions) return;

    let correct = 0;
    quiz.questions.forEach(q => {
      const answer = quizState.answers[q.id];
      if (q.type === 'multiple_choice' && answer === q.correct) correct++;
      if (q.type === 'true_false' && answer === q.correct) correct++;
      if (q.type === 'fill_blank' && answer?.toLowerCase().trim() === q.correct.toLowerCase()) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    setQuizState(prev => ({ ...prev, submitted: true, score }));

    const paperId = selectedPaper.id;
    const currentBest = progress[paperId]?.bestScore || 0;
    setProgress(prev => ({
      ...prev,
      [paperId]: {
        ...prev[paperId],
        bestScore: Math.max(currentBest, score),
        completed: score >= 70 || prev[paperId]?.completed,
        lastAttempt: new Date().toISOString()
      }
    }));
  };

  const resetQuiz = () => {
    setQuizState({ answers: {}, submitted: false, score: null });
  };

  const DifficultyStars = ({ level }) => (
    <div className="difficulty-stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= level ? '#f59e0b' : 'none'} stroke={i <= level ? '#f59e0b' : '#4b5563'} />
      ))}
      <span className="difficulty-label">{DIFFICULTY_LABELS[level]}</span>
    </div>
  );

  // Add Paper Modal
  const AddPaperModal = () => {
    const [mode, setMode] = useState('url');
    const [url, setUrl] = useState('');
    const [manual, setManual] = useState({ title: '', authors: '', year: '', abstract: '', category: 'Language Models', difficulty: 3 });
    const [loading, setLoading] = useState(false);

    const handleAddByUrl = async () => {
      if (!url.trim()) return;
      setLoading(true);
      
      const newPaper = {
        id: `paper-${Date.now()}`,
        title: 'Paper from URL',
        authors: 'Unknown',
        year: new Date().getFullYear(),
        category: 'Language Models',
        difficulty: 3,
        url: url,
        source: 'user',
        abstract: 'Abstract to be fetched...'
      };

      setPapers(prev => [...prev, newPaper]);
      setShowAddModal(false);
      setLoading(false);
    };

    const handleAddManual = () => {
      const newPaper = {
        id: `paper-${Date.now()}`,
        ...manual,
        year: parseInt(manual.year) || new Date().getFullYear(),
        difficulty: parseInt(manual.difficulty),
        url: '',
        source: 'user'
      };

      setPapers(prev => [...prev, newPaper]);
      setShowAddModal(false);
    };

    return (
      <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>Add New Paper</h2>
          
          <div className="mode-tabs">
            <button className={mode === 'url' ? 'active' : ''} onClick={() => setMode('url')}>
              <Link size={16} /> From URL
            </button>
            <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
              <FileText size={16} /> Manual Entry
            </button>
          </div>

          {mode === 'url' ? (
            <div className="url-form">
              <input
                type="text"
                placeholder="Paste arXiv URL or paper link..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <button onClick={handleAddByUrl} disabled={loading}>
                {loading ? <Loader2 className="spin" size={16} /> : 'Add Paper'}
              </button>
            </div>
          ) : (
            <div className="manual-form">
              <input placeholder="Title" value={manual.title} onChange={e => setManual(prev => ({ ...prev, title: e.target.value }))} />
              <input placeholder="Authors" value={manual.authors} onChange={e => setManual(prev => ({ ...prev, authors: e.target.value }))} />
              <input placeholder="Year" type="number" value={manual.year} onChange={e => setManual(prev => ({ ...prev, year: e.target.value }))} />
              <select value={manual.category} onChange={e => setManual(prev => ({ ...prev, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={manual.difficulty} onChange={e => setManual(prev => ({ ...prev, difficulty: e.target.value }))}>
                {[1,2,3,4,5].map(d => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
              </select>
              <textarea placeholder="Abstract" value={manual.abstract} onChange={e => setManual(prev => ({ ...prev, abstract: e.target.value }))} />
              <button onClick={handleAddManual}>Add Paper</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Paper Detail View
  const PaperDetail = () => {
    const paper = selectedPaper;
    const content = generatedContent[paper.id] || {};
    const paperProgress = progress[paper.id] || {};

    useEffect(() => {
      if (!content[activeTab] && activeTab !== 'quiz' && activeTab !== 'questions') {
        generateContent(paper, activeTab);
      }
    }, [paper.id, activeTab]);

    // Reset chat when switching papers
    useEffect(() => {
      setChatMessages([]);
      setChatInput('');
    }, [paper.id]);

    const handleChatSubmit = (e) => {
      e.preventDefault();
      if (!chatInput.trim() || isChatLoading) return;
      askQuestion(paper, chatInput.trim());
      setChatInput('');
    };

    const renderContent = () => {
      if (isGenerating && activeTab !== 'questions') {
        return (
          <div className="loading-state">
            <Loader2 className="spin" size={32} />
            <p>Generating content...</p>
          </div>
        );
      }

      switch (activeTab) {
        case 'summary':
          return (
            <div className="content-text">
              {content.summary || (
                <button className="generate-btn" onClick={() => generateContent(paper, 'summary')}>
                  <Sparkles size={16} /> Generate Summary
                </button>
              )}
            </div>
          );

        case 'theory':
          return (
            <div className="content-section">
              <div className="content-text">
                {content.theory || (
                  <button className="generate-btn" onClick={() => generateContent(paper, 'theory')}>
                    <Sparkles size={16} /> Generate Theory Deep Dive
                  </button>
                )}
              </div>
              {content.theory && (
                <button className="more-btn" onClick={() => generateContent(paper, 'theory', true)} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="spin" size={14} /> : <PlusCircle size={14} />}
                  Load More Theory
                </button>
              )}
            </div>
          );

        case 'findings':
          return (
            <div className="content-section">
              <div className="content-text">
                {content.findings || (
                  <button className="generate-btn" onClick={() => generateContent(paper, 'findings')}>
                    <Sparkles size={16} /> Generate Key Findings
                  </button>
                )}
              </div>
              {content.findings && (
                <button className="more-btn" onClick={() => generateContent(paper, 'findings', true)} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="spin" size={14} /> : <PlusCircle size={14} />}
                  Load More Findings
                </button>
              )}
            </div>
          );

        case 'quiz':
          if (!content.quiz) {
            return (
              <button className="generate-btn" onClick={() => generateContent(paper, 'quiz')}>
                <Sparkles size={16} /> Generate Quiz
              </button>
            );
          }

          return (
            <div className="quiz-container">
              {quizState.submitted && (
                <div className={`quiz-result ${quizState.score >= 70 ? 'pass' : 'fail'}`}>
                  <Trophy size={24} />
                  <span>Score: {quizState.score}%</span>
                  {quizState.score >= 70 ? ' - Passed!' : ' - Need 70% to pass'}
                  <button onClick={resetQuiz}><RefreshCw size={14} /> Retry</button>
                </div>
              )}

              {content.quiz.questions?.map((q, idx) => (
                <div key={q.id} className={`quiz-question ${quizState.submitted ? (
                  (q.type === 'multiple_choice' && quizState.answers[q.id] === q.correct) ||
                  (q.type === 'true_false' && quizState.answers[q.id] === q.correct) ||
                  (q.type === 'fill_blank' && quizState.answers[q.id]?.toLowerCase().trim() === q.correct.toLowerCase())
                ) ? 'correct' : 'incorrect' : ''}`}>
                  <p className="question-text">{idx + 1}. {q.question}</p>
                  
                  {q.type === 'multiple_choice' && (
                    <div className="options">
                      {q.options.map((opt, i) => (
                        <label key={i} className={quizState.submitted && i === q.correct ? 'correct-answer' : ''}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={quizState.answers[q.id] === i}
                            onChange={() => !quizState.submitted && setQuizState(prev => ({
                              ...prev,
                              answers: { ...prev.answers, [q.id]: i }
                            }))}
                            disabled={quizState.submitted}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'true_false' && (
                    <div className="options tf-options">
                      {[true, false].map(val => (
                        <label key={val.toString()} className={quizState.submitted && val === q.correct ? 'correct-answer' : ''}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={quizState.answers[q.id] === val}
                            onChange={() => !quizState.submitted && setQuizState(prev => ({
                              ...prev,
                              answers: { ...prev.answers, [q.id]: val }
                            }))}
                            disabled={quizState.submitted}
                          />
                          {val ? 'True' : 'False'}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'fill_blank' && (
                    <div className="fill-blank">
                      <input
                        type="text"
                        placeholder="Your answer..."
                        value={quizState.answers[q.id] || ''}
                        onChange={e => !quizState.submitted && setQuizState(prev => ({
                          ...prev,
                          answers: { ...prev.answers, [q.id]: e.target.value }
                        }))}
                        disabled={quizState.submitted}
                      />
                      {quizState.submitted && (
                        <span className="correct-answer-text">Correct: {q.correct}</span>
                      )}
                    </div>
                  )}

                  {quizState.submitted && q.explanation && (
                    <p className="explanation">{q.explanation}</p>
                  )}
                </div>
              ))}

              <div className="quiz-actions">
                {!quizState.submitted && content.quiz.questions?.length > 0 && (
                  <button className="submit-quiz" onClick={handleQuizSubmit}>
                    Submit Quiz
                  </button>
                )}
                <button className="more-btn" onClick={() => generateContent(paper, 'quiz', true)} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="spin" size={14} /> : <PlusCircle size={14} />}
                  Add More Questions ({content.quiz.questions?.length || 0} total)
                </button>
              </div>
            </div>
          );

        case 'questions':
          return (
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.length === 0 && (
                  <div className="chat-empty">
                    <MessageCircle size={48} />
                    <p>Ask questions about this paper</p>
                    <span>Answers will include citations to specific sentences</span>
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    {msg.role === 'assistant' ? (
                      <div className="message-content">
                        {msg.content.split(/(\[Citation \d+\]:.*?)(?=\[Citation|\n\n|$)/g).map((part, i) => {
                          if (part.startsWith('[Citation')) {
                            return (
                              <div key={i} className="citation">
                                <Quote size={12} />
                                {part}
                              </div>
                            );
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </div>
                    ) : (
                      <div className="message-content">{msg.content}</div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="chat-message assistant">
                    <div className="message-content loading">
                      <Loader2 className="spin" size={16} />
                      Analyzing paper...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  placeholder="Ask a question about this paper..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                />
                <button type="submit" disabled={!chatInput.trim() || isChatLoading}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="paper-detail">
        <button className="back-btn" onClick={() => { setSelectedPaper(null); resetQuiz(); setChatMessages([]); }}>
          ← Back to Papers
        </button>

        <div className="paper-header">
          <h1>{paper.title}</h1>
          <div className="paper-meta">
            <span>{paper.authors}</span>
            <span>•</span>
            <span>{paper.year}</span>
            <span>•</span>
            <DifficultyStars level={paper.difficulty} />
            {paper.url && (
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="paper-link">
                <ExternalLink size={14} /> Original
              </a>
            )}
          </div>
          <p className="abstract">{paper.abstract}</p>
          
          {paperProgress.bestScore !== undefined && (
            <div className="progress-badge">
              <Target size={14} />
              Best Score: {paperProgress.bestScore}%
              {paperProgress.completed && <Check size={14} />}
            </div>
          )}
        </div>

        <div className="tabs">
          <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
            <Book size={16} /> Summary
          </button>
          <button className={activeTab === 'theory' ? 'active' : ''} onClick={() => setActiveTab('theory')}>
            <Brain size={16} /> Theory
          </button>
          <button className={activeTab === 'findings' ? 'active' : ''} onClick={() => setActiveTab('findings')}>
            <FlaskConical size={16} /> Findings
          </button>
          <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => { setActiveTab('quiz'); resetQuiz(); }}>
            <HelpCircle size={16} /> Quiz
          </button>
          <button className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>
            <MessageCircle size={16} /> Questions
          </button>
        </div>

        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
          color: #e0e0e0;
          font-family: 'Space Grotesk', sans-serif;
        }

        .header {
          padding: 2rem 3rem;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00d9ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header h1 svg {
          color: #00d9ff;
          -webkit-text-fill-color: initial;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .stats-bar {
          display: flex;
          gap: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00ff88;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .add-paper-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #00d9ff33, #00ff8833);
          border: 1px solid #00d9ff55;
          border-radius: 10px;
          color: #00ff88;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .add-paper-btn:hover {
          background: linear-gradient(135deg, #00d9ff44, #00ff8844);
          transform: translateY(-2px);
        }

        .papers-grid {
          padding: 2rem 3rem;
        }

        .category-group {
          margin-bottom: 1rem;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-header:hover {
          background: rgba(255,255,255,0.08);
        }

        .category-header h3 {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .category-count {
          font-size: 0.75rem;
          color: #888;
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        .papers-in-category {
          padding: 0.5rem 0 0.5rem 1rem;
        }

        .paper-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .paper-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(0,217,255,0.3);
          transform: translateX(4px);
        }

        .paper-card.completed {
          border-left: 3px solid #00ff88;
        }

        .paper-info {
          flex: 1;
        }

        .paper-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .paper-authors {
          font-size: 0.8rem;
          color: #888;
        }

        .difficulty-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .difficulty-label {
          font-size: 0.7rem;
          color: #888;
          margin-left: 0.5rem;
        }

        .source-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .source-badge.ilya { background: #ff6b6b33; color: #ff6b6b; }
        .source-badge.karpathy { background: #4dabf733; color: #4dabf7; }
        .source-badge.both { background: #9775fa33; color: #9775fa; }
        .source-badge.user { background: #69db7c33; color: #69db7c; }

        /* Paper Detail */
        .paper-detail {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 3rem;
        }

        .back-btn {
          background: none;
          border: none;
          color: #00d9ff;
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          padding: 0;
        }

        .paper-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .paper-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .paper-link {
          color: #00d9ff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .abstract {
          color: #aaa;
          line-height: 1.6;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .progress-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0,255,136,0.1);
          border: 1px solid rgba(0,255,136,0.3);
          border-radius: 20px;
          color: #00ff88;
          font-size: 0.85rem;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin: 2rem 0 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .tabs button {
          background: none;
          border: none;
          color: #888;
          font-family: inherit;
          font-size: 0.9rem;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s;
        }

        .tabs button:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .tabs button.active {
          color: #00d9ff;
          background: rgba(0,217,255,0.1);
          border-bottom: 2px solid #00d9ff;
        }

        .tab-content {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 2rem;
          min-height: 400px;
        }

        .content-section {
          display: flex;
          flex-direction: column;
        }

        .content-text {
          line-height: 1.8;
          font-size: 1rem;
          white-space: pre-wrap;
        }

        .more-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: #00d9ff;
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 1.5rem;
          align-self: flex-start;
          transition: all 0.2s;
        }

        .more-btn:hover:not(:disabled) {
          background: rgba(0,217,255,0.1);
          border-color: #00d9ff;
        }

        .more-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 3rem;
          color: #888;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .generate-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #00d9ff22, #00ff8822);
          border: 1px solid #00d9ff44;
          border-radius: 8px;
          color: #00ff88;
          font-family: inherit;
          font-size: 1rem;
          cursor: pointer;
          margin: 2rem auto;
          transition: all 0.2s;
        }

        .generate-btn:hover {
          background: linear-gradient(135deg, #00d9ff33, #00ff8833);
          transform: scale(1.02);
        }

        /* Quiz Styles */
        .quiz-container {
          max-width: 700px;
        }

        .quiz-result {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .quiz-result.pass {
          background: rgba(0,255,136,0.15);
          border: 1px solid rgba(0,255,136,0.3);
          color: #00ff88;
        }

        .quiz-result.fail {
          background: rgba(255,107,107,0.15);
          border: 1px solid rgba(255,107,107,0.3);
          color: #ff6b6b;
        }

        .quiz-result button {
          margin-left: auto;
          background: rgba(255,255,255,0.1);
          border: none;
          color: inherit;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-family: inherit;
        }

        .quiz-question {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }

        .quiz-question.correct {
          border-color: rgba(0,255,136,0.4);
          background: rgba(0,255,136,0.05);
        }

        .quiz-question.incorrect {
          border-color: rgba(255,107,107,0.4);
          background: rgba(255,107,107,0.05);
        }

        .question-text {
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .options label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 6px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .options label:hover {
          background: rgba(255,255,255,0.06);
        }

        .options label.correct-answer {
          background: rgba(0,255,136,0.15);
          border: 1px solid rgba(0,255,136,0.3);
        }

        .tf-options {
          display: flex;
          gap: 1rem;
        }

        .tf-options label {
          flex: 1;
          justify-content: center;
        }

        .fill-blank input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          color: #fff;
          font-family: inherit;
        }

        .correct-answer-text {
          display: block;
          margin-top: 0.5rem;
          color: #00ff88;
          font-size: 0.85rem;
        }

        .explanation {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-size: 0.85rem;
          color: #aaa;
          font-style: italic;
        }

        .quiz-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .submit-quiz {
          flex: 1;
          padding: 1rem;
          background: linear-gradient(135deg, #00d9ff, #00ff88);
          border: none;
          border-radius: 10px;
          color: #000;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-quiz:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,255,136,0.3);
        }

        /* Chat / Questions Styles */
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 500px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          text-align: center;
        }

        .chat-empty svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .chat-empty p {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .chat-empty span {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .chat-message {
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 12px;
          max-width: 90%;
        }

        .chat-message.user {
          background: rgba(0,217,255,0.15);
          border: 1px solid rgba(0,217,255,0.3);
          margin-left: auto;
        }

        .chat-message.assistant {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .message-content {
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message-content.loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #888;
        }

        .citation {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin: 0.75rem 0;
          padding: 0.75rem;
          background: rgba(0,255,136,0.08);
          border-left: 3px solid #00ff88;
          border-radius: 0 8px 8px 0;
          font-size: 0.9rem;
          color: #aaa;
        }

        .citation svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: #00ff88;
        }

        .chat-input-form {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .chat-input-form input {
          flex: 1;
          padding: 0.875rem 1rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          color: #fff;
          font-family: inherit;
          font-size: 0.95rem;
        }

        .chat-input-form input:focus {
          outline: none;
          border-color: #00d9ff;
        }

        .chat-input-form button {
          padding: 0.875rem 1.25rem;
          background: linear-gradient(135deg, #00d9ff, #00ff88);
          border: none;
          border-radius: 10px;
          color: #000;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-input-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input-form button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal {
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
        }

        .modal h2 {
          margin-bottom: 1.5rem;
        }

        .mode-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .mode-tabs button {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #888;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .mode-tabs button.active {
          background: rgba(0,217,255,0.1);
          border-color: #00d9ff;
          color: #00d9ff;
        }

        .url-form, .manual-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .url-form input, .manual-form input, .manual-form select, .manual-form textarea {
          padding: 0.75rem 1rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: #fff;
          font-family: inherit;
        }

        .manual-form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .url-form button, .manual-form button {
          padding: 1rem;
          background: linear-gradient(135deg, #00d9ff, #00ff88);
          border: none;
          border-radius: 8px;
          color: #000;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
      `}</style>

      {selectedPaper ? (
        <PaperDetail />
      ) : (
        <>
          <header className="header">
            <h1><Brain size={28} /> ML Paper Study Hub</h1>
            <div className="header-right">
              <div className="stats-bar">
                <div className="stat">
                  <div className="stat-value">{stats.completed}/{stats.total}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{stats.avgScore}%</div>
                  <div className="stat-label">Avg Score</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{stats.quizzesTaken}</div>
                  <div className="stat-label">Quizzes Taken</div>
                </div>
              </div>
              <button className="add-paper-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={18} /> Add Paper
              </button>
            </div>
          </header>

          <div className="papers-grid">
            {Object.entries(groupedPapers).map(([category, categoryPapers]) => (
              <div key={category} className="category-group">
                <div className="category-header" onClick={() => toggleCategory(category)}>
                  {expandedCategories[category] === false ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                  <h3>{category}</h3>
                  <span className="category-count">{categoryPapers.length}</span>
                </div>
                
                {expandedCategories[category] !== false && (
                  <div className="papers-in-category">
                    {categoryPapers.map(paper => (
                      <div
                        key={paper.id}
                        className={`paper-card ${progress[paper.id]?.completed ? 'completed' : ''}`}
                        onClick={() => setSelectedPaper(paper)}
                      >
                        <div className="paper-info">
                          <div className="paper-title">{paper.title}</div>
                          <div className="paper-authors">{paper.authors} • {paper.year}</div>
                        </div>
                        <DifficultyStars level={paper.difficulty} />
                        <span className={`source-badge ${paper.source}`}>
                          {paper.source === 'both' ? 'Both' : paper.source === 'ilya' ? 'Ilya' : paper.source === 'karpathy' ? 'Karpathy' : 'Added'}
                        </span>
                        {progress[paper.id]?.completed && <Check size={18} color="#00ff88" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {showAddModal && <AddPaperModal />}
    </div>
  );
}
