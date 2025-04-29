import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Calendar, Clock, Users, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase/supabaseClient';
import type { Database } from '../lib/types/database.types';

type BusinessWithServices = Database['public']['Tables']['businesses']['Row'] & {
  services: Database['public']['Tables']['services']['Row'][];
};

const DashboardCard = ({ title, value, icon: Icon, className = '' }: { title: string; value: string | number; icon: React.ElementType; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  </div>
);

const BusinessProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<BusinessWithServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('businesses')
          .select(`
            *,
            services(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Business not found');

        setBusiness(data as BusinessWithServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Business not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control - Negocio</h1>
            <p className="text-gray-500 mt-1">Gestiona tu negocio y servicios</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Añadir servicio
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Citas Hoy"
            value="0"
            icon={Calendar}
          />
          <DashboardCard
            title="Esta semana"
            value="0"
            icon={Clock}
          />
          <DashboardCard
            title="Total de servicios"
            value={business.services.length}
            icon={Users}
          />
          <DashboardCard
            title="Clientes activos"
            value="0"
            icon={Users}
          />
        </div>

        {/* Business Profile */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <Building2 className="w-12 h-12 text-blue-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{business.name}</h2>
              <p className="text-gray-500 mt-1">{business.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{business.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{business.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{business.email}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              Editar perfil
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Servicios</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Buscar servicio..."
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {business.services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    ${service.price}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duración: {service.duration} min</span>
                  <button className="text-blue-500 hover:text-blue-600 font-medium">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
