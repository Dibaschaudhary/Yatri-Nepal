
import React, { useState, useEffect } from 'react';

interface CallOverlayProps {
  isOpen: boolean;
  onEnd: () => void;
  recipient: { name: string; avatar: string; role: string };
}

const CallOverlay: React.FC<CallOverlayProps> = ({ isOpen, onEnd, recipient }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900 flex flex-col items-center justify-between p-12 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-slate-950 pointer-events-none"></div>
      
      <div className="relative z-10 text-center space-y-6 mt-12 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-40 h-40">
           <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
           <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse [animation-delay:0.5s]"></div>
           <img src={recipient.avatar} className="relative w-full h-full rounded-full object-cover border-4 border-white/10 shadow-2xl" alt={recipient.name} />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tight">{recipient.name}</h2>
          <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Yatri Secure {recipient.role} Call</p>
        </div>
        <p className="text-2xl font-black font-mono tabular-nums opacity-60">{formatTime(seconds)}</p>
      </div>

      <div className="relative z-10 w-full max-w-sm grid grid-cols-3 gap-8 mb-12">
        <button className="flex flex-col items-center gap-3 group">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Mute</span>
        </button>
        <button onClick={onEnd} className="flex flex-col items-center gap-3 group">
          <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-900/50 group-hover:bg-rose-600 transition-all group-active:scale-90 transform">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">End Call</span>
        </button>
        <button className="flex flex-col items-center gap-3 group">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Speaker</span>
        </button>
      </div>
    </div>
  );
};

export default CallOverlay;
