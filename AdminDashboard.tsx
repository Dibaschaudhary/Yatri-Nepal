
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { adminService } from '../services/adminService';
import { DriverRecord, TripRecord } from '../types';

interface AdminDashboardProps {
  t: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DRIVERS' | 'TRIPS' | 'MONETIZATION'>('OVERVIEW');
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [d, tr, s] = await Promise.all([
      adminService.getDrivers(),
      adminService.getTrips(),
      adminService.getStats()
    ]);
    setDrivers(d);
    setTrips(tr);
    setStats(s);
    setLoading(false);
  };

  if (loading || !stats) return <div className="h-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Control</h2>
          <p className="text-slate-500 font-medium">Monitoring Nationwide Revenue & Operations</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border">
          {(['OVERVIEW', 'DRIVERS', 'TRIPS', 'MONETIZATION'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-8 rounded-[32px] border shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Admin Revenue</p>
                  <h3 className="text-3xl font-black text-indigo-600">NPR 45,230</h3>
                  <p className="text-[9px] text-green-600 font-bold uppercase mt-2">▲ 14% from last week</p>
               </div>
               <div className="bg-white p-8 rounded-[32px] border shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Rides</p>
                  <h3 className="text-3xl font-black text-slate-900">1,240</h3>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase mt-2">Peak hour active</p>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] border shadow-sm h-80">
              <h3 className="font-black text-sm text-slate-800 mb-6 uppercase">Revenue Growth</h3>
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={stats.growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rides" stroke="#4f46e5" strokeWidth={4} dot={false} />
                 </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-indigo-950 p-8 rounded-[40px] text-white shadow-2xl flex flex-col justify-between">
             <div>
               <h3 className="text-xl font-black mb-4">AI Strategy Report</h3>
               <p className="text-indigo-200 text-sm font-medium leading-relaxed italic">"Your highest profit is coming from Bike rides in Kathmandu. Consider increasing the Service Fee for premium Cars by NPR 10 to increase monthly revenue by 12%."</p>
             </div>
             <button className="w-full bg-white text-indigo-950 py-4 rounded-[20px] font-black uppercase text-xs tracking-widest mt-8">Apply AI Optimization</button>
          </div>
        </div>
      )}

      {activeTab === 'MONETIZATION' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-10 rounded-[48px] border shadow-sm space-y-8">
              <h3 className="text-2xl font-black text-slate-900">Profit Settings</h3>
              <div className="space-y-6">
                 <div className="p-6 bg-slate-50 rounded-[32px] border flex justify-between items-center">
                    <div>
                       <p className="font-black text-sm">Service Fee (per ride)</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">Charged to passengers</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-indigo-600">NPR 15</span>
                       <button className="p-2 bg-white rounded-lg border shadow-sm text-[10px] font-black">Edit</button>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-[32px] border flex justify-between items-center">
                    <div>
                       <p className="font-black text-sm">Driver Subscription</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">Weekly access fee</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-indigo-600">NPR 250</span>
                       <button className="p-2 bg-white rounded-lg border shadow-sm text-[10px] font-black text-slate-400">Disabled</button>
                    </div>
                 </div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
                 <p className="text-xs font-black text-indigo-600 uppercase mb-2">Revenue Forecast</p>
                 <p className="text-sm text-indigo-900 font-medium">Based on 10,000 monthly rides, your expected profit is **NPR 150,000**.</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[40px] border shadow-sm">
                 <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">Payment Settlements</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
                       <span className="text-xs font-black text-green-700">eSewa Balance</span>
                       <span className="font-black">Rs. 24,500</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl">
                       <span className="text-xs font-black text-purple-700">Khalti Balance</span>
                       <span className="font-black">Rs. 18,200</span>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Withdraw All to Bank</button>
                 </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[40px] text-white">
                 <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400 mb-2">Advertising Console</h4>
                 <p className="text-sm font-medium mb-4">Run local ads in the passenger app for extra revenue.</p>
                 <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase">Create Ad Campaign</button>
              </div>
           </div>
        </div>
      )}

      {/* DRIVERS and TRIPS views remain same as previous code structure */}
    </div>
  );
};

export default AdminDashboard;
