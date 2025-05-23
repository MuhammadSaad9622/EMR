export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'Initial Visit' | 'Follow-up' | 'Consultation' | 'Procedure';
  status: 'Scheduled' | 'Checked-in' | 'In-progress' | 'Completed' | 'Cancelled' | 'No-show';
  notes?: string;
}