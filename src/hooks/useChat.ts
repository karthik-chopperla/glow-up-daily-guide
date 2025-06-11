
import { useState, useEffect, useRef } from 'react';
import { aiHealthService } from '../services/aiHealthService';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  userName?: string;
}

export const useChat = (userName: string) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    if (userName) {
      const savedMessages = localStorage.getItem('health_mate_chat_history');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } else {
        // Initialize with personalized greeting
        const greeting = {
          id: 1,
          text: `Hi ${userName}! 👋 I'm your AI health companion. I can help with nutrition advice, stress management, breathing exercises, and wellness tips. How can I support you today? 😊`,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([greeting]);
        localStorage.setItem('health_mate_chat_history', JSON.stringify([greeting]));
      }
    }
  }, [userName]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && userName) {
      localStorage.setItem('health_mate_chat_history', JSON.stringify(messages));
    }
  }, [messages, userName]);

  // Focus input after loading is complete
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: textToSend,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userName: userName
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage('');
    
    // Refocus input after clearing message
    setTimeout(() => inputRef.current?.focus(), 300);
    
    setIsLoading(true);
    
    try {
      const response = await aiHealthService.getHealthAdvice(textToSend);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: updatedMessages.length + 1,
          text: response,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        const errorResponse: Message = {
          id: updatedMessages.length + 1,
          text: "I apologize, but I'm having trouble connecting right now. Please try again later or contact your healthcare provider for urgent concerns. 💙",
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorResponse]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('health_mate_chat_history');
    
    // Add a fresh greeting
    const greeting: Message = {
      id: 1,
      text: `Hi ${userName}! 👋 I'm ready to help you with your health and wellness questions. What would you like to know? 😊`,
      isBot: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([greeting]);
  };

  return {
    message,
    setMessage,
    messages,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSend,
    clearChat
  };
};
