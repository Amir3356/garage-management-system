import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, Wrench, CheckCircle, Sparkles, Shield, Zap, Settings, Eye, X, Info } from 'lucide-react';

const BookService = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_ids: [],
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
      const response = await api.post('/appointments', formData);
      const count = Array.isArray(response.data) ? response.data.length : 1;
      setSuccessCount(count);
      setSuccess(true);
      setFormData({ vehicle_id: '', service_ids: [], scheduled_date: '', notes: '' });
      setTimeout(() => {
        setSuccess(false);
        setSuccessCount(0);
      }, 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking service');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleService = (serviceId) => {
    setFormData((prev) => {
      const currentIds = prev.service_ids || [];
      const newIds = currentIds.includes(serviceId)
        ? currentIds.filter((id) => id !== serviceId)
        : [...currentIds, serviceId];
      return { ...prev, service_ids: newIds };
    });
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

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
          <span>
            {successCount > 1
              ? `${successCount} services booked successfully!`
              : 'Service booked successfully!'}
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">
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
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Select Services
            </label>
            {formData.service_ids?.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-2">
                  {formData.service_ids.length} service(s) selected:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.service_ids.map((id) => {
                    const service = services.find((s) => s.id === id);
                    return service ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs text-gray-700 border border-green-200"
                      >
                        {service.name}
                        <button
                          type="button"
                          onClick={() => toggleService(id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, index) => {
                const icons = [Wrench, Shield, Zap, Settings];
                const colors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'];
                const ServiceIcon = icons[index % icons.length];
                const color = colors[index % colors.length];
                const colorClasses = {
                  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-400', ring: 'ring-blue-500', selectedBg: 'bg-blue-50' },
                  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:border-emerald-400', ring: 'ring-emerald-500', selectedBg: 'bg-emerald-50' },
                  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', hover: 'hover:border-amber-400', ring: 'ring-amber-500', selectedBg: 'bg-amber-50' },
                  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-400', ring: 'ring-purple-500', selectedBg: 'bg-purple-50' },
                  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', hover: 'hover:border-rose-400', ring: 'ring-rose-500', selectedBg: 'bg-rose-50' },
                  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:border-cyan-400', ring: 'ring-cyan-500', selectedBg: 'bg-cyan-50' },
                }[color];

                const isSelected = formData.service_ids?.includes(service.id);

                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ease-out cursor-pointer ${
                      isSelected
                        ? `${colorClasses.border} ${colorClasses.selectedBg} shadow-lg ring-2 ${colorClasses.ring} ring-offset-2`
                        : `border-gray-200 bg-white hover:shadow-md ${colorClasses.hover}`
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className={`w-6 h-6 rounded-full ${colorClasses.bg} flex items-center justify-center`}>
                          <CheckCircle className={`w-4 h-4 ${colorClasses.text}`} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <ServiceIcon className={`w-6 h-6 ${colorClasses.text}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-gray-900 mb-1 truncate ${isSelected ? colorClasses.text : ''}`}>
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {service.description}
                        </p>

                      {/* Price, Duration & View Details */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${colorClasses.bg} ${colorClasses.text}`}>
                            ${service.price}
                          </span>
                          {isSelected && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Selected
                            </span>
                          )}
                          {service.duration_minutes && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3.5 h-3.5" />
                              {service.duration_minutes} min
                            </span>
                          )}
                        </div>
                          {/* View Details Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedService(service);
                            }}
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                              isSelected
                                ? `${colorClasses.text} ${colorClasses.bg} hover:opacity-80`
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule Date & Time */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900">
                  Schedule Appointment Date & Time
                </label>
                <p className="text-sm font-semibold text-gray-600">Choose when you want to bring your vehicle</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.scheduled_date ? formData.scheduled_date.split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value;
                    const currentTime = formData.scheduled_date?.split('T')[1] || '09:00:00';
                    setFormData({ ...formData, scheduled_date: `${date}T${currentTime}` });
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                />
              </div>

              {/* Time Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="time"
                    required
                    value={formData.scheduled_date ? formData.scheduled_date.split('T')[1]?.substring(0,5) : ''}
                    onChange={(e) => {
                      const time = e.target.value; // format: "HH:MM"
                      const currentDate = formData.scheduled_date?.split('T')[0] || new Date().toISOString().split('T')[0];
                      setFormData({ ...formData, scheduled_date: `${currentDate}T${time}:00` });
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
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
            disabled={submitting || !formData.vehicle_id || !formData.service_ids?.length || !formData.scheduled_date}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Appointment'
            )}
          </button>
        </form>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-fade-in shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedService.name}</h2>
                  <p className="text-sm text-gray-500">Service Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-5">
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedService.description || 'No description available.'}
                </p>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-blue-700 mb-1">Price</h3>
                  <p className="text-2xl font-bold text-blue-600">${selectedService.price}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-amber-700 mb-1">Duration</h3>
                  <p className="text-2xl font-bold text-amber-600">
                    {selectedService.duration_minutes ? `${selectedService.duration_minutes} min` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Service ID */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Service ID</span>
                <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">#{selectedService.id}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedService(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, service_id: selectedService.id });
                  setSelectedService(null);
                }}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Select This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookService;
