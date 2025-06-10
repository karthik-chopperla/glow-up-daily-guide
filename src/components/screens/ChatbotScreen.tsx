
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { aiHealthService } from '../../services/aiHealthService';

const ChatbotScreen = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI health companion. I can help with nutrition advice, stress management, breathing exercises, and wellness tips. How can I support you today? 😊",
      isBot: true,
      time: "10:30 AM"
    }
  ]);

  const quickQuestions = [
    "What should I eat today?",
    "How do I reduce anxiety?",
    "Give me a breathing exercise",
    "Tips for better sleep"
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: textToSend,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await aiHealthService.getHealthAdvice(textToSend);
      
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: response,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        const errorResponse = {
          id: messages.length + 2,
          text: "I apologize, but I'm having trouble connecting right now. Please try again later or contact your healthcare provider for urgent concerns.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-6 border-b border-green-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full mr-3">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center">
                AI Health Assistant 
                <Sparkles className="ml-2 text-yellow-500" size={16} />
              </h1>
              <p className="text-sm text-gray-600">Powered by AI • Always here to help</p>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 bg-white/50 border-b border-green-100">
            <p className="text-sm text-gray-600 mb-3 font-medium">Try asking:</p>
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
            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
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
                    <p className={`text-xs mt-1 ${msg.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
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
            <div className="flex justify-start">
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
                </div>
              </div>
            </div>
          )}
        </div>

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
