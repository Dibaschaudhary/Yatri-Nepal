
import { DriverRecord, TripRecord, VehicleType, PaymentMethod } from '../types';

const STORAGE_KEY = 'YATRI_DRIVERS_DB';

const initialDrivers: DriverRecord[] = [
  { id: 'DRV001', name: 'Kushal Gurung', phone: '9841234567', vehicleType: VehicleType.CAR, vehicleNumber: 'BA 1 PA 1234', status: 'PENDING', region: 'Pokhara', joinedDate: '2023-10-15', totalEarnings: 0 },
  { id: 'DRV002', name: 'Sita Sharma', phone: '9801122334', vehicleType: VehicleType.BIKE, vehicleNumber: 'BA 67 PA 9988', status: 'APPROVED', region: 'Kathmandu', joinedDate: '2023-09-10', totalEarnings: 15400 },
  { id: 'DRV003', name: 'Binod Magar', phone: '9811223344', vehicleType: VehicleType.AUTO, vehicleNumber: 'BA 2 PA 4567', status: 'APPROVED', region: 'Biratnagar', joinedDate: '2023-11-01', totalEarnings: 8900 },
];

const trips: TripRecord[] = [
  { id: 'TRP101', passengerName: 'Ramesh Adhikari', driverName: 'Sita Sharma', pickup: 'New Baneshwor', dropoff: 'Thamel', fare: 250, paymentMethod: PaymentMethod.ESEWA, timestamp: '2023-12-07 10:30', status: 'COMPLETED' },
  { id: 'TRP102', passengerName: 'Maya Thapa', driverName: 'Binod Magar', pickup: 'Patan', dropoff: 'Koteshwor', fare: 180, paymentMethod: PaymentMethod.KHALTI, timestamp: '2023-12-07 11:15', status: 'COMPLETED' },
];

const getStoredDrivers = (): DriverRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialDrivers;
};

const saveDrivers = (drivers: DriverRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
};

export const adminService = {
  getDrivers: () => Promise.resolve(getStoredDrivers()),
  
  registerNewDriver: (user: any) => {
    const drivers = getStoredDrivers();
    if (!drivers.find(d => d.phone === user.phone)) {
      const newDriver: DriverRecord = {
        id: 'DRV-' + Date.now(),
        name: user.name,
        phone: user.phone || '',
        vehicleType: VehicleType.BIKE,
        vehicleNumber: 'BA XX PA XXXX',
        status: 'PENDING',
        region: 'Kathmandu',
        joinedDate: new Date().toISOString().split('T')[0],
        totalEarnings: 0
      };
      saveDrivers([...drivers, newDriver]);
    }
    return Promise.resolve(true);
  },

  approveDriver: (id: string) => {
    const drivers = getStoredDrivers().map(d => 
      d.id === id ? { ...d, status: 'APPROVED' as const } : d
    );
    saveDrivers(drivers);
    return Promise.resolve(true);
  },
  
  rejectDriver: (id: string) => {
    const drivers = getStoredDrivers().map(d => 
      d.id === id ? { ...d, status: 'REJECTED' as const } : d
    );
    saveDrivers(drivers);
    return Promise.resolve(true);
  },
  
  getTrips: () => Promise.resolve([...trips]),
  
  getStats: async () => {
    const currentDrivers = getStoredDrivers();
    return {
      totalRides: 45231,
      revenueNPR: 1250000,
      activeDrivers: currentDrivers.filter(d => d.status === 'APPROVED').length,
      pendingVerifications: currentDrivers.filter(d => d.status === 'PENDING').length,
      growthData: [
        { name: 'Jul', rides: 3200 },
        { name: 'Aug', rides: 3800 },
        { name: 'Sep', rides: 4200 },
        { name: 'Oct', rides: 4800 },
        { name: 'Nov', rides: 5500 },
        { name: 'Dec', rides: 6100 },
      ],
      vehicleSplit: [
        { name: 'Bikes', value: currentDrivers.filter(d => d.vehicleType === VehicleType.BIKE).length + 450, color: '#4F46E5' },
        { name: 'Cars', value: 300, color: '#10B981' },
        { name: 'Autos', value: 200, color: '#F59E0B' },
        { name: 'E-Rickshaws', value: 150, color: '#EC4899' },
      ]
    };
  }
};
