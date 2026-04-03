export const INITIAL_PAPERS = [
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
    authors: 'Peter Grunwald',
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

export const CATEGORIES = [
  'Transformers', 'Attention Mechanisms', 'Recurrent Networks', 'Language Models',
  'Scaling', 'Computer Vision', 'Sequence Models', 'Memory Networks', 'Reasoning',
  'Graph Networks', 'Generative Models', 'Theory', 'Speech', 'Complexity Theory',
  'Information Theory', 'AGI Theory', 'Multimodal', 'Retrieval', 'Alignment',
  'Analysis', 'Reinforcement Learning'
];

export const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Research'
};
