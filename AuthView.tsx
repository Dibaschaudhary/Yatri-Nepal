
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
  t: any;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, t }) => {
  const [role, setRole] = useState<UserRole>(UserRole.PASSENGER);
  const [phone, setPhone] = useState('');
  const [carrier, setCarrier] = useState<'Ncell' | 'Namaste' | 'Other'>('Other');
  const [view, setView] = useState<'SELECTION' | 'PHONE'>('SELECTION');
  const [error, setError] = useState<string | null>(null);

  const isAdminNumber = phone === '9800000000';

  const detectCarrier = (val: string) => {
    setError(null);
    setPhone(val);
    if (val.startsWith('980') || val.startsWith('981') || val.startsWith('982') || val.startsWith('970')) {
      setCarrier('Ncell');
    } else if (val.startsWith('984') || val.startsWith('985') || val.startsWith('986') || val.startsWith('974') || val.startsWith('975')) {
      setCarrier('Namaste');
    } else {
      setCarrier('Other');
    }
  };

  const handleGoogleLogin = () => {
    onLogin({
      id: 'G-' + Math.random().toString(36).substr(2, 9),
      name: 'Binod Chaudhary',
      role: role,
      email: 'binod@nepal.com',
      avatar: 'https://picsum.photos/seed/binod/100/100',
      rating: 5.0,
      kycStatus: 'NOT_STARTED'
    });
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Enter a valid 10-digit number");
      return;
    }

    if (phone === '9800000000') {
      onLogin({
        id: 'ADMIN-ROOT',
        name: 'System Admin',
        role: UserRole.ADMIN,
        phone: phone,
        carrier: 'Other',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff',
        rating: 5.0,
        kycStatus: 'APPROVED',
        onboarded: true
      });
      return;
    }

    onLogin({
      id: 'P-' + phone,
      name: carrier === 'Ncell' ? 'Ncell User' : 'Namaste User',
      role: role,
      phone: phone,
      carrier: carrier,
      avatar: `https://picsum.photos/seed/${phone}/200/200`,
      rating: 4.9,
      kycStatus: 'NOT_STARTED'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[160px] -mr-48 -mt-48 transition-all duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] -ml-48 -mb-48 transition-all duration-1000"></div>

      <div className="w-full max-w-[480px] bg-white rounded-[64px] shadow-2xl p-12 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center text-white font-black text-4xl shadow-2xl mx-auto mb-8 transition-transform hover:scale-105 duration-500">
            Y
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            {isAdminNumber ? 'Admin Control' : 'Yatri Nepal'}
          </h1>
          <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
            Premium Mobility Solutions for the Kathmandu Valley and beyond.
          </p>
        </div>

        {view === 'SELECTION' ? (
          <div className="space-y-8">
            <div className="flex bg-slate-100/50 p-1.5 rounded-[28px] gap-1.5">
              {(Object.values(UserRole)).map((r) => (
                <button 
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${role === r ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {role !== UserRole.ADMIN && (
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white border border-slate-100 rounded-[28px] hover:border-indigo-100 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
                  <span className="text-sm font-extrabold text-slate-900 tracking-tight">Continue with Google</span>
                </button>
              )}

              <button 
                onClick={() => setView('PHONE')}
                className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
              >
                Use Phone Number
              </button>
            </div>

            <div className="text-center">
              <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.3em] mb-6">Payment Network Partners</p>
              <div className="flex justify-center items-center gap-8 opacity-40 hover:opacity-100 transition-all duration-700">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp" className="h-4 object-contain" alt="eSewa" />
                 <img src="https://blog.khalti.com/wp-content/uploads/2018/11/Khalti-Logo.png" className="h-4 object-contain" alt="Khalti" />
                 <img src="https://www.imepay.com.np/wp-content/uploads/2021/04/IME-Pay-Logo.png" className="h-4 object-contain" alt="IME Pay" />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePhoneSubmit} className="space-y-8 animate-in slide-in-from-right-8 duration-500">
             <div className="space-y-6">
               <button type="button" onClick={() => setView('SELECTION')} className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-colors">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                 Back to Choice
               </button>
               
               <div className="relative group">
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-4 border-slate-100">
                    <span className="text-sm font-black text-slate-400">+977</span>
                 </div>
                 <input 
                  type="tel"
                  autoFocus
                  maxLength={10}
                  className="w-full pl-24 pr-16 py-6 bg-slate-50 border-2 border-transparent rounded-[32px] text-xl font-black tracking-widest focus:bg-white focus:border-indigo-100 transition-all outline-none"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => detectCarrier(e.target.value.replace(/\D/g, ''))}
                 />
                 <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    {carrier === 'Ncell' && <span className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg">NC</span>}
                    {carrier === 'Namaste' && <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg">NT</span>}
                 </div>
               </div>
               
               {error && <p className="text-[11px] font-bold text-rose-500 text-center animate-pulse">{error}</p>}
             </div>

             <button 
              type="submit"
              disabled={phone.length < 10}
              className="w-full py-6 bg-indigo-600 text-white rounded-[32px] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-30"
             >
              Verify & Enter
             </button>

             <p className="text-[10px] text-center text-slate-300 leading-relaxed font-medium">
               By continuing, you agree to Yatri Nepal's professional terms of service and safety protocols.
             </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthView;
