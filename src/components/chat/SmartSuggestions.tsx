
import { useState, useEffect } from 'react';

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SmartSuggestions = ({ onSuggestionClick }: SmartSuggestionsProps) => {
  const suggestions = [
    "What foods reduce stress?",
    "How to sleep better?",
    "Simple morning exercises?",
    "Best hydration tips?",
    "Quick energy boosters?",
    "Healthy snack ideas?"
  ];

  const [currentSuggestions, setCurrentSuggestions] = useState(suggestions.slice(0, 3));
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex(prev => {
        const newIndex = (prev + 3) % suggestions.length;
        setCurrentSuggestions(suggestions.slice(newIndex, newIndex + 3));
        return newIndex;
      });
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-2 justify-center">
        {currentSuggestions.map((suggestion, index) => (
          <button
            key={`${suggestionIndex}-${index}`}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:from-gray-200 hover:to-gray-300 transition-all duration-300 animate-fade-in"
          >
            💡 {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
