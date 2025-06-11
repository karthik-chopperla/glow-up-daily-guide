
import { forwardRef } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  isListening: boolean;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onStartListening: () => void;
  hasSpeechRecognition: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ message, isLoading, isListening, onMessageChange, onSend, onStartListening, hasSpeechRecognition }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) {
        onSend();
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-md p-4 border-t border-green-100">
        <div className="flex items-center space-x-3">
          <input
            ref={ref}
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about nutrition, stress, exercise..."
            disabled={isLoading}
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 border-none disabled:opacity-50"
            autoFocus
          />
          
          {/* Voice input button */}
          {hasSpeechRecognition && (
            <button
              onClick={onStartListening}
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
            onClick={onSend}
            disabled={isLoading || !message.trim()}
            className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
