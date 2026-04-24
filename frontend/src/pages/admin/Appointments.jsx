import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { User, Wrench, Calendar, CheckCircle, XCircle, Clock, Trash2, Phone, Car, DollarSign, Mail } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [assigningAppointment, setAssigningAppointment] = useState(null);
  const [selectedMechanicId, setSelectedMechanicId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, mechanicsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/users/mechanics'),
      ]);
      // Handle paginated response
      const appointmentsData = appointmentsRes.data.data || appointmentsRes.data;
      const mechanicsData = mechanicsRes.data.data || mechanicsRes.data;
      const appointmentsArray = Array.isArray(appointmentsData) ? appointmentsData : [];
      // Group appointments by user+vehicle+date
      const grouped = groupAppointments(appointmentsArray);
      setAppointments(grouped);
      setMechanics(Array.isArray(mechanicsData) ? mechanicsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupAppointments = (appointments) => {
    const groups = {};
    appointments.forEach((apt) => {
      const key = `${apt.user_id}-${apt.vehicle_id}-${apt.scheduled_date}`;
      if (!groups[key]) {
        groups[key] = {
          ...apt,
          services: [apt.service],
          serviceIds: [apt.id],
        };
      } else {
        groups[key].services.push(apt.service);
        groups[key].serviceIds.push(apt.id);
      }
    });
    return Object.values(groups);
  };

  const handleAssign = async () => {
    if (!selectedMechanicId) {
      alert('Please select a mechanic');
      return;
    }
    try {
      const selectedMechanic = mechanics.find((m) => m.id === selectedMechanicId);
      // Assign to all grouped services
      const ids = assigningAppointment.serviceIds || [assigningAppointment.id];
      await Promise.all(ids.map(id =>
        api.post(`/appointments/${id}/assign`, { mechanic_id: selectedMechanicId })
      ));
      setAssigningAppointment(null);
      setSelectedMechanicId(null);
      setSuccessMessage(`Mechanic "${selectedMechanic?.name}" assigned to ${ids.length} service(s) successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning mechanic');
    }
  };

  const handleStatusUpdate = async (appointment, status) => {
    try {
      // Update all grouped services
      const ids = appointment.serviceIds || [appointment.id];
      await Promise.all(ids.map(id => api.put(`/appointments/${id}`, { status })));
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (appointment) => {
    const ids = appointment.serviceIds || [appointment.id];
    const msg = ids.length > 1
      ? `Are you sure you want to delete these ${ids.length} appointments?`
      : 'Are you sure you want to delete this appointment?';
    if (!confirm(msg)) {
      return;
    }
    try {
      await Promise.all(ids.map(id => api.delete(`/appointments/${id}`)));
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
      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}
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

      {/* Responsive Card Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            {/* Header - Status & Actions */}
            <div className="flex items-start justify-between mb-4">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full ${getStatusBadge(
                  appointment.status
                )}`}
              >
                {getStatusIcon(appointment.status)}
                {appointment.status.replace('_', ' ')}
              </span>
              <div className="flex gap-2">
                {appointment.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(appointment, 'cancelled')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
                {appointment.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusUpdate(appointment, 'completed')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark Complete"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(appointment)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.user?.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-3 h-3" />
                    {appointment.user?.phone || 'N/A'}
                  </div>
                </div>
              </div>
              {appointment.user?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-500 ml-13 pl-13">
                  <Mail className="w-3 h-3" />
                  {appointment.user.email}
                </div>
              )}
            </div>

            {/* Service Info - Multiple Services */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {appointment.services?.length > 1
                    ? `${appointment.services.length} Services`
                    : 'Service'}
                </span>
              </div>
              <div className="space-y-1 ml-6">
                {(appointment.services || [appointment.service]).map((svc, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{svc?.name}</span>
                    <span className="text-gray-500">${svc?.price}</span>
                  </div>
                ))}
              </div>
              {appointment.services?.length > 1 && (
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mt-2 pt-2 border-t border-gray-100">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  Total: ${appointment.services.reduce((sum, s) => sum + (s?.price || 0), 0)}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{appointment.vehicle?.car_name}</span>
              </div>
              <p className="text-sm text-gray-500 ml-6">{appointment.vehicle?.plate_number}</p>
            </div>

            {/* Date */}
            {appointment.scheduled_date && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(appointment.scheduled_date).toLocaleString()}
              </div>
            )}

            {/* Mechanic Assignment */}
            <div className="pt-4 border-t border-gray-100">
              {appointment.mechanic ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned to</p>
                      <p className="font-medium text-gray-900">{appointment.mechanic.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAssigningAppointment(appointment);
                      setSelectedMechanicId(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAssigningAppointment(appointment);
                    setSelectedMechanicId(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  Assign Mechanic
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Assign/Change Mechanic Modal */}
      {assigningAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {assigningAppointment.mechanic ? 'Change Mechanic' : 'Assign Mechanic'}
            </h2>
            <div className="text-sm text-gray-500 mb-2">
              <p className="font-medium text-gray-700 mb-1">Services for {assigningAppointment.user?.name}:</p>
              <div className="space-y-1">
                {(assigningAppointment.services || [assigningAppointment.service]).map((svc, idx) => (
                  <p key={idx} className="text-gray-600">• {svc?.name} (${svc?.price})</p>
                ))}
              </div>
            </div>
            {assigningAppointment.mechanic && (
              <p className="text-sm text-amber-600 mb-4">
                Currently assigned: <strong>{assigningAppointment.mechanic.name}</strong>
              </p>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {mechanics
                .filter((m) => m.id !== assigningAppointment.mechanic?.id)
                .map((mechanic) => (
                  <button
                    key={mechanic.id}
                    onClick={() => setSelectedMechanicId(mechanic.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      selectedMechanicId === mechanic.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedMechanicId === mechanic.id ? 'bg-blue-600' : 'bg-blue-100'
                    }`}>
                      <Wrench className={`w-4 h-4 ${selectedMechanicId === mechanic.id ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mechanic.name}</p>
                      <p className="text-sm text-gray-500">{mechanic.email}</p>
                    </div>
                  </button>
                ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAssigningAppointment(null);
                  setSelectedMechanicId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedMechanicId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
