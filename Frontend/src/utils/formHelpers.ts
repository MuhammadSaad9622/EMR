import { z } from 'zod';

// Common validation schemas
export const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Zip code must be at least 5 digits'),
  }),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

export const visitSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['Initial', 'Follow-up', 'Discharge']),
  provider: z.string().min(1, 'Provider is required'),
  notes: z.object({
    subjective: z.string().min(1, 'Subjective notes are required'),
    objective: z.string().min(1, 'Objective notes are required'),
    assessment: z.string().min(1, 'Assessment is required'),
    plan: z.string().min(1, 'Plan is required'),
  }),
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  providerId: z.string().min(1, 'Provider is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  type: z.enum(['Initial Visit', 'Follow-up', 'Consultation', 'Procedure']),
  notes: z.string().optional(),
});

export const labReportSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  orderingPhysician: z.string().min(1, 'Ordering physician is required'),
  labName: z.string().min(1, 'Lab name is required'),
  collectionDate: z.string().min(1, 'Collection date is required'),
  category: z.enum(['Blood', 'Urine', 'Imaging', 'Pathology', 'Other']),
  results: z.array(
    z.object({
      testName: z.string().min(1, 'Test name is required'),
      value: z.string().min(1, 'Value is required'),
      unit: z.string().min(1, 'Unit is required'),
      referenceRange: z.string(),
      interpretation: z.enum(['Normal', 'Abnormal', 'Critical', 'Inconclusive']),
      notes: z.string().optional(),
    })
  ),
  notes: z.string().optional(),
});

// Helper function to format phone numbers
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (phoneNumber.length >= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  } else if (phoneNumber.length >= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else if (phoneNumber.length >= 3) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  
  return phoneNumber;
};

// Helper function to format dates in YYYY-MM-DD format
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Helper function to check if a field should conditionally be shown
export const shouldShowField = (
  conditions: { field: string; value: any }[],
  formValues: Record<string, any>
): boolean => {
  return conditions.every(condition => {
    const fieldValue = formValues[condition.field];
    
    if (Array.isArray(condition.value)) {
      return condition.value.includes(fieldValue);
    }
    
    return fieldValue === condition.value;
  });
};