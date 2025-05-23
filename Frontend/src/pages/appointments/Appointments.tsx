import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  UserCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Appointment } from '../../types/appointment';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';

// Demo data for appointments
const appointmentData: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    providerId: 'd1',
    providerName: 'Dr. Jane Smith',
    date: '2025-06-15',
    time: '09:00',
    duration: 30,
    type: 'Follow-up',
    status: 'Scheduled'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Johnson',
    providerId: 'd1',
    providerName: 'Dr. Jane Smith',
    date: '2025-06-15',
    time: '10:30',
    duration: 45,
    type: 'Initial Visit',
    status: 'Scheduled'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    providerId: 'd1',
    providerName: 'Dr. Jane Smith',
    date: '2025-06-16',
    time: '14:15',
    duration: 30,
    type: 'Consultation',
    status: 'Scheduled'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Emily Davis',
    providerId: 'd2',
    providerName: 'Dr. Robert Wilson',
    date: '2025-06-15',
    time: '11:00',
    duration: 60,
    type: 'Procedure',
    status: 'Scheduled'
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'James Wilson',
    providerId: 'd1',
    providerName: 'Dr. Jane Smith',
    date: '2025-06-17',
    time: '09:30',
    duration: 30,
    type: 'Follow-up',
    status: 'Scheduled'
  },
  {
    id: '6',
    patientId: '6',
    patientName: 'Lisa Anderson',
    providerId: 'd2',
    providerName: 'Dr. Robert Wilson',
    date: '2025-06-17',
    time: '13:45',
    duration: 45,
    type: 'Initial Visit',
    status: 'Scheduled'
  },
  {
    id: '7',
    patientId: '7',
    patientName: 'David Martin',
    providerId: 'd1',
    providerName: 'Dr. Jane Smith',
    date: '2025-06-18',
    time: '10:00',
    duration: 30,
    type: 'Follow-up',
    status: 'Scheduled'
  }
];

const Appointments: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Generate week days
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = [...Array(7)].map((_, i) => addDays(startOfCurrentWeek, i));
  
  // Filter appointments based on selected date and status
  const filteredAppointments = appointmentData.filter(appointment => {
    const matchesStatus = 
      statusFilter === 'all' || 
      appointment.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesStatus;
  });
  
  // Group appointments by date for calendar view
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(parseISO(appointment.date), date)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Appointments</h1>
        <Link to="/appointments/new">
          <Button variant="primary" icon={<Plus size={16} />}>
            New Appointment
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewType === 'calendar'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setViewType('calendar')}
              >
                <CalendarIcon size={16} className="inline mr-2" />
                Calendar
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewType === 'list'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setViewType('list')}
              >
                <Filter size={16} className="inline mr-2" />
                List View
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input pl-3 pr-10 py-2 text-sm appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="checked-in">Checked-in</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-show</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight size={16} className="text-neutral-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {viewType === 'calendar' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-neutral-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-md hover:bg-neutral-100"
                  onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </button>
                <button 
                  className="p-2 rounded-md hover:bg-neutral-100"
                  onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {/* Day headers */}
              {weekDays.map((day, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-medium text-neutral-500 uppercase">
                    {format(day, 'EEE')}
                  </p>
                  <p className={`text-sm font-semibold mt-1 rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                    isSameDay(day, new Date()) 
                      ? 'bg-primary-600 text-white' 
                      : 'text-neutral-900'
                  }`}>
                    {format(day, 'd')}
                  </p>
                </div>
              ))}
              
              {/* Calendar cells */}
              {weekDays.map((day, i) => (
                <div 
                  key={`cell-${i}`} 
                  className={`border rounded-lg min-h-[150px] ${
                    isSameDay(day, new Date()) 
                      ? 'border-primary-300 bg-primary-50' 
                      : 'border-neutral-200'
                  }`}
                >
                  <div className="space-y-2 p-2">
                    {getAppointmentsForDate(day).map((appointment) => (
                      <Link 
                        key={appointment.id}
                        to={`/appointments/${appointment.id}`}
                        className="block p-2 bg-white border border-neutral-200 rounded-md hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-neutral-600">
                            <Clock size={12} className="inline mr-1" />
                            {appointment.time}
                          </span>
                          <Badge
                            variant={
                              appointment.type === 'Initial Visit' 
                                ? 'warning' 
                                : appointment.type === 'Procedure' 
                                ? 'error' 
                                : 'neutral'
                            }
                            className="text-xs"
                          >
                            {appointment.type}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium truncate">{appointment.patientName}</p>
                        <p className="text-xs text-neutral-500 truncate">{appointment.providerName}</p>
                      </Link>
                    ))}
                    
                    {getAppointmentsForDate(day).length === 0 && (
                      <div className="h-full flex items-center justify-center py-4">
                        <p className="text-xs text-neutral-400">No appointments</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {viewType === 'list' && (
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
                    Provider
                  </th>
                  <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
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
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircle className="h-10 w-10 rounded-full text-neutral-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {appointment.patientName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            ID: {appointment.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {appointment.time} ({appointment.duration} min)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {appointment.providerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          appointment.type === 'Initial Visit' 
                            ? 'warning' 
                            : appointment.type === 'Procedure' 
                            ? 'error' 
                            : 'neutral'
                        }
                      >
                        {appointment.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          appointment.status === 'Completed' 
                            ? 'success' 
                            : appointment.status === 'Cancelled' || appointment.status === 'No-show'
                            ? 'error' 
                            : appointment.status === 'In-progress' || appointment.status === 'Checked-in'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <Link
                        to={`/appointments/${appointment.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/appointments/${appointment.id}/edit`}
                        className="text-secondary-600 hover:text-secondary-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{filteredAppointments.length}</span> of <span className="font-medium">{appointmentData.length}</span> appointments
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-500 hover:bg-neutral-50 disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm bg-primary-50 text-primary-600 font-medium">
                    1
                  </button>
                  <button className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-500 hover:bg-neutral-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick View */}
      <Card title="Today's Appointments">
        <div className="space-y-4">
          {appointmentData
            .filter(appointment => appointment.date === format(new Date(), 'yyyy-MM-dd'))
            .map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-md hover:bg-neutral-50">
                <div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-neutral-400 mr-2" />
                    <span className="text-sm text-neutral-600">{appointment.time}</span>
                    <span className="mx-2 text-neutral-300">•</span>
                    <span className="text-sm text-neutral-600">{appointment.duration} min</span>
                  </div>
                  <p className="font-medium mt-1">{appointment.patientName}</p>
                  <p className="text-sm text-neutral-500">{appointment.providerName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      appointment.type === 'Initial Visit' 
                        ? 'warning' 
                        : appointment.type === 'Procedure' 
                        ? 'error' 
                        : 'neutral'
                    }
                  >
                    {appointment.type}
                  </Badge>
                  <Link to={`/appointments/${appointment.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            
          {appointmentData.filter(appointment => appointment.date === format(new Date(), 'yyyy-MM-dd')).length === 0 && (
            <div className="text-center py-8">
              <CalendarIcon size={32} className="mx-auto text-neutral-300" />
              <p className="mt-2 text-neutral-500">No appointments scheduled for today</p>
              <div className="mt-4">
                <Link to="/appointments/new">
                  <Button variant="primary" size="sm">
                    Schedule Appointment
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Appointments;