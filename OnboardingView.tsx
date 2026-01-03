
import React, { useState } from 'react';
import { User, VehicleType } from '../types';
import { adminService } from '../services/adminService';

interface OnboardingViewProps {
  user: User;
  onComplete: (updatedUser: User) => void;
  t: any;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ user, onComplete, t }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.name,
    secondaryPhone: '',
    citizenshipNumber: '',
    vehicleType: VehicleType.BIKE,
    vehiclePlate: '',
    vehicleModel: '',
    idFrontName: '',
    idBackName: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create driver entry in shared DB
    await adminService.registerNewDriver({
      ...user,
      name: formData.fullName,
      vehicleType: formData.vehicleType
    });

    setTimeout(() => {
      onComplete({
        ...user,
        onboarded: true,
        name: formData.fullName,
        kycStatus: 'PENDING'
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-10 px-4">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
            {s}
          </div>
          {s < 3 && <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-[48px] shadow-2xl border-8 border-white p-10 animate-in fade-in zoom-in-95 duration-500">
        {isSubmitting ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="font-black text-slate-800 uppercase tracking-widest text-xs">Uploading Documents...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.onboardingTitle}</h2>
              <p className="text-slate-500 font-medium text-sm">{t.onboardingSubtitle}</p>
            </div>

            <StepIndicator />

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.personalInfo}</h3>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100"
                    placeholder="Full Legal Name"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100"
                    placeholder="Citizenship Number"
                    value={formData.citizenshipNumber}
                    onChange={e => setFormData({...formData, citizenshipNumber: e.target.value})}
                    required
                  />
                  <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-indigo-100">Continue</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.vehicleInfo}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(VehicleType).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, vehicleType: type})}
                        className={`p-4 rounded-2xl border-2 font-black text-xs uppercase transition-all ${formData.vehicleType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100"
                    placeholder="Plate Number"
                    value={formData.vehiclePlate}
                    onChange={e => setFormData({...formData, vehiclePlate: e.target.value})}
                    required
                  />
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 py-5 rounded-3xl font-black">Back</button>
                    <button type="button" onClick={nextStep} className="flex-[2] bg-indigo-600 text-white py-5 rounded-3xl font-black">Next</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.kycInfo}</h3>
                  <div className="grid gap-4">
                    <label className="p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer hover:bg-indigo-50">
                      <p className="text-xs font-black text-slate-400 uppercase">{formData.idFrontName || 'Upload Citizenship Front'}</p>
                      <input type="file" className="hidden" onChange={(e) => setFormData({...formData, idFrontName: e.target.files?.[0]?.name || ''})} />
                    </label>
                    <label className="p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer hover:bg-indigo-50">
                      <p className="text-xs font-black text-slate-400 uppercase">{formData.idBackName || 'Upload Citizenship Back'}</p>
                      <input type="file" className="hidden" onChange={(e) => setFormData({...formData, idBackName: e.target.files?.[0]?.name || ''})} />
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 bg-slate-100 py-5 rounded-3xl font-black">Back</button>
                    <button type="submit" className="flex-[2] bg-green-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-green-100">Submit Application</button>
                  </div>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingView;
