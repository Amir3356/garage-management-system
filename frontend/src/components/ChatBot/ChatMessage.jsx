import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-blue-100' : 'bg-gray-200'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-blue-600" />
        ) : (
          <Bot className="w-4 h-4 text-gray-600" />
        )}
      </div>
      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-md'
          : 'bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100'
      }`}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
