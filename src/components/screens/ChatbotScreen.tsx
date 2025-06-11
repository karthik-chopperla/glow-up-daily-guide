
import { Send, Bot, User, Sparkles, Trash2, Mic } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { aiHealthService } from '../../services/aiHealthService';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  userName?: string;
}

const ChatbotScreen = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempName, setTempName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions = [
    "What should I eat today?",
    "How do I reduce anxiety?", 
    "Give me a breathing exercise",
    "Tips for better sleep"
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        // Auto-send the voice message
        handleSend(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        alert('Voice recognition error. Please try again or type your message.');
      };
    }
  }, []);

  // Load user data and chat history on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('health_mate_user_name');
    const savedMessages = localStorage.getItem('health_mate_chat_history');
    
    if (savedName) {
      setUserName(savedName);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } else {
        // Initialize with personalized greeting
        const greeting = {
          id: 1,
          text: `Hi ${savedName}! 👋 I'm your AI health companion. I can help with nutrition advice, stress management, breathing exercises, and wellness tips. How can I support you today? 😊`,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([greeting]);
        localStorage.setItem('health_mate_chat_history', JSON.stringify([greeting]));
      }
    } else {
      setShowNameInput(true);
    }
  }, []);

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

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('health_mate_user_name', tempName.trim());
      setShowNameInput(false);
      
      const greeting = {
        id: 1,
        text: `Hi ${tempName.trim()}! 👋 I'm your AI health companion. I can help with nutrition advice, stress management, breathing exercises, and wellness tips. How can I support you today? 😊`,
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([greeting]);
      localStorage.setItem('health_mate_chat_history', JSON.stringify([greeting]));
    }
  };

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

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
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

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Name input modal
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-green-100 shadow-xl">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Bot className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Health Mate! 🌟</h2>
            <p className="text-gray-600">I'm your AI health companion. What should I call you?</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              placeholder="Enter your name..."
              className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 border-none"
              autoFocus
            />
            <button
              onClick={handleNameSubmit}
              disabled={!tempName.trim()}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Chatting 💬
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-6 border-b border-green-100 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full mr-3">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                  Health Mate AI 
                  <Sparkles className="ml-2 text-yellow-500" size={16} />
                </h1>
                <p className="text-sm text-gray-600">Chat with {userName} • Always here to help</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
              title="Clear Chat"
            >
              <Trash2 className="text-red-600" size={18} />
            </button>
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 bg-white/50 border-b border-green-100">
            <p className="text-sm text-gray-600 mb-3 font-medium">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-2 rounded-full hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.isBot 
                  ? 'bg-white/70 backdrop-blur-sm border border-green-100' 
                  : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
              }`}>
                <div className="flex items-start space-x-2">
                  {msg.isBot && (
                    <div className="bg-green-100 p-1 rounded-full flex-shrink-0">
                      <Bot className="text-green-600" size={12} />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${msg.isBot ? 'text-gray-700' : 'text-white'} whitespace-pre-line`}>
                      {msg.text}
                    </p>
                    <p className={`text-xs mt-1 ${msg.isBot ? 'text-gray-500' : 'text-blue-100'} flex items-center`}>
                      {!msg.isBot && msg.userName && (
                        <span className="mr-2">{msg.userName}</span>
                      )}
                      {msg.time}
                    </p>
                  </div>
                  {!msg.isBot && (
                    <div className="bg-white/20 p-1 rounded-full flex-shrink-0">
                      <User className="text-white" size={12} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm border border-green-100 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Bot className="text-green-600" size={12} />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Health Mate is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice listening indicator */}
        {isListening && (
          <div className="px-4 py-2 bg-blue-100/80 border-t border-blue-200">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-700 font-medium">Listening... Speak now!</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-md p-4 border-t border-green-100">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask about nutrition, stress, exercise..."
              disabled={isLoading}
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 border-none disabled:opacity-50"
            />
            
            {/* Voice input button */}
            {recognitionRef.current && (
              <button
                onClick={startListening}
                disabled={isLoading || isListening}
                className={`p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title="Voice input"
              >
                <Mic size={16} />
              </button>
            )}
            
            {/* Send button */}
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !message.trim()}
              className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotScreen;
