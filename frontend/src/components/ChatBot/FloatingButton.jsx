import { MessageCircle } from 'lucide-react';

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
    >
      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
    </button>
  );
};

export default FloatingButton;
