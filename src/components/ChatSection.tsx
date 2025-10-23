import { useState, useEffect, useRef } from "react";
import { Send, Languages } from "lucide-react";

const API_BASE_URL = 'http://localhost:5001';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type Language = 'en' | 'hi' | 'hinglish';

const LCBChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to LCB Fertilizers. How can I help you today? | नमस्ते! LCB उर्वरक में आपका स्वागत है। मैं आपकी कैसे सहायता कर सकता हूं?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText,
          language: selectedLanguage 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        response: getErrorMessage(selectedLanguage),
        success: false,
      };
    }
  };

  const getErrorMessage = (lang: Language) => {
    const errorMessages = {
      en: 'Sorry, I am having trouble connecting. Please try again later.',
      hi: 'क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।',
      hinglish: 'Sorry, mujhe connect karne mein problem ho rahi hai. Please baad mein try karein.'
    };
    return errorMessages[lang];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || "Sorry, I could not process that. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getErrorMessage(selectedLanguage),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = {
    en: [
      "What products do you offer?",
      "Tell me about your fertilizers",
    ],
    hi: [
      "आप कौन से उत्पाद पेश करते हैं?",
      "आपसे कैसे संपर्क करें?",
    ],
    hinglish: [
      "Aap kaunse products offer karte hain?",
      "Apne fertilizers ke baare mein bataiye",
    ]
  };

  const languageLabels = {
    en: 'English',
    hi: 'हिंदी',
    hinglish: 'Hinglish'
  };

  return (
    <div 
      className="w-full h-screen flex items-center justify-center p-4" 
      style={{ 
        background: 'linear-gradient(to bottom right, rgb(240, 253, 244), rgb(220, 252, 231))',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full max-w-4xl"
        style={{ height: 'min(800px, 90vh)', maxHeight: '90vh' }}
      >
        <div 
          className="text-gray-800 p-4 sm:p-6 flex items-center justify-between flex-shrink-0 border-b-2" 
          style={{ 
            backgroundColor: 'rgb(170, 223, 128)', 
            borderColor: 'rgb(134, 239, 172)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgb(22, 163, 74)' }}>LCB</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-lg sm:text-xl text-gray-800 truncate">LCB Fertilizers</h3>
              <p className="text-xs sm:text-sm text-gray-700">Chat Support • Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Languages size={20} className="text-gray-700" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              className="bg-white border-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 cursor-pointer"
              style={{ borderColor: 'rgb(134, 239, 172)' }}
            >
              {Object.entries(languageLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
          style={{ 
            minHeight: 0,
            background: 'linear-gradient(to bottom, rgb(247, 254, 231), white)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-lg ${
                  message.isUser
                    ? "text-gray-800 rounded-br-none border-2"
                    : "text-gray-800 rounded-bl-none shadow-md border-2"
                }`}
                style={{
                  backgroundColor: message.isUser ? 'rgb(170, 223, 128)' : 'white',
                  borderColor: message.isUser ? 'rgb(134, 239, 172)' : 'rgb(229, 231, 235)'
                }}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                  {message.text}
                </p>
                <p className="text-xs sm:text-xs mt-2 text-gray-600" style={{ fontSize: '10px' }}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none shadow-md border-2 border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(22, 163, 74)' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(22, 163, 74)', animationDelay: '0.1s' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(22, 163, 74)', animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        {messages.length === 1 && (
          <div 
            className="p-4 sm:p-5 border-t-2 flex-shrink-0" 
            style={{ 
              backgroundColor: 'rgb(240, 253, 244)', 
              borderColor: 'rgb(170, 223, 128)',
              position: 'relative',
              zIndex: 5
            }}
          >
            <p className="text-xs sm:text-sm text-gray-700 mb-3 font-medium">
              {selectedLanguage === 'en' && 'Quick questions:'}
              {selectedLanguage === 'hi' && 'त्वरित प्रश्न:'}
              {selectedLanguage === 'hinglish' && 'Quick questions:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {quickQuestions[selectedLanguage].map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  disabled={isLoading}
                  className="text-xs sm:text-sm text-left p-3 bg-white text-gray-700 rounded-xl transition-colors disabled:opacity-50 border-2 font-medium shadow-sm"
                  style={{ borderColor: 'rgb(170, 223, 128)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(240, 253, 244)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div 
          className="p-4 sm:p-6 bg-white border-t-2 flex-shrink-0" 
          style={{ 
            borderColor: 'rgb(170, 223, 128)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedLanguage === 'en' ? "Type your message..." :
                selectedLanguage === 'hi' ? "अपना संदेश लिखें..." :
                "Apna message type karein..."
              }
              disabled={isLoading}
              className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 border-2 rounded-full focus:outline-none focus:ring-4 text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
              style={{ borderColor: 'rgb(170, 223, 128)' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="disabled:cursor-not-allowed text-white p-3 sm:p-4 rounded-full transition-colors flex-shrink-0 shadow-lg"
              style={{
                backgroundColor: isLoading || !inputValue.trim() ? 'rgb(209, 213, 219)' : 'rgb(22, 163, 74)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = 'rgb(21, 128, 61)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = 'rgb(22, 163, 74)';
                }
              }}
              aria-label="Send message"
            >
              <Send size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCBChatbot;