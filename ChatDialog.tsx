
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: { name: string; avatar: string; role: string };
  currentUser: User;
  onCall: () => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose, recipient, currentUser, onCall }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateResponse = async (userMsg: string) => {
    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(async () => {
      let reply = "Okay, I'll be there in a minute.";
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `You are a professional ${recipient.role} in Nepal for Yatri Nepal ride-hailing app. 
          Respond briefly to the passenger/driver who just said: "${userMsg}". 
          Be polite and professional. Keep it under 15 words.`,
        });
        reply = response.text || reply;
      } catch (e) {
        console.error("AI Chat Error:", e);
      }

      const aiMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'recipient',
        text: reply,
        timestamp: new Date(),
        isRead: true
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    simulateResponse(inputText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={recipient.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-lg" alt={recipient.name} />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{recipient.name}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online Now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onCall} className="p-3 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-2xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </button>
            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure encrypted chat</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                msg.senderId === currentUser.id 
                  ? 'bg-indigo-600 text-white rounded-br-lg' 
                  : 'bg-white text-slate-800 rounded-bl-lg border border-slate-100'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-1.5 opacity-60 flex items-center gap-1 ${msg.senderId === currentUser.id ? 'justify-end' : ''}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.senderId === currentUser.id && (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-3xl rounded-bl-lg border border-slate-100 flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {['I am here', 'Traffic is heavy', 'Almost there', 'Near the gate'].map(chip => (
              <button 
                key={chip} 
                onClick={() => { setInputText(chip); handleSendMessage(); }}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-slate-50 px-6 py-4 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;
