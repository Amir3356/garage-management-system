import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import {
  Wrench,
  Clock,
  CheckCircle,
  MessageSquare,
  Car,
  User,
  Calendar,
} from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/bookings');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, status) => {
    try {
      await api.put(`/bookings/${jobId}`, { status, notes: notes || undefined });
      setSelectedJob(null);
      setNotes('');
      fetchJobs();
    } catch (error) {
      alert('Error updating job status');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <div className="flex gap-2">
          {['all', 'in_progress', 'completed'].map((status) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{job.service?.name}</h3>
                  <p className="text-sm text-gray-500">${job.service?.price}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                  job.status
                )}`}
              >
                {job.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {job.vehicle?.car_name} ({job.vehicle?.plate_number})
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{job.user?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {job.scheduled_date
                    ? new Date(job.scheduled_date).toLocaleString()
                    : 'Not scheduled'}
                </span>
              </div>
              {job.notes && (
                <div className="flex items-start gap-3 text-sm">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{job.notes}</span>
                </div>
              )}
            </div>

            {job.status === 'in_progress' && (
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Job
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="col-span-full bg-white rounded-xl p-8 text-center border border-gray-200">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'You have no assigned jobs at the moment.'
                : `No ${filter.replace('_', ' ')} jobs found.`}
            </p>
          </div>
        )}
      </div>

      {/* Complete Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Job</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedJob.service?.name}</p>
              <p className="text-sm text-gray-500">
                {selectedJob.vehicle?.car_name} ({selectedJob.vehicle?.plate_number})
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  rows="3"
                  placeholder="Add any notes about the service performed..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedJob.id, 'completed')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
