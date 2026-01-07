import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Nav/Header.jsx';
import { 
  Plus, 
  Home as HomeIcon, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2,
  MapPin,
  Users,
  Euro,
  Calendar,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import { useTranslation } from '../../contexts/TranslationContext';

function HostDashboard({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulário de nova propriedade
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price_per_night: '',
    cleaning_fee: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    city_id: '',
    address: '',
    property_type: 'apartment'
  });

  // Estados para cidades
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'host') {
      navigate('/');
      return;
    }
    fetchHostProperties();
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHostProperties = async () => {
    try {
      setLoading(true);
      
      // Busca todas as propriedades e filtra pelo usuário atual
      const response = await api.get('/properties');
      const allProperties = response.data?.data?.data || response.data?.data || response.data || [];
      // Filtra apenas as propriedades do usuário atual (host)
      const myProperties = allProperties.filter(prop => prop.host_id === user?.id || prop.user_id === user?.id);
      setProperties(myProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Não mostra notificação se for apenas problema de não ter propriedades
      if (error.response?.status && error.response.status >= 500) {
        notify(t('errors.serverError'), 'error');
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await api.get('/cities');
      setCities(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      notify(t('host.loadCitiesError'), 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!newProperty.title || !newProperty.price_per_night || !newProperty.city_id) {
      notify(t('host.requiredFields'), 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/properties', {
        ...newProperty,
        price_per_night: parseFloat(newProperty.price_per_night),
        cleaning_fee: parseFloat(newProperty.cleaning_fee || 0),
        max_guests: parseInt(newProperty.max_guests || 1),
        bedrooms: parseInt(newProperty.bedrooms || 1),
        bathrooms: parseInt(newProperty.bathrooms || 1),
        city_id: parseInt(newProperty.city_id)
      });

      notify(t('host.propertyCreated'), 'success');
      setShowAddModal(false);
      setNewProperty({
        title: '',
        description: '',
        price_per_night: '',
        cleaning_fee: '',
        max_guests: '',
        bedrooms: '',
        bathrooms: '',
        city_id: '',
        address: '',
        property_type: 'apartment'
      });
      fetchHostProperties();
    } catch (error) {
      console.error('Error creating property:', error);
      if (error.response?.data?.errors) {
        notify(Object.values(error.response.data.errors).flat().join('\n'), 'error');
      } else {
        notify(t('host.propertyError'), 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm(t('host.deleteConfirm'))) {
      return;
    }

    try {
      await api.delete(`/properties/${propertyId}`);
      notify(t('host.propertyDeleted'), 'success');
      fetchHostProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      notify(t('host.deleteError'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        user={user} 
        setUser={setUser} 
        onOpenSettings={onOpenSettings}
        onOpenSettingsAdmin={onOpenSettingsAdmin}
      />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              {t('host.dashboard')}
            </h1>
            <p className="text-gray-600 font-medium">
              {t('host.manageProperties')}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus size={20} />
            {t('host.addProperty')}
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t('host.totalProperties')}
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {properties.length}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <HomeIcon size={28} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t('host.activeProperties')}
                </p>
                <p className="text-3xl font-black text-green-600">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <Calendar size={28} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {t('host.potentialRevenue')}
                </p>
                <p className="text-3xl font-black text-purple-600">
                  €{properties.reduce((sum, p) => sum + (parseFloat(p.price_per_night) || 0), 0).toFixed(0)}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <Euro size={28} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <HomeIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t('host.noProperties')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('host.noPropertiesDesc')}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              {t('host.publishFirst')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {property.images && property.images[0] ? (
                    <img
                      src={property.images[0].image_path || property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      property.status === 'available' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {property.status === 'available' ? t('host.active') : t('host.inactive')}
                    </span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-5">
                  <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{property.city?.name || t('property.location')}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {property.max_guests}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-blue-600 text-lg">
                      €{property.price_per_night}/{t('common.night')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                    >
                      <Eye size={16} />
                      {t('settings.view')}
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
                    >
                      <Edit size={16} />
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-black text-gray-900 uppercase">
                {t('host.addProperty')}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitProperty} className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('host.propertyTitle')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  placeholder={t('host.propertyTitle')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('host.propertyDescription')}
                </label>
                <textarea
                  name="description"
                  value={newProperty.description}
                  onChange={handleInputChange}
                  placeholder={t('host.propertyDescription')}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Grid para campos numéricos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('host.pricePerNight')} (€) *
                  </label>
                  <input
                    type="number"
                    name="price_per_night"
                    value={newProperty.price_per_night}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('property.cleaningFee')} (€)
                  </label>
                  <input
                    type="number"
                    name="cleaning_fee"
                    value={newProperty.cleaning_fee}
                    onChange={handleInputChange}
                    placeholder="20"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Grid para capacidades */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('common.guests')}
                  </label>
                  <input
                    type="number"
                    name="max_guests"
                    value={newProperty.max_guests}
                    onChange={handleInputChange}
                    placeholder="2"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('common.bedrooms')}
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={newProperty.bedrooms}
                    onChange={handleInputChange}
                    placeholder="1"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {t('common.bathrooms')}
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={newProperty.bathrooms}
                    onChange={handleInputChange}
                    placeholder="1"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Tipo de Propriedade */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('host.propertyType')}
                </label>
                <select
                  name="property_type"
                  value={newProperty.property_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="apartment">{t('filter.apartment')}</option>
                  <option value="house">{t('filter.house')}</option>
                  <option value="villa">{t('filter.villa')}</option>
                  <option value="studio">{t('host.studio')}</option>
                  <option value="room">{t('host.room')}</option>
                </select>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('host.city')} *
                </label>
                <select
                  name="city_id"
                  value={newProperty.city_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                >
                  <option value="">{t('host.selectCity')}</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Morada */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('host.address')}
                </label>
                <input
                  type="text"
                  name="address"
                  value={newProperty.address}
                  onChange={handleInputChange}
                  placeholder={t('host.address')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t('host.publishing')}
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      {t('host.publishProperty')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostDashboard;
