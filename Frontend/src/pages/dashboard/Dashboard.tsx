import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  CalendarDays, 
  ClipboardList, 
  AlertCircle, 
  TrendingUp, 
  Layers,
  Bell,
  FileText,
  LogOut
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';

// Demo data for dashboard
const upcomingAppointments = [
  { id: '1', patient: 'John Smith', date: '2025-06-15', time: '09:00 AM', type: 'Follow-up' },
  { id: '2', patient: 'Sarah Johnson', date: '2025-06-15', time: '10:30 AM', type: 'Initial Visit' },
  { id: '3', patient: 'Michael Brown', date: '2025-06-16', time: '02:15 PM', type: 'Consultation' },
];

const recentLabResults = [
  { id: '1', patient: 'John Smith', test: 'Complete Blood Count', date: '2025-06-10', status: 'Normal' },
  { id: '2', patient: 'Emily Davis', test: 'Lipid Panel', date: '2025-06-09', status: 'Abnormal' },
  { id: '3', patient: 'Robert Wilson', test: 'Metabolic Panel', date: '2025-06-08', status: 'Normal' },
];

const overdueFollowUps = [
  { id: '1', patient: 'Lisa Anderson', lastVisit: '2025-05-01', condition: 'Hypertension' },
  { id: '2', patient: 'David Martin', lastVisit: '2025-05-05', condition: 'Diabetes Type 2' },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-neutral-500 hover:text-neutral-700">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-error-500 border-2 border-white"></span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-100">Total Patients</p>
              <p className="text-2xl font-bold">{isDoctor ? '248' : isPatient ? '1' : '789'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <CalendarDays size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-100">Follow-ups Due</p>
              <p className="text-2xl font-bold">{isDoctor ? '8' : isPatient ? '1' : '32'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ClipboardList size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-accent-100">Discharged Patients</p>
              <p className="text-2xl font-bold">{isDoctor ? '12' : isPatient ? '2' : '47'}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-neutral-600 to-neutral-700 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Layers size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-300">Lab Results</p>
              <p className="text-2xl font-bold">{isDoctor ? '15' : isPatient ? '3' : '124'}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card
          title="Upcoming Appointments"
          headerAction={
            <Link to="/appointments" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          }
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {appointment.patient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Badge
                        variant={appointment.type === 'Initial Visit' ? 'warning' : 'neutral'}
                      >
                        {appointment.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Link
                        to={`/appointments/${appointment.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Alerts */}
        <Card
          title="Alerts & Notifications"
          headerAction={
            <span className="text-xs bg-error-100 text-error-800 px-2 py-1 rounded-full">
              {overdueFollowUps.length} new
            </span>
          }
        >
          <div className="space-y-4">
            <div className="bg-warning-50 border-l-4 border-warning-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-warning-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-warning-700">
                    {isPatient 
                      ? 'Your prescription for Lisinopril will expire in 7 days.' 
                      : 'Prescription renewal needed for 5 patients.'}
                  </p>
                </div>
              </div>
            </div>
            
            {!isPatient && overdueFollowUps.map((patient) => (
              <div key={patient.id} className="bg-error-50 border-l-4 border-error-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-error-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-error-700">
                      <strong>{patient.patient}</strong> is overdue for {patient.condition} follow-up.
                      Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <Link
                        to={`/dashboard/patients/${patient.id}`}
                        className="text-sm font-medium text-error-700 hover:text-error-600"
                      >
                        View Patient
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-success-50 border-l-4 border-success-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-success-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-success-700">
                    {isPatient 
                      ? 'Your lab results are ready for review.' 
                      : 'New lab results available for 3 patients.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Lab Results */}
        <Card
          title="Recent Lab Results"
          headerAction={
            <Link to="/lab-reports" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          }
        >
          <div className="space-y-4">
            {recentLabResults.map((result) => (
              <div key={result.id} className="flex items-center p-3 border border-neutral-200 rounded-md hover:bg-neutral-50">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{result.patient}</p>
                  <p className="text-sm text-neutral-500">{result.test}</p>
                  <p className="text-xs text-neutral-400">{new Date(result.date).toLocaleDateString()}</p>
                </div>
                <Badge
                  variant={result.status === 'Normal' ? 'success' : 'warning'}
                >
                  {result.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Health Trends */}
        <Card title="Health Metrics">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto text-neutral-400" />
              <p className="mt-2 text-neutral-500">Interactive health metrics chart will appear here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;