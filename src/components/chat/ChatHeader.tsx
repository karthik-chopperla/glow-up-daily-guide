
import { Bot, Sparkles, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  userName: string;
  onClearChat: () => void;
}

const ChatHeader = ({ userName, onClearChat }: ChatHeaderProps) => {
  return (
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
          onClick={onClearChat}
          className="bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="text-red-600" size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
