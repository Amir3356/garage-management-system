import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { User, Wrench, Calendar, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [assigningAppointment, setAssigningAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, mechanicsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/users/mechanics'),
      ]);
      setAppointments(appointmentsRes.data);
      setMechanics(mechanicsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (appointmentId, mechanicId) => {
    try {
      await api.post(`/appointments/${appointmentId}/assign`, { mechanic_id: mechanicId });
      setAssigningAppointment(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning mechanic');
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { status });
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      await api.delete(`/appointments/${appointmentId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting appointment');
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <User className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mechanic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{appointment.user?.name}</p>
                    <p className="text-xs text-gray-500">{appointment.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{appointment.service?.name}</p>
                    <p className="text-xs text-gray-500">${appointment.service?.price}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {appointment.vehicle?.car_name}
                    <br />
                    <span className="text-xs">{appointment.vehicle?.plate_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        appointment.status
                      )}`}
                    >
                      {getStatusIcon(appointment.status)}
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {appointment.mechanic ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <Wrench className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-900">{appointment.mechanic.name}</span>
                          <button
                            onClick={() => setAssigningAppointment(appointment)}
                            className="block text-xs text-blue-600 hover:text-blue-700 mt-1"
                          >
                            Change Mechanic
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningAppointment(appointment)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Assign Mechanic
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </button>
                      )}
                      {appointment.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          className="text-xs text-green-600 hover:text-green-700"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign/Change Mechanic Modal */}
      {assigningAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {assigningAppointment.mechanic ? 'Change Mechanic' : 'Assign Mechanic'}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Appointment: {assigningAppointment.service?.name} for {assigningAppointment.user?.name}
            </p>
            {assigningAppointment.mechanic && (
              <p className="text-sm text-amber-600 mb-4">
                Currently assigned: <strong>{assigningAppointment.mechanic.name}</strong>
              </p>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mechanics
                .filter((m) => m.id !== assigningAppointment.mechanic?.id)
                .map((mechanic) => (
                  <button
                    key={mechanic.id}
                    onClick={() => handleAssign(assigningAppointment.id, mechanic.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mechanic.name}</p>
                      <p className="text-sm text-gray-500">{mechanic.email}</p>
                    </div>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setAssigningAppointment(null)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
