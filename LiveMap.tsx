
import React, { useMemo } from 'react';
import { LocationCoords } from '../hooks/useLocation';

interface Marker {
  id: string;
  latOffset: number; // Offset from user location for simulation
  lngOffset: number;
  type: 'DRIVER' | 'PASSENGER' | 'TRIP' | 'USER';
  label?: string;
}

interface LiveMapProps {
  userLocation: LocationCoords | null;
  additionalMarkers?: Marker[];
  className?: string;
  zoom?: number;
}

const LiveMap: React.FC<LiveMapProps> = ({ userLocation, additionalMarkers = [], className = '', zoom = 1 }) => {
  // Simulate Kathmandu coordinates if location is denied/null for demo purposes
  const center = userLocation || { latitude: 27.7172, longitude: 85.3240, accuracy: 10 };

  // Map markers to screen positions (simulated projection)
  const renderedMarkers = useMemo(() => {
    return [
      { id: 'me', latOffset: 0, lngOffset: 0, type: 'USER' as const, label: 'You' },
      ...additionalMarkers
    ].map(marker => {
      // Very basic local projection for demo - 1 deg ~ 111km
      // We'll use offsets to keep markers in the view
      const top = 50 - (marker.latOffset * 1000 * zoom);
      const left = 50 + (marker.lngOffset * 1000 * zoom);
      
      return { ...marker, top, left };
    });
  }, [additionalMarkers, zoom]);

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {/* Background Grid & Pattern */}
      <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/streets-v2/static/85.324,27.717,13/800x600.png?key=get_your_own_key')] bg-cover opacity-60 mix-blend-multiply transition-transform duration-1000 ease-out" style={{ transform: `scale(${1 + (zoom * 0.1)})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none" />
      
      {/* Markers Container */}
      <div className="absolute inset-0">
        {renderedMarkers.map((marker) => (
          <div 
            key={marker.id}
            className="absolute transition-all duration-1000 ease-in-out"
            style={{ 
              top: `${marker.top}%`, 
              left: `${marker.left}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative group">
              {marker.type === 'USER' && (
                <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20 scale-[4]"></div>
              )}
              
              <div className={`
                relative z-10 w-8 h-8 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white
                transition-transform group-hover:scale-125
                ${marker.type === 'USER' ? 'bg-indigo-600' : 
                  marker.type === 'DRIVER' ? 'bg-green-600' : 
                  marker.type === 'TRIP' ? 'bg-red-500' : 'bg-slate-700'}
              `}>
                {marker.type === 'USER' && <span className="text-[10px] text-white">📍</span>}
                {marker.type === 'DRIVER' && <span className="text-sm">🏍️</span>}
                {marker.type === 'TRIP' && <span className="text-[10px]">🏁</span>}
              </div>

              {marker.label && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                  {marker.label}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map UI */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Live Location</p>
          <p className="text-[10px] font-bold text-slate-800 tabular-nums">
            {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Accuracy Ring */}
      <div 
        className="absolute w-32 h-32 border-2 border-indigo-400/20 rounded-full animate-pulse pointer-events-none"
        style={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%) scale(1.5)' 
        }}
      />
    </div>
  );
};

export default LiveMap;
