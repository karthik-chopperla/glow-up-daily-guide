
import { Send, Bot, User } from 'lucide-react';
import { useState } from 'react';

const ChatbotScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your health companion. How can I help you today? 😊",
      isBot: true,
      time: "10:30 AM"
    },
    {
      id: 2,
      text: "I've been feeling tired lately. Any suggestions?",
      isBot: false,
      time: "10:31 AM"
    },
    {
      id: 3,
      text: "I understand you're feeling tired. Here are some gentle suggestions: 💤 Ensure you're getting 7-9 hours of sleep, 💧 Stay hydrated throughout the day, 🥗 Eat balanced meals with protein and complex carbs. Would you like me to help you track any of these?",
      isBot: true,
      time: "10:31 AM"
    }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isBot: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for sharing! Let me help you with that. Based on what you've told me, I'd recommend focusing on small, manageable changes. Would you like specific suggestions? 🌟",
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
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
              <h1 className="text-xl font-bold text-gray-800">Health Assistant</h1>
              <p className="text-sm text-gray-600">Online • Ready to help</p>
            </div>
          </div>
        </div>

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
                    <p className={`text-sm ${msg.isBot ? 'text-gray-700' : 'text-white'}`}>
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
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-md p-4 border-t border-green-100">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your health question..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 border-none"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full text-white hover:shadow-lg transition-all duration-300"
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
