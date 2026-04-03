import { useState, useRef, useEffect, useCallback } from 'react';
import { callClaude, buildChatPrompt } from '../services/api.js';

export default function useChat(generatedContent) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const resetChat = useCallback(() => {
    setChatMessages([]);
    setChatInput('');
  }, []);

  const askQuestion = useCallback(async (paper, question) => {
    setIsChatLoading(true);
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);

    try {
      const prompt = buildChatPrompt(paper, generatedContent[paper.id], question);
      const answer = await callClaude(prompt, 1500);
      setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not connect to API.' }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [generatedContent]);

  return {
    chatMessages,
    chatInput,
    setChatInput,
    isChatLoading,
    chatEndRef,
    resetChat,
    askQuestion
  };
}
