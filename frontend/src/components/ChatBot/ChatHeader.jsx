import { Bot, X } from 'lucide-react';

const ChatHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Garage Assistant</h3>
          <p className="text-xs text-blue-100">Online</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
