
import React, { useState, useEffect } from 'react';
import { VehicleType, TripStatus, User, PaymentMethod } from '../types';
import { getAIFareEstimation, FareEstimate, simulateDriverBids } from '../services/geminiService';
import { useLocation } from '../hooks/useLocation';
import LiveMap from './LiveMap';
import ChatDialog from './ChatDialog';
import CallOverlay from './CallOverlay';

interface PassengerViewProps {
  t: any;
  currentUser: User;
}

const VEHICLES = [
  { type: VehicleType.BIKE, label: 'Moto', icon: '🏍️', desc: 'Fastest through traffic' },
  { type: VehicleType.CAR, label: 'Comfort', icon: '🚗', desc: 'Secure air-conditioned' },
  { type: VehicleType.AUTO, label: 'Auto', icon: '🛺', desc: 'Economic short trips' },
  { type: VehicleType.E_RICKSHAW, label: 'E-Ride', icon: '⚡', desc: 'Green city travel' },
];

const PAYMENT_OPTIONS = [
  { 
    id: PaymentMethod.ESEWA, 
    label: 'eSewa', 
    color: '#60bb46', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp' 
  },
  { 
    id: PaymentMethod.KHALTI, 
    label: 'Khalti', 
    color: '#5c2d91', 
    logo: 'https://blog.khalti.com/wp-content/uploads/2018/11/Khalti-Logo.png' 
  },
  { 
    id: PaymentMethod.IMEPAY, 
    label: 'IME Pay', 
    color: '#ed1c24', 
    logo: 'https://www.imepay.com.np/wp-content/uploads/2021/04/IME-Pay-Logo.png' 
  },
  { 
    id: PaymentMethod.CONNECTIPS, 
    label: 'connectIPS', 
    color: '#1a4a8c', 
    logo: 'https://www.connectips.com/wp-content/uploads/2018/06/cips-logo.png' 
  },
  { 
    id: PaymentMethod.FONEPAY, 
    label: 'FonePay', 
    color: '#db2777', 
    logo: 'https://fonepay.com/wp-content/themes/fonepay/assets/images/fonepay-logo.png' 
  },
  { 
    id: PaymentMethod.CASH, 
    label: 'Cash', 
    color: '#475569', 
    logo: '💵' 
  },
];

const PassengerView: React.FC<PassengerViewProps> = ({ t, currentUser }) => {
  const { location, error: locationError } = useLocation();
  const [tripStatus, setTripStatus] = useState<TripStatus>(TripStatus.IDLE);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [estimation, setEstimation] = useState<FareEstimate | null>(null);
  const [userBid, setUserBid] = useState(0);
  const [bids, setBids] = useState<any[]>([]);
  const [activeDriver, setActiveDriver] = useState<any>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isPaymentSelectorOpen, setIsPaymentSelectorOpen] = useState(false);
  
  const [liveDistance, setLiveDistance] = useState(0);
  const [progress, setProgress] = useState(0);

  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([
    { id: 'sim1', latOffset: 0.002, lngOffset: 0.001, type: 'DRIVER' },
    { id: 'sim2', latOffset: -0.0015, lngOffset: 0.003, type: 'DRIVER' },
    { id: 'sim3', latOffset: 0.0008, lngOffset: -0.0025, type: 'DRIVER' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNearbyDrivers(prev => prev.map(d => ({
        ...d,
        latOffset: d.latOffset + (Math.random() - 0.5) * 0.0001,
        lngOffset: d.lngOffset + (Math.random() - 0.5) * 0.0001
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (tripStatus === TripStatus.IN_PROGRESS && estimation) {
      setLiveDistance(estimation.distanceKm);
      setProgress(0);
      
      interval = setInterval(() => {
        setLiveDistance(prev => {
          const next = Math.max(0, prev - 0.1);
          const total = estimation.distanceKm;
          setProgress(Math.round(((total - next) / total) * 100));
          return Number(next.toFixed(1));
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [tripStatus, estimation]);

  const handleStartEstimation = async () => {
    if (!pickup || !dropoff || !selectedVehicle) return;
    setTripStatus(TripStatus.ESTIMATING);
    const result = await getAIFareEstimation(pickup, dropoff, selectedVehicle);
    setEstimation(result);
    setUserBid(result.estimatedTotal);
    setTripStatus(TripStatus.BIDDING);
  };

  const handlePlaceBid = async () => {
    setTripStatus(TripStatus.FINDING_DRIVER);
    setTimeout(async () => {
      const driverBids = await simulateDriverBids(userBid);
      setBids(driverBids);
    }, 2500);
  };

  const handleAcceptDriver = (driver: any) => {
    setActiveDriver(driver);
    setTripStatus(TripStatus.IN_PROGRESS);
  };

  const resetTrip = () => {
    setTripStatus(TripStatus.IDLE);
    setEstimation(null);
    setBids([]);
    setActiveDriver(null);
    setIsChatOpen(false);
    setIsCalling(false);
    setLiveDistance(0);
    setProgress(0);
    setIsPaymentSelectorOpen(false);
  };

  const currentPaymentInfo = PAYMENT_OPTIONS.find(p => p.id === selectedPayment);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 relative">
      
      <div className="w-full lg:w-[440px] shrink-0 z-20 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {tripStatus === TripStatus.IDLE && (
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 animate-in slide-in-from-left-4 duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Request a Yatri</h2>
            
            <div className="space-y-4 mb-8">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600 shadow-lg shadow-indigo-100"></div>
                <input 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-100 transition-all outline-none" 
                  placeholder="Enter Pickup Point" 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)} 
                />
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-100"></div>
                <input 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-100 transition-all outline-none" 
                  placeholder="Where are you heading?" 
                  value={dropoff} 
                  onChange={(e) => setDropoff(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2">Transport Service</p>
              <div className="grid grid-cols-2 gap-3">
                {VEHICLES.map(v => (
                  <button 
                    key={v.type} 
                    onClick={() => setSelectedVehicle(v.type)} 
                    className={`flex flex-col items-start p-4 rounded-3xl border-2 transition-all duration-300 ${selectedVehicle === v.type ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' : 'bg-white border-slate-50 text-slate-900 hover:border-indigo-100'}`}
                  >
                    <span className="text-3xl mb-2">{v.icon}</span>
                    <span className="text-xs font-extrabold uppercase tracking-tight">{v.label}</span>
                    <span className={`text-[9px] mt-1 font-medium ${selectedVehicle === v.type ? 'text-indigo-200' : 'text-slate-400'}`}>{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-8">
               <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 mb-3">Payment Method</p>
               <button 
                onClick={() => setIsPaymentSelectorOpen(!isPaymentSelectorOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-100 shadow-sm overflow-hidden p-1">
                        {currentPaymentInfo?.logo.startsWith('http') ? (
                          <img src={currentPaymentInfo.logo} className="w-full h-full object-contain" alt={currentPaymentInfo.label} />
                        ) : (
                          <span className="text-lg">{currentPaymentInfo?.logo}</span>
                        )}
                     </div>
                     <span className="text-sm font-bold text-slate-700">{currentPaymentInfo?.label}</span>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${isPaymentSelectorOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
               </button>

               {isPaymentSelectorOpen && (
                 <div className="mt-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2">
                    {PAYMENT_OPTIONS.map(pay => (
                      <button
                        key={pay.id}
                        onClick={() => {
                          setSelectedPayment(pay.id);
                          setIsPaymentSelectorOpen(false);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${selectedPayment === pay.id ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
                      >
                        <div className="w-10 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-100 shadow-sm overflow-hidden p-1">
                          {pay.logo.startsWith('http') ? (
                            <img src={pay.logo} className="w-full h-full object-contain" alt={pay.label} />
                          ) : (
                            <span className="text-sm">{pay.logo}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-700">{pay.label}</span>
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <button 
              onClick={handleStartEstimation} 
              disabled={!pickup || !dropoff || !selectedVehicle} 
              className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-extrabold text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-30 active:scale-95 transition-all"
            >
              Calculate Precise Fare
            </button>
          </div>
        )}

        {tripStatus === TripStatus.ESTIMATING && (
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-[5px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <p className="font-extrabold text-slate-900 text-sm uppercase tracking-[0.2em]">Analyzing KM & Traffic...</p>
          </div>
        )}

        {tripStatus === TripStatus.BIDDING && estimation && (
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trip Breakdown</h2>
               <button onClick={resetTrip} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-3xl border border-indigo-100">
               <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm">🗺️</div>
               <div>
                  <p className="text-sm font-black text-indigo-900">{estimation.distanceKm} KM • {estimation.durationMinutes} MIN</p>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{estimation.suggestedRoute}</p>
               </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3">
               <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Base Charge</span>
                  <span className="text-slate-900">NPR {estimation.baseFare}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Distance ({estimation.distanceKm}km)</span>
                  <span className="text-slate-900">NPR {estimation.distanceTotal}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Time Estimate</span>
                  <span className="text-slate-900">NPR {estimation.timeTotal}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                  <span>Surge / Demand</span>
                  <span>x{estimation.surgeMultiplier}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold text-indigo-600 uppercase tracking-widest pt-2 mt-2 border-t border-slate-200">
                  <span>Payment Method</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 overflow-hidden">
                      {currentPaymentInfo?.logo.startsWith('http') ? (
                        <img src={currentPaymentInfo.logo} className="w-full h-full object-contain" alt={currentPaymentInfo.label} />
                      ) : (
                        <span>{currentPaymentInfo?.logo}</span>
                      )}
                    </div>
                    <span>{currentPaymentInfo?.label}</span>
                  </div>
               </div>
               <div className="pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-black text-slate-900 uppercase">Total Estimate</span>
                  <span className="text-3xl font-black text-slate-900">NPR {estimation.estimatedTotal}</span>
               </div>
            </div>

            <div className="text-center p-8 bg-indigo-600 rounded-[32px] text-white shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-4">Final Bid (NPR)</p>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setUserBid(prev => Math.max(0, prev - 10))} className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-2xl font-black transition-colors">-</button>
                <p className="text-5xl font-black tabular-nums">{userBid}</p>
                <button onClick={() => setUserBid(prev => prev + 10)} className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-2xl font-black transition-colors">+</button>
              </div>
            </div>

            <button onClick={handlePlaceBid} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-extrabold text-lg shadow-2xl hover:bg-black transition-all">Confirm Booking</button>
          </div>
        )}

        {tripStatus === TripStatus.FINDING_DRIVER && (
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col gap-6 max-h-full overflow-hidden">
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 border-[5px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-extrabold text-slate-900">Locating Drivers</h3>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">{bids.length || 'Scanning'} Offers Nearby</p>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-1">
              {bids.map((bid) => (
                <div key={bid.id} className="p-5 bg-white border border-slate-100 rounded-3xl flex justify-between items-center hover:shadow-lg transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${bid.id}/120/120`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <p className="font-extrabold text-slate-900 text-sm leading-none mb-1">{bid.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">★ {bid.rating} • {bid.time} away</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-indigo-600">NPR {bid.bid}</p>
                      <button onClick={() => handleAcceptDriver(bid)} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest mt-1 group-hover:bg-indigo-600 transition-colors">Accept</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tripStatus === TripStatus.IN_PROGRESS && activeDriver && (
          <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-3xl bg-slate-100 overflow-hidden border-2 border-indigo-50">
                      <img src={`https://picsum.photos/seed/${activeDriver.id}/200/200`} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{activeDriver.name}</h3>
                      <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">{activeDriver.vehicle}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fixed Fare</p>
                   <p className="text-xl font-black text-slate-900">NPR {activeDriver.bid}</p>
                   <div className="flex items-center justify-end gap-1 mt-1">
                      <div className="w-6 h-4 overflow-hidden p-[2px] bg-white border border-slate-100 rounded">
                        {currentPaymentInfo?.logo.startsWith('http') ? (
                          <img src={currentPaymentInfo.logo} className="w-full h-full object-contain" alt={currentPaymentInfo.label} />
                        ) : (
                          <span className="text-[8px]">{currentPaymentInfo?.logo}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-400">{currentPaymentInfo?.label}</span>
                   </div>
                </div>
             </div>

             <div className="p-6 bg-slate-950 rounded-[32px] text-white space-y-4">
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Odometer</p>
                      <p className="text-3xl font-black tabular-nums">{liveDistance} <span className="text-sm font-medium opacity-60">KM LEFT</span></p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Status</p>
                      <p className="text-xs font-black uppercase text-emerald-400">{progress === 100 ? 'Arrived' : 'In Motion'}</p>
                   </div>
                </div>
                
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                   <div 
                    className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                    style={{ width: `${progress}%` }}
                   />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase tracking-widest">
                   <span>{pickup}</span>
                   <span>{progress}% Completed</span>
                   <span>{dropoff}</span>
                </div>
             </div>

             <div className="flex gap-4 pt-2">
                <button onClick={() => window.alert('Emergency Alert Sent!')} className="flex-1 bg-rose-50 text-rose-600 py-4 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-colors border border-rose-100">Safety SOS</button>
                <button onClick={() => setIsChatOpen(true)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-black transition-colors shadow-lg">Chat Driver</button>
             </div>
             
             <button onClick={resetTrip} className="w-full text-slate-400 py-2 rounded-xl text-[9px] font-extrabold uppercase tracking-widest hover:text-rose-500 transition-colors">Finish Trip</button>
          </div>
        )}
      </div>

      <div className="flex-1 rounded-[48px] relative overflow-hidden shadow-2xl bg-slate-200 border-8 border-white min-h-[400px]">
         <LiveMap 
           userLocation={location} 
           className="w-full h-full" 
           zoom={mapZoom}
           additionalMarkers={nearbyDrivers}
         />
         <div className="absolute top-8 right-8 flex flex-col gap-3">
            <button onClick={() => setMapZoom(z => Math.min(3, z + 0.5))} className="w-12 h-12 glass-panel rounded-2xl shadow-xl flex items-center justify-center font-bold text-slate-900 hover:bg-white transition-all active:scale-95">+</button>
            <button onClick={() => setMapZoom(z => Math.max(0.5, z - 0.5))} className="w-12 h-12 glass-panel rounded-2xl shadow-xl flex items-center justify-center font-bold text-slate-900 hover:bg-white transition-all active:scale-95">-</button>
         </div>
         
         {locationError && (
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-rose-200/50">
             <span className="text-xl">📍</span>
             <p className="text-[10px] font-extrabold text-rose-800 uppercase tracking-widest">
               GPS Disabled. Defaulting to Kathmandu Center.
             </p>
           </div>
         )}
      </div>

      {activeDriver && (
        <>
          <ChatDialog 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            recipient={{ name: activeDriver.name, avatar: `https://picsum.photos/seed/${activeDriver.id}/200/200`, role: 'Driver' }}
            currentUser={currentUser}
            onCall={() => { setIsChatOpen(false); setIsCalling(true); }}
          />
          <CallOverlay 
            isOpen={isCalling} 
            onEnd={() => setIsCalling(false)} 
            recipient={{ name: activeDriver.name, avatar: `https://picsum.photos/seed/${activeDriver.id}/200/200`, role: 'Driver' }}
          />
        </>
      )}
    </div>
  );
};

export default PassengerView;
