import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Garage Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Intelligent response generator with better pattern matching
  const generateFallbackResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Greetings - more variations
    if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings|sup|yo)[\s!?]*$/)) {
      const greetings = [
        "Hello! Welcome to our Garage Management System. How can I assist you today? 😊",
        "Hi there! I'm here to help with your vehicle service needs. What can I do for you?",
        "Hey! Ready to help you with appointments, vehicles, or services. What do you need?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // How are you / conversational
    if (input.match(/how are you|how're you|how r u|what's up|whats up|wassup/)) {
      return "I'm doing great, thanks for asking! 😊 I'm here and ready to help you with your garage needs. What can I assist you with today?";
    }
    
    // What can you do / capabilities
    if (input.match(/what (can|do) you (do|help)|your (capabilities|features)|tell me about yourself/)) {
      return "I'm your Garage Management Assistant! I can help you with:\n\n📅 **Appointments** - Schedule, check status, or cancel\n🚗 **Vehicles** - Add, view, or manage your vehicles\n🔧 **Services** - Learn about repairs, maintenance, pricing\n📊 **Status Updates** - Track your service progress\n💬 **Questions** - Answer any garage-related queries\n\nWhat would you like to do?";
    }
    
    // Appointment/Booking related - more intelligent
    if (input.match(/\b(appointment|book|schedule|reserve|make.*appointment|need.*appointment)\b/)) {
      if (input.match(/\b(how|what|where|can i|do i)\b/)) {
        return "**Booking an Appointment is Easy!** 📅\n\n1. Navigate to the 'Appointments' page\n2. Select your vehicle from the list\n3. Choose the service you need\n4. Pick your preferred date and time\n5. Submit your request\n\nThe admin will review and confirm your appointment. You'll see the status in your Dashboard!";
      }
      if (input.match(/\b(cancel|change|modify|reschedule)\b/)) {
        return "**To modify your appointment:**\n\n1. Go to your Dashboard or History page\n2. Find the appointment you want to change\n3. Contact the admin for modifications\n\n💡 **Tip:** Try to make changes at least 24 hours in advance!";
      }
      return "I can help you with appointments! Would you like to:\n• Learn how to book an appointment?\n• Check your appointment status?\n• Cancel or modify an appointment?\n\nJust let me know!";
    }
    
    // Vehicle related - more context aware
    if (input.match(/\b(vehicle|car|truck|motorcycle|bike|auto)\b/)) {
      if (input.match(/\b(add|new|register|create)\b/)) {
        return "**Adding a New Vehicle** 🚗\n\n1. Go to 'My Vehicles' page\n2. Click the 'Add Vehicle' button\n3. Fill in the details:\n   • Vehicle name/model\n   • License plate number\n   • Any other relevant info\n4. Save your vehicle\n\nOnce added, you can use it to book appointments!";
      }
      if (input.match(/\b(edit|update|change|modify)\b/)) {
        return "**Updating Vehicle Information:**\n\n1. Navigate to 'My Vehicles'\n2. Find the vehicle you want to update\n3. Click the edit button\n4. Make your changes\n5. Save\n\nYou can update vehicle details anytime!";
      }
      if (input.match(/\b(delete|remove)\b/)) {
        return "**Removing a Vehicle:**\n\n1. Go to 'My Vehicles' page\n2. Find the vehicle you want to remove\n3. Click the delete/remove option\n\n⚠️ **Note:** Make sure you don't have any pending appointments for that vehicle!";
      }
      return "I can help you manage your vehicles! You can:\n• Add a new vehicle\n• View all your vehicles\n• Edit vehicle information\n• Remove a vehicle\n\nWhat would you like to do?";
    }
    
    // Service related - comprehensive
    if (input.match(/\b(service|repair|maintenance|fix|work|problem)\b/)) {
      if (input.match(/\b(price|cost|how much|fee|charge|expensive|cheap)\b/)) {
        return "**Service Pricing** 💰\n\nPrices vary by service type. You can see exact pricing when booking an appointment:\n\n1. Go to Appointments page\n2. Select a service\n3. View the price before confirming\n\nWe believe in transparent pricing - no hidden fees! For specific quotes, you can also contact the garage directly.";
      }
      if (input.match(/\b(what|which|types|kind|available|offer)\b/)) {
        return "**Our Services** 🔧\n\nWe offer comprehensive vehicle services:\n\n• 🛢️ Oil changes & fluid checks\n• 🔩 Engine diagnostics & repairs\n• 🚗 Brake system services\n• 🛞 Tire services (rotation, replacement)\n• 🔍 General inspections\n• ⚙️ Transmission services\n• 🔋 Battery & electrical work\n• And much more!\n\nCheck the Appointments page for the complete list!";
      }
      if (input.match(/\b(recommend|suggest|need|should)\b/)) {
        return "**Service Recommendations:**\n\nFor the best advice on what your vehicle needs:\n\n1. Book an inspection appointment\n2. Our mechanics will assess your vehicle\n3. You'll get personalized recommendations\n\nRegular maintenance typically includes:\n• Oil changes every 3,000-5,000 miles\n• Tire rotation every 6,000-8,000 miles\n• Brake inspection annually\n\nWhat specific concerns do you have?";
      }
      return "I can help with service information! Are you looking for:\n• Service types we offer?\n• Pricing information?\n• Service recommendations?\n• How to book a service?\n\nLet me know!";
    }
    
    // Status related - detailed
    if (input.match(/\b(status|progress|check|where|track)\b/) && input.match(/\b(appointment|service|car|vehicle)\b/)) {
      return "**Checking Your Appointment Status** 📊\n\n1. Go to your Dashboard or History page\n2. View all your appointments\n\n**Status Indicators:**\n🟡 **Pending** - Awaiting admin approval\n🔵 **In Progress** - Currently being worked on\n🟢 **Completed** - Service finished, ready for pickup\n🔴 **Cancelled** - Appointment was cancelled\n\nYou'll receive updates as your status changes!";
    }
    
    // Payment related
    if (input.match(/\b(pay|payment|invoice|bill|charge|credit card)\b/)) {
      return "**Payment Information** 💳\n\nPayment details:\n• You'll receive an invoice after service completion\n• Check your Dashboard for invoices\n• Payment methods are handled by the garage\n• Contact the admin for specific payment questions\n\nNeed help with a specific invoice?";
    }
    
    // Hours / Operating time
    if (input.match(/\b(hours|open|close|timing|when.*open|operating)\b/)) {
      return "**Operating Hours** 🕐\n\nFor our current operating hours and availability:\n• Check your Dashboard for contact information\n• Contact the garage directly\n• Hours may vary by location\n\nWhen booking an appointment, you'll see available time slots!";
    }
    
    // Location / Address
    if (input.match(/\b(location|address|where|directions|find)\b/) && !input.match(/\b(vehicle|car)\b/)) {
      return "**Garage Location** 📍\n\nFor location and directions:\n• Check your Dashboard for address details\n• Contact information is available in your account\n• The admin can provide specific directions\n\nNeed help finding us?";
    }
    
    // Emergency / Urgent
    if (input.match(/\b(emergency|urgent|asap|immediately|right now|help)\b/)) {
      return "**Urgent Assistance** 🚨\n\nFor urgent matters:\n1. Contact the garage directly via phone\n2. Check your Dashboard for emergency contact info\n3. If it's a roadside emergency, call emergency services\n\nFor regular appointments, you can book through the system. Is this an emergency?";
    }
    
    // Warranty / Guarantee
    if (input.match(/\b(warranty|guarantee|covered|insurance)\b/)) {
      return "**Warranty & Guarantees** ✅\n\nFor warranty information:\n• Contact the garage admin directly\n• Warranty terms vary by service type\n• Keep your service receipts\n• Check your invoice for warranty details\n\nNeed specific warranty information?";
    }
    
    // Parts
    if (input.match(/\b(parts|spare|component|replace)\b/)) {
      return "**Parts & Replacements** 🔧\n\nFor parts information:\n• Parts are included in service pricing\n• Quality parts are used for all repairs\n• Specific part questions? Contact the admin\n• You can discuss part preferences during your appointment\n\nNeed information about a specific part?";
    }
    
    // Contact related
    if (input.match(/\b(contact|phone|email|call|reach|talk|speak)\b/)) {
      return "**Contact Information** 📞\n\nTo reach the garage:\n• Check your Dashboard for contact details\n• Phone and email are available there\n• You can also message through the system\n• Visit in person during operating hours\n\nHow would you like to get in touch?";
    }
    
    // Time/Duration related
    if (input.match(/\b(how long|duration|take|wait|time)\b/)) {
      return "**Service Duration** ⏱️\n\nTypical service times:\n• Oil change: 30-45 minutes\n• Basic maintenance: 30-60 minutes\n• Brake service: 1-2 hours\n• Major repairs: 2-4+ hours\n• Diagnostics: 30-90 minutes\n\nExact duration depends on:\n• Service type\n• Vehicle condition\n• Parts availability\n\nYou'll get an estimate when booking!";
    }
    
    // Thank you
    if (input.match(/\b(thank|thanks|thx|appreciate)\b/)) {
      const responses = [
        "You're very welcome! 😊 Happy to help anytime!",
        "My pleasure! Let me know if you need anything else!",
        "Glad I could help! Feel free to ask if you have more questions!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Goodbye
    if (input.match(/\b(bye|goodbye|see you|later|exit|quit)\b/)) {
      return "Goodbye! 👋 Feel free to come back anytime you need help with your vehicle services. Drive safe!";
    }
    
    // Check if question is garage-related
    const garageKeywords = ['garage', 'appointment', 'vehicle', 'car', 'service', 'repair', 'maintenance', 
                           'booking', 'schedule', 'mechanic', 'oil', 'tire', 'brake', 'engine', 'inspection',
                           'dashboard', 'admin', 'invoice', 'history'];
    const isGarageRelated = garageKeywords.some(keyword => input.includes(keyword));
    
    if (isGarageRelated) {
      return "I'd be happy to help with that! Could you provide a bit more detail? I can assist with:\n\n📅 Booking & managing appointments\n🚗 Vehicle management\n🔧 Service information & pricing\n📊 Checking appointment status\n💬 General garage questions\n\nWhat specifically would you like to know?";
    }
    
    // For non-garage questions, be polite but redirect
    return "I'm specialized in helping with garage and vehicle services. While I can't answer that particular question, I'm excellent at helping with:\n\n📅 **Appointments** - Scheduling and management\n🚗 **Vehicles** - Adding and tracking your vehicles\n🔧 **Services** - Information about repairs and maintenance\n📊 **Status** - Tracking your service progress\n\nHow can I help with your vehicle needs today?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // If no API key, use fallback immediately
    if (!API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: generateFallbackResponse(userMessage.content)
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      console.log('Using API Key:', API_KEY?.substring(0, 20) + '...');

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Garage Management System'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `You are an intelligent and helpful assistant for a Garage Management System. Your role is to help customers with:

1. APPOINTMENTS: Booking, checking status, modifying, or canceling appointments
2. VEHICLES: Adding, viewing, editing, or removing vehicles from their account
3. SERVICES: Information about repairs, maintenance, pricing, and service types
4. STATUS TRACKING: Checking appointment progress and service completion
5. GENERAL HELP: Answering questions about the garage system

GUIDELINES:
- Be friendly, professional, and concise
- Provide step-by-step instructions when needed
- Use emojis sparingly to make responses engaging
- If asked about non-garage topics, politely redirect to garage-related assistance
- Always prioritize customer satisfaction and clarity
- For technical issues, suggest contacting the admin
- Be proactive in offering related help

RESPONSE STYLE:
- Keep responses under 200 words when possible
- Use bullet points for lists
- Bold important terms using **text**
- Include relevant emojis: 📅 🚗 🔧 📊 💰 ⏱️
- End with a follow-up question when appropriate

Remember: You're here to make the garage management experience smooth and easy!`
            },
            ...messages.filter(m => m.role !== 'system'),
            userMessage
          ]
        })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Use fallback response instead of showing error
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: generateFallbackResponse(userMessage.content)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in border border-gray-200">
          {/* Header */}
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
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
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
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
