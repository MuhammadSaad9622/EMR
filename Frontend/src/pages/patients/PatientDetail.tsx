import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  UserCircle, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  PlusCircle, 
  Download,
  Printer,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

// Demo patient data for detail view
const patientData = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  dateOfBirth: '1985-03-12',
  gender: 'Male',
  email: 'john.smith@example.com',
  phone: '(555) 123-4567',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345'
  },
  insuranceProvider: 'Blue Cross Blue Shield',
  insuranceNumber: 'BCBS12345678',
  medicalHistory: {
    allergies: ['Penicillin', 'Peanuts'],
    medications: [
      { 
        name: 'Lisinopril', 
        dosage: '10mg', 
        frequency: 'Once daily', 
        startDate: '2024-01-15' 
      },
      { 
        name: 'Metformin', 
        dosage: '500mg', 
        frequency: 'Twice daily', 
        startDate: '2023-11-20' 
      }
    ],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    familyHistory: ['Heart Disease (Father)', 'Breast Cancer (Mother)'],
    surgicalHistory: ['Appendectomy (2010)']
  },
  visits: [
    {
      id: 'v1',
      date: '2025-06-01',
      type: 'Follow-up',
      provider: 'Dr. Jane Smith',
      notes: {
        subjective: 'Patient reports feeling better with medication.',
        objective: 'BP: 132/84, HR: 76, Temp: 98.6°F',
        assessment: 'Hypertension - controlled',
        plan: 'Continue current medications. Follow up in 3 months.'
      },
      status: 'Completed',
      billingStatus: 'Paid'
    },
    {
      id: 'v2',
      date: '2025-05-01',
      type: 'Follow-up',
      provider: 'Dr. Jane Smith',
      notes: {
        subjective: 'Patient reports occasional headaches.',
        objective: 'BP: 140/90, HR: 80, Temp: 98.6°F',
        assessment: 'Hypertension - not optimally controlled',
        plan: 'Adjust medication dosage. Follow up in 1 month.'
      },
      status: 'Completed',
      billingStatus: 'Paid'
    },
    {
      id: 'v3',
      date: '2025-04-01',
      type: 'Initial',
      provider: 'Dr. Jane Smith',
      notes: {
        subjective: 'New patient with history of high blood pressure.',
        objective: 'BP: 150/95, HR: 78, Temp: 98.4°F',
        assessment: 'Newly diagnosed hypertension',
        plan: 'Start Lisinopril 10mg daily. Diet and exercise counseling. Follow up in 1 month.'
      },
      status: 'Completed',
      billingStatus: 'Paid'
    }
  ]
};

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, we would fetch data based on the id
  const patient = patientData;
  
  const calculateAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Patient Profile</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            icon={<Printer size={16} />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button 
            variant="outline" 
            icon={<Download size={16} />}
          >
            Export
          </Button>
          <Link to={`/dashboard/patients/${id}/edit`}>
            <Button variant="primary">
              Edit Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient header card */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <UserCircle className="h-24 w-24 text-primary-600" />
          </div>
          <div className="md:ml-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {patient.firstName} {patient.lastName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center text-sm text-neutral-500">
                  <div className="flex items-center mr-4">
                    <Calendar size={16} className="mr-1" />
                    {calculateAge(patient.dateOfBirth)} years ({new Date(patient.dateOfBirth).toLocaleDateString()})
                  </div>
                  <div className="flex items-center mr-4">
                    <Badge
                      variant={patient.gender === 'Male' ? 'primary' : 'accent'}
                      className="bg-opacity-10"
                    >
                      {patient.gender}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="success">Active Patient</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-neutral-500">
                  <div className="flex items-center mb-1">
                    <Phone size={16} className="mr-2" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center mb-1">
                    <Mail size={16} className="mr-2" />
                    {patient.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {patient.address.city}, {patient.address.state}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.chronicConditions.map((condition, index) => (
                  <Badge key={index} variant="warning">
                    {condition}
                  </Badge>
                ))}
                {patient.medicalHistory.allergies.map((allergy, index) => (
                  <Badge key={index} variant="error">
                    Allergic to {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'visits'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Visits
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'labs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Lab Results
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'billing'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Billing
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <Card title="Personal Information">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Full Name</p>
                    <p className="mt-1 text-neutral-900">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Date of Birth</p>
                    <p className="mt-1 text-neutral-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Gender</p>
                    <p className="mt-1 text-neutral-900">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Phone Number</p>
                    <p className="mt-1 text-neutral-900">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Email</p>
                    <p className="mt-1 text-neutral-900">{patient.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Address</p>
                  <p className="mt-1 text-neutral-900">
                    {patient.address.street}<br />
                    {patient.address.city}, {patient.address.state} {patient.address.zipCode}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card title="Insurance Information">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Insurance Provider</p>
                  <p className="mt-1 text-neutral-900">{patient.insuranceProvider}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Policy Number</p>
                  <p className="mt-1 text-neutral-900">{patient.insuranceNumber}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900">Verification Status</p>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Last verified: 06/10/2025</p>
                </div>
              </div>
            </Card>
            
            <Card 
              title="Medical History"
              className="md:col-span-2"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-neutral-900 mb-2">Chronic Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalHistory.chronicConditions.length > 0 ? (
                      patient.medicalHistory.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="warning">
                          {condition}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-neutral-500">No chronic conditions recorded</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-neutral-900 mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalHistory.allergies.length > 0 ? (
                      patient.medicalHistory.allergies.map((allergy, index) => (
                        <Badge key={index} variant="error">
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-neutral-500">No allergies recorded</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-neutral-900 mb-2">Current Medications</h4>
                  {patient.medicalHistory.medications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Medication
                            </th>
                            <th className="px-4 py-2 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Dosage
                            </th>
                            <th className="px-4 py-2 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Frequency
                            </th>
                            <th className="px-4 py-2 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Start Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {patient.medicalHistory.medications.map((medication, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-900">
                                {medication.name}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500">
                                {medication.dosage}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500">
                                {medication.frequency}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500">
                                {new Date(medication.startDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-neutral-500">No medications recorded</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-base font-medium text-neutral-900 mb-2">Family History</h4>
                    <ul className="list-disc pl-5 text-neutral-700">
                      {patient.medicalHistory.familyHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium text-neutral-900 mb-2">Surgical History</h4>
                    <ul className="list-disc pl-5 text-neutral-700">
                      {patient.medicalHistory.surgicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'visits' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-neutral-900">Visit History</h3>
              <Link to="/appointments/new">
                <Button 
                  variant="primary" 
                  size="sm"
                  icon={<PlusCircle size={16} />}
                >
                  Schedule Visit
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {patient.visits.map((visit) => (
                <Card key={visit.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center">
                        <Badge
                          variant={
                            visit.type === 'Initial' 
                              ? 'accent' 
                              : visit.type === 'Follow-up' 
                              ? 'primary' 
                              : 'neutral'
                          }
                        >
                          {visit.type} Visit
                        </Badge>
                        <span className="mx-2 text-neutral-300">•</span>
                        <span className="text-sm text-neutral-500">
                          {new Date(visit.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="mt-2 text-lg font-medium text-neutral-900">
                        {visit.provider}
                      </h4>
                      <div className="mt-1 text-sm text-neutral-600">
                        <p>Assessment: {visit.notes.assessment}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Badge
                        variant={
                          visit.status === 'Completed' 
                            ? 'success' 
                            : visit.status === 'Cancelled' 
                            ? 'error' 
                            : 'warning'
                        }
                      >
                        {visit.status}
                      </Badge>
                      <Badge
                        variant={
                          visit.billingStatus === 'Paid' 
                            ? 'success' 
                            : visit.billingStatus === 'Denied' 
                            ? 'error' 
                            : 'warning'
                        }
                      >
                        {visit.billingStatus}
                      </Badge>
                      <Link to={`/visits/${visit.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h5 className="text-xs font-medium uppercase text-neutral-500">Subjective</h5>
                        <p className="mt-1 text-sm text-neutral-700">{visit.notes.subjective}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium uppercase text-neutral-500">Objective</h5>
                        <p className="mt-1 text-sm text-neutral-700">{visit.notes.objective}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium uppercase text-neutral-500">Assessment</h5>
                        <p className="mt-1 text-sm text-neutral-700">{visit.notes.assessment}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium uppercase text-neutral-500">Plan</h5>
                        <p className="mt-1 text-sm text-neutral-700">{visit.notes.plan}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-neutral-900">Patient Documents</h3>
              <Button 
                variant="primary" 
                size="sm"
                icon={<PlusCircle size={16} />}
              >
                Upload Document
              </Button>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">Recent Documents</h4>
                  <div className="relative">
                    <select className="form-input pl-3 pr-10 py-2 text-sm appearance-none">
                      <option>All Document Types</option>
                      <option>Clinical Notes</option>
                      <option>Referrals</option>
                      <option>Consent Forms</option>
                      <option>Test Results</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown size={16} className="text-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-neutral-200">
                <div className="p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-primary-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">Visit Summary</p>
                        <p className="text-xs text-neutral-500">
                          Created on {new Date('2025-06-01').toLocaleDateString()} by Dr. Jane Smith
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-primary-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">Hypertension Management Plan</p>
                        <p className="text-xs text-neutral-500">
                          Created on {new Date('2025-05-01').toLocaleDateString()} by Dr. Jane Smith
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-primary-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">Patient Intake Form</p>
                        <p className="text-xs text-neutral-500">
                          Created on {new Date('2025-04-01').toLocaleDateString()} by Patient
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-primary-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">Medical History Questionnaire</p>
                        <p className="text-xs text-neutral-500">
                          Created on {new Date('2025-04-01').toLocaleDateString()} by Patient
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'labs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-neutral-900">Lab Results</h3>
              <Button 
                variant="primary" 
                size="sm"
                icon={<PlusCircle size={16} />}
              >
                Order New Lab
              </Button>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h4 className="text-base font-medium">Recent Lab Reports</h4>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <select className="form-input pl-3 pr-10 py-2 text-sm appearance-none">
                        <option>All Categories</option>
                        <option>Blood</option>
                        <option>Urine</option>
                        <option>Imaging</option>
                        <option>Pathology</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={16} className="text-neutral-400" />
                      </div>
                    </div>
                    <div className="relative">
                      <select className="form-input pl-3 pr-10 py-2 text-sm appearance-none">
                        <option>All Time</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={16} className="text-neutral-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Complete Blood Count (CBC)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date('2025-06-10').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      Quest Diagnostics
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Normal</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Link
                        to="#"
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to="#"
                        className="text-secondary-600 hover:text-secondary-900"
                      >
                        Download
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Lipid Panel
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date('2025-05-15').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      LabCorp
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="warning">Abnormal</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Link
                        to="#"
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to="#"
                        className="text-secondary-600 hover:text-secondary-900"
                      >
                        Download
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Hemoglobin A1C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date('2025-05-15').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      LabCorp
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="warning">Abnormal</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Link
                        to="#"
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to="#"
                        className="text-secondary-600 hover:text-secondary-900"
                      >
                        Download
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      Chest X-Ray
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date('2025-04-05').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      City Radiology
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Normal</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Link
                        to="#"
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to="#"
                        className="text-secondary-600 hover:text-secondary-900"
                      >
                        Download
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="p-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-700">
                    Showing <span className="font-medium">4</span> of <span className="font-medium">12</span> results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-500 hover:bg-neutral-50 disabled:opacity-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm bg-primary-50 text-primary-600 font-medium">
                      1
                    </button>
                    <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-500 hover:bg-neutral-50">
                      2
                    </button>
                    <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-500 hover:bg-neutral-50">
                      3
                    </button>
                    <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-500 hover:bg-neutral-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'billing' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-neutral-900">Billing & Payments</h3>
              <Button 
                variant="primary" 
                size="sm"
                icon={<PlusCircle size={16} />}
              >
                Create Invoice
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-neutral-500">Total Billed</h4>
                  <p className="mt-2 text-3xl font-bold text-neutral-900">$1,250.00</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-neutral-500">Insurance Covered</h4>
                  <p className="mt-2 text-3xl font-bold text-success-600">$975.00</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-neutral-500">Patient Responsibility</h4>
                  <p className="mt-2 text-3xl font-bold text-error-600">$275.00</p>
                </div>
              </Card>
            </div>
            
            <Card title="Recent Invoices">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        INV-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date('2025-06-01').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        Follow-up Visit
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        $150.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <Link
                          to="#"
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          to="#"
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          Download
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        INV-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date('2025-05-15').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        Blood Tests
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        $350.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <Link
                          to="#"
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          to="#"
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          Download
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        INV-003
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date('2025-05-01').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        Follow-up Visit
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        $150.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <Link
                          to="#"
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          to="#"
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          Download
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        INV-004
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date('2025-04-05').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        X-Ray
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        $250.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <Link
                          to="#"
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          to="#"
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          Download
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        INV-005
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date('2025-04-01').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        Initial Visit
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        $350.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <Link
                          to="#"
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          to="#"
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          Download
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
            
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-base font-medium text-neutral-900">Billing Information</h4>
                  <p className="mt-1 text-sm text-neutral-600">
                    For billing questions or to update your insurance information, please contact our billing department at (555) 987-6543 or email billing@conexem.example.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;