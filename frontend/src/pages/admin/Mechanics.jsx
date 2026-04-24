import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { UserCog, Mail, Phone, Wrench, Users } from 'lucide-react';

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await api.get('/users/mechanics');
        setMechanics(response.data);
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Mechanics</h1>
          <p className="text-gray-500 mt-1">Manage and view all registered mechanics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <Users className="w-5 h-5" />
          <span className="font-medium">{mechanics.length} Mechanics</span>
        </div>
      </div>

      {/* Mechanics Grid */}
      {mechanics.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No mechanics found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mechanics.map((mechanic) => (
            <div
              key={mechanic.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Avatar and Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCog className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{mechanic.name}</h3>
                  <p className="text-sm text-gray-500">Mechanic</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-gray-700">{mechanic.email || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-gray-700">{mechanic.phone || 'N/A'}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mechanics;
