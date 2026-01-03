
import React, { useState } from 'react';
import { UserRole, Language, User } from '../types';

interface HeaderProps {
  t: any;
  lang: Language;
  setLang: (l: Language) => void;
  toggleSidebar: () => void;
  currentRole: UserRole;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ t, lang, setLang, toggleSidebar, currentRole, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-100">Y</div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900">YATRI NEPAL</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentRole}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex bg-slate-100/50 p-1 rounded-xl">
          <button 
            onClick={() => setLang('EN')}
            className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all ${lang === 'EN' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('NP')}
            className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-all ${lang === 'NP' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            NP
          </button>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.carrier || 'Nepal Network'}</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-50 mb-1">
                 <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1">Passenger Rating</p>
                 <div className="flex items-center gap-1">
                    <span className="text-lg font-black text-slate-900">{user.rating}</span>
                    <span className="text-indigo-600 text-sm">★</span>
                 </div>
              </div>
              <div className="p-1 space-y-1">
                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Trip History</button>
                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Payment Methods</button>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 rounded-xl transition-colors uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
