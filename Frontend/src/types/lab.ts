export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  orderingPhysician: string;
  labName: string;
  collectionDate: string;
  reportDate: string;
  status: 'Ordered' | 'Collected' | 'In Process' | 'Completed' | 'Reviewed';
  category: 'Blood' | 'Urine' | 'Imaging' | 'Pathology' | 'Other';
  results: LabResult[];
  notes?: string;
  documentUrl?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  interpretation: 'Normal' | 'Abnormal' | 'Critical' | 'Inconclusive';
  notes?: string;
}