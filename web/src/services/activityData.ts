import type { ActivityItem } from '@/components/dashboard/ActivityFeed';

export const clinicActivity: ActivityItem[] = [
  { kind: 'visit_end', label: 'Visit completed', detail: 'Token #21 · Pooja Sharma', amount: 12, positive: false, when: 'just now' },
  { kind: 'recharge', label: 'Wallet recharge', detail: 'UPI · auto-recharge', amount: 5000, positive: true, when: '12:42 PM' },
  { kind: 'visit_end', label: 'Visit completed', detail: 'Token #20 · Raj Verma', amount: 12, positive: false, when: '12:30 PM' },
  { kind: 'new_patient', label: 'New patient added', detail: 'Ramesh Jha', when: '12:18 PM' },
  { kind: 'visit_end', label: 'Visit completed', detail: 'Token #19 · Aman Kumar', amount: 12, positive: false, when: '11:54 AM' },
  { kind: 'visit_end', label: 'Visit completed', detail: 'Token #18 · Saurabh Singh', amount: 12, positive: false, when: '11:32 AM' },
];

export const adminActivity: ActivityItem[] = [
  { kind: 'recharge', label: 'Jha Eye Hospital recharged', detail: 'NetBanking', amount: 10000, positive: true, when: '11:30 AM' },
  { kind: 'recharge', label: 'Sharma ENT recharged', detail: 'UPI', amount: 5000, positive: true, when: '12:42 PM' },
  { kind: 'new_patient', label: 'New clinic onboarded', detail: 'Mishra Diagnostics · Patna', when: '11:10 AM' },
  { kind: 'visit_end', label: 'Bulk visits settled', detail: '24 clinics · MTD', amount: 312, positive: false, when: '10:00 AM' },
  { kind: 'recharge', label: 'Gupta Child Care recharged', detail: 'UPI', amount: 3000, positive: true, when: 'Yesterday' },
];

export const clinicSparklines = {
  patients: [18, 22, 19, 26, 24, 30, 32],
  queue: [4, 5, 6, 7, 8, 7, 7],
  completed: [12, 16, 19, 22, 25, 25, 25],
  earnings: [180, 240, 280, 360, 420, 490, 525],
};

export const adminSparklines = {
  clinics: [104, 110, 114, 118, 121, 122, 124],
  revenue: [9100, 10800, 11600, 12300, 13500, 16800, 18420],
  recharge: [410, 520, 600, 720, 830, 910, 980],
  notifications: [120, 150, 142, 168, 174, 188, 198],
};
