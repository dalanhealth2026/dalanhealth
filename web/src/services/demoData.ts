import type { QueueEntry } from '@/store/queue';

export const demoQueue: QueueEntry[] = [
  { id: 'q1', token: 1, patientName: 'Shailesh Kumar', patientMobile: '+91 98765 43210', source: 'ONLINE', status: 'Consultation', joinedAt: '10:02 AM' },
  { id: 'q2', token: 2, patientName: 'Raj Verma', patientMobile: '+91 91234 56780', source: 'OFFLINE', status: 'Queue', joinedAt: '10:05 AM' },
  { id: 'q3', token: 3, patientName: 'Saurabh Singh', patientMobile: '+91 99887 12345', source: 'QR', status: 'Waiting', joinedAt: '10:11 AM' },
  { id: 'q4', token: 4, patientName: 'Ramesh Jha', patientMobile: '+91 90909 12121', source: 'OFFLINE', status: 'Waiting', joinedAt: '10:18 AM' },
  { id: 'q5', token: 5, patientName: 'Pooja Sharma', patientMobile: '+91 98700 33445', source: 'ONLINE', status: 'Waiting', joinedAt: '10:24 AM' },
  { id: 'q6', token: 6, patientName: 'Aman Kumar', patientMobile: '+91 99110 22334', source: 'QR', status: 'Waiting', joinedAt: '10:31 AM' },
];

export const demoClinic = {
  name: 'Sharma ENT Clinic',
  doctor: 'Dr. Anil Sharma',
  specialization: 'ENT Specialist',
  city: 'Patna, Bihar',
  walletBalance: 12540,
  todayRevenue: 8600,
  todayPatients: 24,
  followUps: 6,
  timing: '10 AM – 2 PM, 5 PM – 8 PM',
  bookingFee: 1,
};

export const demoPatient = {
  name: 'Shailesh Kumar',
  mobile: '+91 98765 43210',
  age: 28,
  gender: 'Male',
  walletBalance: 2.8,
  currentToken: 18,
  runningToken: 12,
  approxWaitMin: 38,
  doctorSittingTill: '2 PM',
  expectedConsultation: '1:10 PM',
  clinic: 'Sharma ENT Clinic',
  doctor: 'Dr. Anil Sharma',
};

export const demoSuperAdmin = {
  totalClinics: 124,
  activeClinics: 102,
  starterClinics: 78,
  growthClinics: 46,
  monthlyRevenue: 1842000,
  todayRevenue: 61000,
  walletRechargeMtd: 980000,
  notificationsSent: 184320,
  pendingIssues: 4,
  patientCount: 38240,
};

export const demoRevenueSeries = [
  { m: 'Nov', revenue: 1140000, recharge: 720000 },
  { m: 'Dec', revenue: 1350000, recharge: 820000 },
  { m: 'Jan', revenue: 1480000, recharge: 870000 },
  { m: 'Feb', revenue: 1610000, recharge: 910000 },
  { m: 'Mar', revenue: 1742000, recharge: 950000 },
  { m: 'Apr', revenue: 1842000, recharge: 980000 },
];

export const demoQueueTrend = [
  { d: 'Mon', online: 12, offline: 22, qr: 9 },
  { d: 'Tue', online: 14, offline: 28, qr: 11 },
  { d: 'Wed', online: 16, offline: 24, qr: 13 },
  { d: 'Thu', online: 18, offline: 30, qr: 14 },
  { d: 'Fri', online: 22, offline: 34, qr: 18 },
  { d: 'Sat', online: 30, offline: 40, qr: 24 },
  { d: 'Sun', online: 9, offline: 14, qr: 6 },
];

export const demoDoctors = [
  { id: 'd1', name: 'Dr. Anil Sharma', specialization: 'ENT', clinic: 'Sharma ENT Clinic', city: 'Patna', timing: '10 AM – 2 PM', currentToken: 12, approxWait: 38, fee: 300 },
  { id: 'd2', name: 'Dr. Priya Gupta', specialization: 'Pediatrics', clinic: 'Gupta Child Care', city: 'Patna', timing: '5 PM – 8 PM', currentToken: 4, approxWait: 18, fee: 250 },
  { id: 'd3', name: 'Dr. Ravi Kumar', specialization: 'General Physician', clinic: 'Kumar Polyclinic', city: 'Muzaffarpur', timing: '11 AM – 3 PM', currentToken: 9, approxWait: 28, fee: 200 },
  { id: 'd4', name: 'Dr. Neha Singh', specialization: 'Dermatology', clinic: 'Skin & Smile', city: 'Gaya', timing: '12 PM – 4 PM', currentToken: 6, approxWait: 22, fee: 350 },
];

export const demoBookings = [
  { id: 'b1', date: '12 Jan', clinic: 'Sharma ENT Clinic', doctor: 'Dr. Anil Sharma', status: 'Completed' as const, token: 14 },
  { id: 'b2', date: '16 Jan', clinic: 'Gupta Child Care', doctor: 'Dr. Priya Gupta', status: 'Cancelled' as const, token: 22 },
  { id: 'b3', date: 'Today', clinic: 'Sharma ENT Clinic', doctor: 'Dr. Anil Sharma', status: 'Upcoming' as const, token: 18 },
];

export const demoClinics = [
  { id: 'c1', name: 'Sharma ENT Clinic', city: 'Patna', plan: 'Growth', wallet: 12540, patientsToday: 24, status: 'Active' },
  { id: 'c2', name: 'Gupta Child Care', city: 'Patna', plan: 'Starter', wallet: 4120, patientsToday: 16, status: 'Active' },
  { id: 'c3', name: 'Kumar Polyclinic', city: 'Muzaffarpur', plan: 'Growth', wallet: 980, patientsToday: 11, status: 'Low Wallet' },
  { id: 'c4', name: 'Skin & Smile', city: 'Gaya', plan: 'Starter', wallet: 6320, patientsToday: 9, status: 'Active' },
  { id: 'c5', name: 'Jha Eye Hospital', city: 'Darbhanga', plan: 'Growth', wallet: 18420, patientsToday: 31, status: 'Active' },
];

// --- Clinic-side demo data -------------------------------------------------

export type PatientStatus = 'Active' | 'Follow-up due' | 'New';

export const demoPatients = [
  { id: 'p1', name: 'Shailesh Kumar', mobile: '+91 98765 43210', age: 28, gender: 'Male', visits: 6, lastVisit: '12 Jan', status: 'Follow-up due' as PatientStatus, lastDx: 'Acute pharyngitis' },
  { id: 'p2', name: 'Raj Verma', mobile: '+91 91234 56780', age: 34, gender: 'Male', visits: 2, lastVisit: '8 Jan', status: 'Active' as PatientStatus, lastDx: 'Otitis media' },
  { id: 'p3', name: 'Saurabh Singh', mobile: '+91 99887 12345', age: 41, gender: 'Male', visits: 11, lastVisit: 'Today', status: 'Active' as PatientStatus, lastDx: 'Allergic rhinitis' },
  { id: 'p4', name: 'Pooja Sharma', mobile: '+91 98700 33445', age: 27, gender: 'Female', visits: 4, lastVisit: '20 Dec', status: 'Follow-up due' as PatientStatus, lastDx: 'Tonsillitis' },
  { id: 'p5', name: 'Ramesh Jha', mobile: '+91 90909 12121', age: 52, gender: 'Male', visits: 1, lastVisit: 'Today', status: 'New' as PatientStatus, lastDx: 'Hearing loss eval' },
  { id: 'p6', name: 'Neha Singh', mobile: '+91 98800 11223', age: 38, gender: 'Female', visits: 3, lastVisit: '2 Jan', status: 'Active' as PatientStatus, lastDx: 'Sinusitis' },
  { id: 'p7', name: 'Aman Kumar', mobile: '+91 99110 22334', age: 19, gender: 'Male', visits: 0, lastVisit: '—', status: 'New' as PatientStatus, lastDx: '—' },
  { id: 'p8', name: 'Anjali Devi', mobile: '+91 91100 33455', age: 64, gender: 'Female', visits: 9, lastVisit: '5 Jan', status: 'Follow-up due' as PatientStatus, lastDx: 'Vertigo' },
];

export const demoAppointments = [
  { id: 'a1', patient: 'Shailesh Kumar', mobile: '+91 98765 43210', when: 'Today · 10:30 AM', source: 'ONLINE' as const, fee: 1, status: 'Upcoming' },
  { id: 'a2', patient: 'Pooja Sharma', mobile: '+91 98700 33445', when: 'Today · 11:00 AM', source: 'ONLINE' as const, fee: 1, status: 'Confirmed' },
  { id: 'a3', patient: 'Saurabh Singh', mobile: '+91 99887 12345', when: 'Today · 11:30 AM', source: 'QR' as const, fee: 0, status: 'Confirmed' },
  { id: 'a4', patient: 'Anjali Devi', mobile: '+91 91100 33455', when: 'Tomorrow · 10:00 AM', source: 'ONLINE' as const, fee: 1, status: 'Upcoming' },
  { id: 'a5', patient: 'Neha Singh', mobile: '+91 98800 11223', when: 'Tomorrow · 6:15 PM', source: 'ONLINE' as const, fee: 1, status: 'Upcoming' },
  { id: 'a6', patient: 'Raj Verma', mobile: '+91 91234 56780', when: '23 May · 5:30 PM', source: 'ONLINE' as const, fee: 1, status: 'Upcoming' },
];

export const demoStaff = [
  { id: 's1', name: 'Pooja Receptionist', role: 'Receptionist', mobile: '+91 91234 56780', status: 'Active', addedOn: '4 Jan' },
  { id: 's2', name: 'Vikas Compounder', role: 'Compounder', mobile: '+91 99887 71122', status: 'Active', addedOn: '12 Jan' },
  { id: 's3', name: 'Asha Helper', role: 'Billing Staff', mobile: '+91 90901 22334', status: 'Invited', addedOn: '18 May' },
];

export const demoClinicNotifications = [
  { id: 'n1', time: '12:42 PM', channel: 'Push', recipient: 'Shailesh Kumar', event: 'queue_near', body: 'Your turn is next. Please stay nearby.', status: 'Delivered' },
  { id: 'n2', time: '12:30 PM', channel: 'WhatsApp', recipient: 'Pooja Sharma', event: 'booking_created', body: 'Token #18 booked at Sharma ENT for today 10:30 AM.', status: 'Delivered' },
  { id: 'n3', time: '12:18 PM', channel: 'SMS', recipient: 'Saurabh Singh', event: 'consultation_ready', body: 'It is your turn now. Please proceed to doctor room.', status: 'Delivered' },
  { id: 'n4', time: '11:54 AM', channel: 'Push', recipient: 'Raj Verma', event: 'visit_completed', body: 'Thank you for visiting. Get well soon.', status: 'Delivered' },
  { id: 'n5', time: '11:20 AM', channel: 'WhatsApp', recipient: 'Ramesh Jha', event: 'follow_up', body: 'Your follow-up visit is due. Please book appointment.', status: 'Failed' },
  { id: 'n6', time: 'Yesterday', channel: 'Email', recipient: 'Dr. Anil Sharma', event: 'wallet_low', body: 'Wallet balance ₹840 — please recharge.', status: 'Delivered' },
];

export const demoSourceMix = [
  { name: 'Offline', value: 56, color: '#10b981' },
  { name: 'Online', value: 28, color: '#2f7fff' },
  { name: 'QR', value: 16, color: '#8b5cf6' },
];

export const demoFunnelWeek = [
  { d: 'Mon', visits: 43, followups: 12 },
  { d: 'Tue', visits: 53, followups: 14 },
  { d: 'Wed', visits: 51, followups: 18 },
  { d: 'Thu', visits: 62, followups: 22 },
  { d: 'Fri', visits: 74, followups: 28 },
  { d: 'Sat', visits: 94, followups: 41 },
  { d: 'Sun', visits: 29, followups: 9 },
];

// --- Super admin demo data -------------------------------------------------

export const demoAllRecharges = [
  { id: 'r1', clinic: 'Sharma ENT Clinic', amount: 5000, method: 'UPI', when: 'Today, 12:42 PM', status: 'Success' },
  { id: 'r2', clinic: 'Jha Eye Hospital', amount: 10000, method: 'NetBanking', when: 'Today, 11:30 AM', status: 'Success' },
  { id: 'r3', clinic: 'Gupta Child Care', amount: 3000, method: 'UPI', when: 'Today, 10:14 AM', status: 'Success' },
  { id: 'r4', clinic: 'Kumar Polyclinic', amount: 1500, method: 'Card', when: 'Yesterday', status: 'Failed' },
  { id: 'r5', clinic: 'Skin & Smile', amount: 4000, method: 'UPI', when: 'Yesterday', status: 'Success' },
];

export const demoCashbackCampaigns = [
  { id: 'cb1', name: 'Welcome Reward', type: 'first_booking', amount: 1.0, scope: 'All patients', active: true, claimed: 1820 },
  { id: 'cb2', name: 'Holi Special', type: 'festival', amount: 0.25, scope: 'All clinics', active: true, claimed: 642 },
  { id: 'cb3', name: 'Chhath Pooja', type: 'festival', amount: 0.25, scope: 'Bihar clinics', active: false, claimed: 510 },
  { id: 'cb4', name: 'Dr. Sharma Boost', type: 'doctor_promo', amount: 0.50, scope: 'Sharma ENT', active: true, claimed: 88 },
  { id: 'cb5', name: 'Default', type: 'normal', amount: 0.10, scope: 'All bookings', active: true, claimed: 14820 },
];

export const demoAdminNotifications = [
  { id: 'an1', time: 'Today, 12:42', channel: 'Push', recipient: '198 patients', event: 'queue_near', delivered: 196, failed: 2 },
  { id: 'an2', time: 'Today, 12:30', channel: 'WhatsApp', recipient: '74 patients', event: 'booking_created', delivered: 73, failed: 1 },
  { id: 'an3', time: 'Today, 12:00', channel: 'SMS', recipient: '88 patients', event: 'consultation_ready', delivered: 86, failed: 2 },
  { id: 'an4', time: 'Today, 11:18', channel: 'Email', recipient: '12 clinics', event: 'wallet_low', delivered: 12, failed: 0 },
];

export const demoSupport = [
  { id: 't1', clinic: 'Kumar Polyclinic', subject: 'Cannot recharge wallet via UPI', priority: 'High', status: 'Open', when: '14 min ago', assignee: 'Vikram' },
  { id: 't2', clinic: 'Gupta Child Care', subject: 'Patient app stuck on OTP screen', priority: 'Medium', status: 'In progress', when: '1 hr ago', assignee: 'Riya' },
  { id: 't3', clinic: 'Sharma ENT Clinic', subject: 'Print prescription not working', priority: 'Low', status: 'Open', when: '3 hr ago', assignee: '—' },
  { id: 't4', clinic: 'Skin & Smile', subject: 'Need additional staff seats', priority: 'Low', status: 'Resolved', when: 'Yesterday', assignee: 'Vikram' },
];

export const demoCompanyAdmins = [
  { id: 'ca1', name: 'Shailesh Kumar', email: 'shailesh@dalansoft.com', role: 'Owner', lastSeen: 'just now' },
  { id: 'ca2', name: 'Vikram Rao', email: 'vikram@dalansoft.com', role: 'Support Admin', lastSeen: '2 min ago' },
  { id: 'ca3', name: 'Riya Mehta', email: 'riya@dalansoft.com', role: 'Sales Admin', lastSeen: '15 min ago' },
  { id: 'ca4', name: 'Anjali Pandey', email: 'anjali@dalansoft.com', role: 'Finance Admin', lastSeen: '3 hr ago' },
  { id: 'ca5', name: 'Karan Iyer', email: 'karan@dalansoft.com', role: 'Technical Admin', lastSeen: 'Yesterday' },
];

export const demoSystemHealth = {
  apiLatencyMs: 124,
  apiUptime: 99.98,
  wsConnections: 312,
  dbWriteOpsPerSec: 84,
  notifBacklog: 4,
  errorRate: 0.03,
  services: [
    { name: 'API', status: 'Operational', latency: 124 },
    { name: 'WebSocket', status: 'Operational', latency: 38 },
    { name: 'MongoDB', status: 'Operational', latency: 12 },
    { name: 'Notifications', status: 'Degraded', latency: 940 },
    { name: 'Razorpay', status: 'Operational', latency: 220 },
  ],
};
