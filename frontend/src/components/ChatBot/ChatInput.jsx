import { Send } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend, disabled }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
        />
        <button
          onClick={onSend}
          disabled={disabled}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
