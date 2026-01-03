
import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import LiveMap from './LiveMap';
import { PaymentMethod } from '../types';

interface DriverViewProps {
  t: any;
}

const DriverView: React.FC<DriverViewProps> = ({ t }) => {
  const { location, error: locationError } = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [nearbyRequests, setNearbyRequests] = useState<any[]>([]);
  
  const mockRequests = [
    { id: '1', pickup: 'New Baneshwor', dropoff: 'Thamel', fare: 250, type: 'CAR', distance: '4.2 km', latOffset: 0.005, lngOffset: -0.003 },
    { id: '2', pickup: 'Patan Durbar Square', dropoff: 'Koteshwor', fare: 180, type: 'AUTO', distance: '3.1 km', latOffset: -0.002, lngOffset: 0.004 },
  ];

  useEffect(() => {
    if (isOnline) {
      setNearbyRequests(mockRequests.map(r => ({
        id: r.id,
        latOffset: r.latOffset,
        lngOffset: r.lngOffset,
        type: 'TRIP',
        label: `Rs. ${r.fare}`
      })));
    } else {
      setNearbyRequests([]);
    }
  }, [isOnline]);

  const wallets = [
    { 
      id: PaymentMethod.ESEWA, 
      label: 'eSewa', 
      color: '#60bb46', 
      balance: 1250, 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp' 
    },
    { 
      id: PaymentMethod.KHALTI, 
      label: 'Khalti', 
      color: '#5c2d91', 
      balance: 840, 
      logo: 'https://blog.khalti.com/wp-content/uploads/2018/11/Khalti-Logo.png' 
    },
    { 
      id: PaymentMethod.IMEPAY, 
      label: 'IME Pay', 
      color: '#ed1c24', 
      balance: 0, 
      logo: 'https://www.imepay.com.np/wp-content/uploads/2021/04/IME-Pay-Logo.png' 
    },
    { 
      id: PaymentMethod.CONNECTIPS, 
      label: 'connectIPS', 
      color: '#1a4a8c', 
      balance: 4500, 
      logo: 'https://www.connectips.com/wp-content/uploads/2018/06/cips-logo.png' 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-slate-100 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6">
           <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-[0.2em] border border-emerald-100">Verified Partner</span>
        </div>
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-[40px] border-4 border-slate-50 shadow-2xl overflow-hidden">
              <img src="https://picsum.photos/seed/driver_ramesh/200/200" className="w-full h-full object-cover" alt="Driver" />
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white shadow-xl transition-all duration-500 ${isOnline ? 'bg-emerald-500 scale-110' : 'bg-slate-300'}`}></div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Namaste, Ramesh</h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-amber-400 text-sm tracking-widest font-black">★★★★★</div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">4.9 • 1.2k RIDES</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
          <div className="text-center sm:text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Life-Time Earnings</p>
            <p className="text-4xl font-black text-indigo-600 tabular-nums">NPR 1,450</p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight mt-1">0% Deductions applied</p>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-10 py-5 rounded-[28px] font-black text-lg transition-all transform active:scale-95 shadow-2xl ${
              isOnline 
                ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 shadow-rose-100' 
                : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-3">
               <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">Real-Time Feed</h3>
               {isOnline && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>}
             </div>
             <button className="text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:underline decoration-2">Auto-Refreshed</button>
          </div>
          
          {!isOnline ? (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[64px] p-24 text-center space-y-8">
              <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-200 group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="max-w-xs mx-auto">
                <p className="text-2xl font-black text-slate-900 tracking-tight">System Idle</p>
                <p className="text-sm text-slate-400 font-medium mt-3 leading-relaxed">Toggle "Go Online" to start seeing passenger requests across your city.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-[400px] rounded-[56px] overflow-hidden border-8 border-white shadow-2xl relative">
                <LiveMap userLocation={location} className="w-full h-full" additionalMarkers={nearbyRequests} />
                <div className="absolute top-6 left-6 glass-panel text-slate-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/50">
                  Patrolling Kathmandu
                </div>
              </div>

              {mockRequests.map((req) => (
                <div key={req.id} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 group animate-in slide-in-from-left-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-6">
                    <div className="flex gap-6">
                      <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center text-5xl group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500 shadow-inner">
                        {req.type === 'CAR' ? '🚗' : '🛺'}
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{req.pickup}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 
                          to {req.dropoff} • {req.distance}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-6 sm:p-0 rounded-3xl w-full sm:w-auto border border-slate-100 sm:border-0">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Expected Earnings</p>
                      <p className="text-4xl font-black text-indigo-600 tabular-nums">NPR {req.fare}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-[3] bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Accept Ride</button>
                    <button className="flex-1 bg-slate-50 text-slate-400 py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">Pass</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-100 border border-slate-100 space-y-8">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.3em]">Settlement Hub</h3>
            <div className="space-y-4">
               {wallets.map(wallet => (
                 <div key={wallet.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm overflow-hidden p-1">
                        <img src={wallet.logo} className="w-full h-full object-contain" alt={wallet.label} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{wallet.label}</p>
                        <p className="text-xs font-black text-slate-700 tabular-nums">Rs. {wallet.balance}</p>
                      </div>
                    </div>
                    <button className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Withdraw</button>
                 </div>
               ))}
            </div>
            <div className="pt-6 border-t border-slate-100 text-center">
               <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">Real-time settlement to all major Nepali digital wallets supported.</p>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-125">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
            </div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Support Center</p>
            <p className="text-2xl font-black mb-6 leading-tight">Need help with a Trip?</p>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed font-medium">Our 24/7 support line is always open for driver partners across Nepal.</p>
            <button className="w-full bg-white text-slate-900 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverView;
