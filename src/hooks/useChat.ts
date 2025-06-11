
import { useState, useEffect, useRef } from 'react';
import { aiHealthService } from '../services/aiHealthService';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  userName?: string;
}

interface HealthData {
  stepsToday: number;
  waterToday: number;
  sleepHours: number;
  caloriesBurned: number;
}

export const useChat = (userName: string) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [healthData, setHealthData] = useState<HealthData>({
    stepsToday: 0,
    waterToday: 0,
    sleepHours: 0,
    caloriesBurned: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history and health data on component mount
  useEffect(() => {
    if (userName) {
      const savedMessages = localStorage.getItem('health_mate_chat_history');
      const savedHealthData = localStorage.getItem('health_mate_health_data');
      
      if (savedHealthData) {
        setHealthData(JSON.parse(savedHealthData));
      }
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } else {
        // Initialize with personalized greeting
        const greeting = {
          id: 1,
          text: `Hi ${userName}! 👋 I'm your Health Mate 🤖 Ask me anything about health, sleep, stress, or use the buttons below to track your daily activities! 😊`,
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

  // Save health data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('health_mate_health_data', JSON.stringify(healthData));
  }, [healthData]);

  // Focus input after loading is complete
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const detectMoodAndRespond = (text: string): string | null => {
    const sadWords = ['sad', 'depressed', 'anxious', 'worried', 'stressed', 'upset', 'down', 'feel bad'];
    const lowerText = text.toLowerCase();
    
    if (sadWords.some(word => lowerText.includes(word))) {
      return "It's okay to feel this way 💛 Want a breathing exercise? I'm here to support you through this.";
    }
    return null;
  };

  const analyzeSteps = (steps: number): string => {
    if (steps < 3000) return `${steps} steps today - Try to walk more! 🐢 Even a short walk can boost your energy.`;
    if (steps <= 7000) return `${steps} steps today - Doing okay! 🚶‍♂️ You're on the right track.`;
    return `${steps} steps today - Great job! 🎉 You're crushing your activity goals!`;
  };

  const analyzeWater = (glasses: number): string => {
    if (glasses < 4) return `${glasses} glasses today - Try to drink more water! 💧 Your body needs hydration.`;
    if (glasses <= 8) return `${glasses} glasses today - Good hydration! 💧 Keep it up!`;
    return `${glasses} glasses today - Excellent hydration! 💧 You're taking great care of yourself!`;
  };

  const analyzeSleep = (hours: number): string => {
    if (hours < 6) return `${hours} hours last night - You need more rest! 😴 Try to get 7-9 hours for optimal health.`;
    if (hours <= 9) return `${hours} hours last night - Good sleep! 😴 Quality rest is essential for your wellbeing.`;
    return `${hours} hours last night - That's quite a bit! 😴 Make sure it's quality sleep.`;
  };

  const estimateCalories = (activities: string): number => {
    const text = activities.toLowerCase();
    let calories = 0;
    
    if (text.includes('walk')) calories += 250;
    if (text.includes('run')) calories += 500;
    if (text.includes('cycle') || text.includes('bike')) calories += 400;
    if (text.includes('swim')) calories += 400;
    if (text.includes('gym') || text.includes('workout')) calories += 300;
    
    return calories;
  };

  const handleHealthTracking = (text: string): string | null => {
    // Check for steps tracking
    const stepsMatch = text.match(/(\d+)\s*steps?/i) || text.match(/walked?\s*(\d+)/i);
    if (stepsMatch) {
      const steps = parseInt(stepsMatch[1]);
      setHealthData(prev => ({ ...prev, stepsToday: steps }));
      return analyzeSteps(steps);
    }

    // Check for water tracking
    const waterMatch = text.match(/(\d+)\s*(glass|cup|water)/i) || text.match(/(drank?|drink)\s*(\d+)/i);
    if (waterMatch) {
      const glasses = parseInt(waterMatch[1] || waterMatch[2]);
      setHealthData(prev => ({ ...prev, waterToday: glasses }));
      return analyzeWater(glasses);
    }

    // Check for sleep tracking
    const sleepMatch = text.match(/(\d+)\s*(hour|hr).*sleep/i) || text.match(/slept?\s*(\d+)/i);
    if (sleepMatch) {
      const hours = parseInt(sleepMatch[1]);
      setHealthData(prev => ({ ...prev, sleepHours: hours }));
      return analyzeSleep(hours);
    }

    // Check for activity tracking
    if (text.toLowerCase().includes('activit') || text.toLowerCase().includes('exercise')) {
      const calories = estimateCalories(text);
      if (calories > 0) {
        setHealthData(prev => ({ ...prev, caloriesBurned: prev.caloriesBurned + calories }));
        return `Great! I estimate you burned around ${calories} calories from those activities! 🔥 Keep moving!`;
      }
    }

    return null;
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
    
    // Refocus input after clearing message
    setTimeout(() => inputRef.current?.focus(), 300);
    
    setIsLoading(true);
    
    try {
      // Check for mood detection first
      const moodResponse = detectMoodAndRespond(textToSend);
      if (moodResponse) {
        setTimeout(() => {
          const botResponse: Message = {
            id: updatedMessages.length + 1,
            text: moodResponse,
            isBot: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Check for health tracking
      const healthResponse = handleHealthTracking(textToSend);
      if (healthResponse) {
        setTimeout(() => {
          const botResponse: Message = {
            id: updatedMessages.length + 1,
            text: healthResponse,
            isBot: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Regular AI response
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
    if (window.confirm('Are you sure you want to clear the chat history?')) {
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
    }
  };

  const getHealthSummary = () => {
    const summary = `📊 Your Daily Health Summary:
• Steps: ${healthData.stepsToday} steps
• Water: ${healthData.waterToday} glasses
• Sleep: ${healthData.sleepHours} hrs
• Calories Burned: ${healthData.caloriesBurned} cal

${healthData.stepsToday > 5000 ? 'Great activity level! 🎉' : 'Try to be more active today! 💪'}`;
    
    handleSend(summary);
  };

  const checkHeartRate = () => {
    const heartRate = Math.floor(Math.random() * (85 - 60 + 1)) + 60;
    const response = `❤️ ${heartRate} bpm – Normal\n\nYour simulated heart rate looks healthy! Remember, this is just for fun - use a real device for actual monitoring. 😊`;
    handleSend(response);
  };

  return {
    message,
    setMessage,
    messages,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSend,
    clearChat,
    healthData,
    getHealthSummary,
    checkHeartRate
  };
};
