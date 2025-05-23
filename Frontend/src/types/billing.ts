export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  visitId: string;
  visitDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  dateCreated: string;
  datePaid?: string;
  paymentMethod?: 'Credit Card' | 'Insurance' | 'Cash' | 'Check';
  insuranceClaim?: InsuranceClaim;
}

export interface InvoiceItem {
  id: string;
  description: string;
  code: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InsuranceClaim {
  id: string;
  provider: string;
  policyNumber: string;
  claimNumber: string;
  submissionDate: string;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Denied' | 'Partially Approved';
  approvedAmount?: number;
  denialReason?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'Insurance' | 'Cash' | 'Check';
  reference?: string;
}