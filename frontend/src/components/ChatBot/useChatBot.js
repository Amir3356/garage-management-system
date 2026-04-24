import { useState, useRef, useEffect } from 'react';
import { generateResponse } from './chatResponses';

export const useChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Garage Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: generateResponse(userMessage.content)
      }]);
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return {
    isOpen,
    messages,
    input,
    isLoading,
    messagesEndRef,
    handleSend,
    handleInputChange,
    toggleChat,
    setIsOpen
  };
};
