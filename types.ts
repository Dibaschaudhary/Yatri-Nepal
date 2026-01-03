
export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum VehicleType {
  CAR = 'CAR',
  BIKE = 'BIKE',
  AUTO = 'AUTO',
  E_RICKSHAW = 'E_RICKSHAW'
}

export enum TripStatus {
  IDLE = 'IDLE',
  ESTIMATING = 'ESTIMATING',
  BIDDING = 'BIDDING',
  FINDING_DRIVER = 'FINDING_DRIVER',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum PaymentMethod {
  ESEWA = 'eSewa',
  KHALTI = 'Khalti',
  IMEPAY = 'IME Pay',
  CONNECTIPS = 'connectIPS',
  FONEPAY = 'FonePay',
  PRABHUPAY = 'Prabhu Pay',
  CELLPAY = 'CellPay',
  CASH = 'Cash'
}

export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  avatar: string;
  rating: number;
  carrier?: 'Ncell' | 'Namaste' | 'Other';
  onboarded?: boolean;
  kycStatus: KYCStatus;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface DriverRecord {
  id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  region: string;
  joinedDate: string;
  totalEarnings: number;
  citizenshipNumber?: string;
  idPhotoUrl?: string;
}

export interface TripRecord {
  id: string;
  passengerName: string;
  driverName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  status: 'COMPLETED' | 'CANCELLED';
}

export type Language = 'EN' | 'NP';

export const TRANSLATIONS = {
  EN: {
    welcome: "Welcome to Yatri Nepal",
    tagline: "Reliable rides across the Himalayas",
    bookNow: "Book Now",
    whereTo: "Where to?",
    pickup: "Pickup Point",
    selectVehicle: "Select Vehicle Type",
    negotiate: "Negotiate Fare",
    confirmRide: "Confirm Ride",
    driverDashboard: "Driver Dashboard",
    adminPanel: "Admin Panel",
    activeRides: "Active Rides",
    earnings: "Earnings",
    language: "Language",
    findingDrivers: "Finding nearby drivers...",
    driverFound: "Driver Found!",
    rideStarted: "Ride in Progress",
    paymentMethods: "Nepal Payment Methods",
    safetyFeature: "Safety & SOS",
    bidTitle: "Custom Your Price",
    noExtraCharge: "0% Transaction Fee",
    paymentSelection: "Select Payment Method",
    loginTitle: "Join Yatri Nepal",
    loginSubtitle: "Sign up as a passenger or drive with us",
    googleLogin: "Continue with Google",
    phoneLogin: "Use Phone Number",
    carrierNcell: "Ncell Network Detected",
    carrierNamaste: "Namaste Network Detected",
    onboardingTitle: "Driver Verification",
    onboardingSubtitle: "Complete your KYC to start earning",
    personalInfo: "Personal Details",
    vehicleInfo: "Vehicle Details",
    kycInfo: "KYC Documents",
    submitRegistration: "Submit for Verification",
    waitingTitle: "Application Under Review",
    waitingSubtitle: "Our team is manually verifying your Citizenship and Vehicle documents. This usually takes 12-24 hours.",
    rolePassenger: "Passenger",
    roleDriver: "Driver",
    roleAdmin: "Admin"
  },
  NP: {
    welcome: "यात्री नेपालमा स्वागत छ",
    tagline: "हिमालभरि भरपर्दो सवारी",
    bookNow: "अहिले बुक गर्नुहोस्",
    whereTo: "कहाँ जाने?",
    pickup: "उठाउने ठाउँ",
    selectVehicle: "सवारी साधन छान्नुहोस्",
    negotiate: "भाडा वार्ता",
    confirmRide: "सवारी निश्चित गर्नुहोस्",
    driverDashboard: "ड्राइभर ड्यासबोर्ड",
    adminPanel: "प्रशासन प्यानल",
    activeRides: "सक्रिय सवारीहरू",
    earnings: "आम्दानी",
    language: "भाषा",
    findingDrivers: "नजिकैका चालकहरू खोज्दै...",
    driverFound: "चालक भेटियो!",
    rideStarted: "सवारी सुरु भयो",
    paymentMethods: "नेपाल भुक्तानी विधिहरू",
    safetyFeature: "सुरक्षा र SOS",
    bidTitle: "आफ्नो भाडा तोक्नुहोस्",
    noExtraCharge: "०% अतिरिक्त शुल्क",
    paymentSelection: "भुक्तानी विधि छान्नुहोस्",
    loginTitle: "यात्री नेपालमा सामेल हुनुहोस्",
    loginSubtitle: "यात्रीको रूपमा साइन अप गर्नुहोस् वा हामीसँग सवारी चलाउनुहोस्",
    googleLogin: "गुगलबाट अगाडि बढनुहोस्",
    phoneLogin: "फोन नम्बर प्रयोग गर्नुहोस्",
    carrierNcell: "Ncell नेटवर्क पत्ता लाग्यो",
    carrierNamaste: "नमस्ते नेटवर्क पत्ता लाग्यो",
    onboardingTitle: "चालक प्रमाणीकरण",
    onboardingSubtitle: "कमाउन सुरु गर्न आफ्नो KYC पूरा गर्नुहोस्",
    personalInfo: "व्यक्तिगत विवरण",
    vehicleInfo: "सवारी विवरण",
    kycInfo: "KYC कागजातहरू",
    submitRegistration: "प्रमाणीकरणको लागि पठाउनुहोस्",
    waitingTitle: "आवेदन समीक्षा अन्तर्गत छ",
    waitingSubtitle: "हाम्रो टोलीले तपाईंको नागरिकता र सवारी साधनका कागजातहरू म्यानुअल रूपमा प्रमाणीकरण गर्दैछ। यसले सामान्यतया १२-२४ घण्टा लिन्छ।",
    rolePassenger: "यात्री",
    roleDriver: "ड्राइभर",
    roleAdmin: "प्रशासक"
  }
};
