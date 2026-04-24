import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
