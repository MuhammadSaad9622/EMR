import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  UserCircle 
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const patientData = [
  { id: '1', firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-03-12', gender: 'Male', phone: '(555) 123-4567', lastVisit: '2025-06-01', status: 'Active' },
  { id: '2', firstName: 'Sarah', lastName: 'Johnson', dateOfBirth: '1990-07-22', gender: 'Female', phone: '(555) 234-5678', lastVisit: '2025-05-15', status: 'Active' },
  { id: '3', firstName: 'Michael', lastName: 'Brown', dateOfBirth: '1978-11-05', gender: 'Male', phone: '(555) 345-6789', lastVisit: '2025-05-30', status: 'Active' },
  { id: '4', firstName: 'Emily', lastName: 'Davis', dateOfBirth: '1982-09-18', gender: 'Female', phone: '(555) 456-7890', lastVisit: '2025-04-10', status: 'Inactive' },
  { id: '5', firstName: 'Robert', lastName: 'Wilson', dateOfBirth: '1965-04-30', gender: 'Male', phone: '(555) 567-8901', lastVisit: '2025-05-25', status: 'Active' },
  { id: '6', firstName: 'Lisa', lastName: 'Anderson', dateOfBirth: '1970-12-15', gender: 'Female', phone: '(555) 678-9012', lastVisit: '2025-05-01', status: 'Active' },
  { id: '7', firstName: 'David', lastName: 'Martin', dateOfBirth: '1975-08-27', gender: 'Male', phone: '(555) 789-0123', lastVisit: '2025-05-05', status: 'Active' }
];

const PatientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPatients = patientData.filter(patient => {
    const matchesSearch = patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || patient.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold text-neutral-900">Patients</h1>
        <Link to="/dashboard/patients/new">
          <Button variant="primary" icon={<Plus size={16} />}>
            Add Patient
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-400" />
              </div>
              <input type="text" placeholder="Search patients..." className="form-input pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input pr-10 appearance-none">
                  <option value="all">All Patients</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={16} className="text-neutral-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patient <ArrowUpDown size={14} className="ml-1 text-neutral-400" /></th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Age/Gender <ArrowUpDown size={14} className="ml-1 text-neutral-400" /></th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Visit <ArrowUpDown size={14} className="ml-1 text-neutral-400" /></th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle className="h-10 w-10 rounded-full text-neutral-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">{patient.firstName} {patient.lastName}</div>
                        <div className="text-sm text-neutral-500">ID: {patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">{calculateAge(patient.dateOfBirth)} years</div>
                    <div className="text-sm text-neutral-500">{patient.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(patient.lastVisit).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={patient.status === 'Active' ? 'success' : 'neutral'}>{patient.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    <Link
                      to={`/dashboard/patients/${patient.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/dashboard/patients/${patient.id}/edit`}
                      className="text-secondary-600 hover:text-secondary-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

export default PatientList;
