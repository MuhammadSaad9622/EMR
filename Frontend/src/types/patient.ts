export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalHistory?: MedicalHistory;
  visits: Visit[];
}

export interface MedicalHistory {
  allergies: string[];
  medications: Medication[];
  chronicConditions: string[];
  familyHistory: string[];
  surgicalHistory: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export interface Visit {
  id: string;
  date: string;
  type: 'Initial' | 'Follow-up' | 'Discharge';
  provider: string;
  notes: SOAPNote;
  status: 'Scheduled' | 'Checked-in' | 'In-progress' | 'Completed' | 'Cancelled';
  billingStatus: 'Unbilled' | 'Billed' | 'Paid' | 'Denied';
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}