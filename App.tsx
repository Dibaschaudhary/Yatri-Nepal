
import React, { useState, useEffect } from 'react';
import { UserRole, Language, TRANSLATIONS, User } from './types';
import PassengerView from './components/PassengerView';
import DriverView from './components/DriverView';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthView from './components/AuthView';
import OnboardingView from './components/OnboardingView';

const VerificationPendingView: React.FC<{ t: any; onLogout: () => void }> = ({ t, onLogout }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="w-full max-w-xl bg-white rounded-[48px] shadow-2xl border-8 border-white p-12 text-center space-y-8 animate-in zoom-in-95 duration-700">
      <div className="relative mx-auto w-32 h-32">
        <div className="absolute inset-0 bg-indigo-100 rounded-[40px] rotate-6"></div>
        <div className="absolute inset-0 bg-indigo-600 rounded-[40px] flex items-center justify-center text-white shadow-2xl">
          <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
      </div>
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">{t.waitingTitle}</h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">{t.waitingSubtitle}</p>
      </div>
      <div className="pt-8 flex flex-col gap-4">
        <button className="w-full bg-slate-100 text-slate-600 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Check Again</button>
        <button onClick={onLogout} className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em] hover:underline">Sign Out</button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('EN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const saved = localStorage.getItem('YATRI_SESSION');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('YATRI_SESSION', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('YATRI_SESSION');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleOnboardingComplete = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl animate-bounce"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthView t={t} onLogin={handleLogin} />;
  }

  // Verification Logic for Drivers
  if (currentUser.role === UserRole.DRIVER) {
    if (!currentUser.onboarded) {
      return <OnboardingView user={currentUser} onComplete={handleOnboardingComplete} t={t} />;
    }
    if (currentUser.kycStatus === 'PENDING') {
      return <VerificationPendingView t={t} onLogout={handleLogout} />;
    }
    if (currentUser.kycStatus === 'REJECTED') {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
           <div className="bg-white p-12 rounded-[48px] text-center border-8 border-white shadow-2xl max-w-md">
              <h2 className="text-2xl font-black text-red-600 mb-4">Application Rejected</h2>
              <p className="text-slate-500 text-sm mb-8">Your documents did not meet our safety standards.</p>
              <button onClick={handleLogout} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">Back to Login</button>
           </div>
        </div>
      );
    }
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentRole={currentUser.role} 
        setRole={(r) => {
          if (r === UserRole.ADMIN && currentUser.role !== UserRole.ADMIN) return;
          setCurrentUser({ ...currentUser, role: r });
        }} 
        lang={lang}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header 
          t={t} 
          lang={lang} 
          setLang={setLang} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentRole={currentUser.role}
          user={currentUser}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
          <div className="relative z-10 h-full">
            {currentUser.role === UserRole.PASSENGER && <PassengerView t={t} currentUser={currentUser} />}
            {currentUser.role === UserRole.DRIVER && <DriverView t={t} />}
            {currentUser.role === UserRole.ADMIN && <AdminDashboard t={t} />}
          </div>
        </div>
      </main>

      <div className="md:hidden bg-white border-t px-6 py-4 flex justify-between items-center shadow-2xl z-50">
        <button 
          onClick={() => setCurrentUser({ ...currentUser, role: UserRole.PASSENGER })}
          className={`flex flex-col items-center gap-1 transition-all ${currentUser.role === UserRole.PASSENGER ? 'text-indigo-600' : 'text-slate-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-black uppercase">Passenger</span>
        </button>
        <button 
          onClick={() => setCurrentUser({ ...currentUser, role: UserRole.DRIVER })}
          className={`flex flex-col items-center gap-1 transition-all ${currentUser.role === UserRole.DRIVER ? 'text-indigo-600' : 'text-slate-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
          <span className="text-[10px] font-black uppercase">Driver</span>
        </button>
        {currentUser.role === UserRole.ADMIN && (
          <button 
            onClick={() => setCurrentUser({ ...currentUser, role: UserRole.ADMIN })}
            className={`flex flex-col items-center gap-1 transition-all ${currentUser.role === UserRole.ADMIN ? 'text-indigo-600' : 'text-slate-300'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="text-[10px] font-black uppercase">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
