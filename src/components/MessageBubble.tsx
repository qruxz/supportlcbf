import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] lg:max-w-[70%] px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-lg ${
          message.isUser
            ? "text-gray-800 rounded-br-none border-2"
            : "text-gray-800 rounded-bl-none shadow-md border-2"
        }`}
        style={{
          backgroundColor: message.isUser ? 'rgb(170, 223, 128)' : 'white',
          borderColor: message.isUser ? 'rgb(134, 239, 172)' : 'rgb(229, 231, 235)'
        }}
      >
        <div className={`prose prose-sm max-w-none ${
          message.isUser 
            ? "prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800 prose-a:text-green-700" 
            : "prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800 prose-a:text-blue-600"
        }`}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className={`${
                  message.isUser 
                    ? "text-gray-800" 
                    : "text-gray-800"
                } px-1.5 py-0.5 rounded text-sm font-mono`}
                style={{
                  backgroundColor: message.isUser ? 'rgb(134, 239, 172)' : 'rgb(229, 231, 235)'
                }}>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className={`${
                  message.isUser 
                    ? "text-gray-800" 
                    : "text-gray-800"
                } p-3 rounded-lg overflow-x-auto my-2 text-sm font-mono`}
                style={{
                  backgroundColor: message.isUser ? 'rgb(134, 239, 172)' : 'rgb(229, 231, 235)'
                }}>
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${
                    message.isUser 
                      ? "hover:text-green-800" 
                      : "hover:text-blue-700"
                  } underline font-medium`}
                  style={{
                    color: message.isUser ? 'rgb(21, 128, 61)' : 'rgb(37, 99, 235)'
                  }}
                >
                  {children}
                </a>
              ),
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        <p
          className="mt-2 text-gray-600"
          style={{ fontSize: '10px' }}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;