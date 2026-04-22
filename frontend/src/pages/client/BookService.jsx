import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Calendar, Clock, Wrench, CheckCircle } from 'lucide-react';

const BookService = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_id: '',
    scheduled_date: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, servicesRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/services'),
        ]);
        setVehicles(vehiclesRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/bookings', formData);
      setSuccess(true);
      setFormData({ vehicle_id: '', service_id: '', scheduled_date: '', notes: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h2>
        <p className="text-gray-500 mb-4">Please add a vehicle first before booking a service.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book a Service</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>Service booked successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vehicle
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, vehicle_id: vehicle.id })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.vehicle_id === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.car_name}</p>
                      <p className="text-sm text-gray-500">{vehicle.plate_number}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, service_id: service.id })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.service_id === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">${service.price}</p>
                      {service.duration_minutes && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration_minutes} min
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows="3"
              placeholder="Any specific requirements or issues..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !formData.vehicle_id || !formData.service_id}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </>
            ) : (
              'Book Service'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookService;
