
import React from 'react';
import { UserRole, Language } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  currentRole: UserRole;
  setRole: (r: UserRole) => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentRole, setRole, lang }) => {
  const menuItems = [
    { id: UserRole.PASSENGER, label: 'Passenger', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: UserRole.DRIVER, label: 'Driver', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1' },
    { id: UserRole.ADMIN, label: 'Admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-50 md:hidden backdrop-blur-md transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm">Y</div>
              <h1 className="font-extrabold text-sm tracking-tighter text-slate-900 uppercase">Yatri Nepal</h1>
            </div>

            <nav className="space-y-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">User Mode</p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setRole(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-extrabold transition-all duration-300 ${
                    currentRole === item.id 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                  </svg>
                  <span className="uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Nepal Proud</p>
              <p className="text-xs font-bold leading-relaxed">Supporting Local Economic Growth across the Himalayas.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
