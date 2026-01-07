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

function HostDashboard({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulário de nova propriedade
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    summary: '',
    price_per_night: '',
    cleaning_fee: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    beds: '',
    city_id: '',
    address: '',
    neighborhood: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    property_type: 'apartment',
    listing_type: 'entire_place',
    check_in_time: '15:00',
    check_out_time: '11:00'
  });

  // Estados para cidades e imagens
  const [cities, setCities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

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
      
      console.log('All properties:', allProperties);
      console.log('Current user ID:', user?.id);
      
      // Debug: log each property's host info
      allProperties.forEach((prop, index) => {
        console.log(`Property ${index + 1}:`, {
          id: prop.id,
          title: prop.title,
          host: prop.host,
          'host?.id': prop.host?.id,
          'matches user': prop.host?.id === user?.id
        });
      });
      
      // Filtra apenas as propriedades do usuário atual (host)
      // A API retorna o host como um objeto, não como host_id
      const myProperties = allProperties.filter(prop => {
        return prop.host?.id === user?.id;
      });
      
      console.log('My properties:', myProperties);
      console.log('Filter matched:', myProperties.length, 'properties');
      setProperties(myProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Não mostra notificação se for apenas problema de não ter propriedades
      if (error.response?.status && error.response.status >= 500) {
        notify('Erro ao conectar com o servidor', 'error');
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
      notify('Erro ao carregar cidades', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      notify('Máximo de 5 imagens permitidas', 'warning');
      return;
    }
    setSelectedImages(files);
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();
    
    // Validação completa
    const requiredFields = [
      { field: 'title', message: 'Título' },
      { field: 'summary', message: 'Resumo' },
      { field: 'price_per_night', message: 'Preço por noite' },
      { field: 'city_id', message: 'Cidade' },
      { field: 'neighborhood', message: 'Bairro' },
      { field: 'postal_code', message: 'Código Postal' },
      { field: 'latitude', message: 'Latitude' },
      { field: 'longitude', message: 'Longitude' },
      { field: 'beds', message: 'Número de camas' }
    ];

    for (const { field, message } of requiredFields) {
      if (!newProperty[field]) {
        notify(`${message} é obrigatório`, 'error');
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Mapear property_type para property_type_id
      const propertyTypeMap = {
        'apartment': 1,
        'house': 2,
        'villa': 3,
        'studio': 4,
        'room': 5
      };

      // Mapear listing_type para listing_type_id
      const listingTypeMap = {
        'entire_place': 1,
        'private_room': 2,
        'shared_room': 3
      };

      // Converter horários para formato Y-m-d H:i:s
      const today = new Date().toISOString().split('T')[0]; // Data atual no formato Y-m-d
      const checkInDateTime = `${today} ${newProperty.check_in_time}:00`;
      const checkOutDateTime = `${today} ${newProperty.check_out_time}:00`;
      
      // Cria a propriedade
      const response = await api.post('/properties', {
        title: newProperty.title,
        description: newProperty.description || 'Descrição da propriedade',
        summary: newProperty.summary,
        price_per_night: parseFloat(newProperty.price_per_night),
        host_id: user.id,
        check_in_time: checkInDateTime,
        check_out_time: checkOutDateTime,
        address: newProperty.address || 'Endereço não especificado',
        neighborhood: newProperty.neighborhood,
        postal_code: newProperty.postal_code,
        city_id: parseInt(newProperty.city_id),
        latitude: parseFloat(newProperty.latitude),
        longitude: parseFloat(newProperty.longitude),
        property_type_id: propertyTypeMap[newProperty.property_type] || 1,
        listing_type_id: listingTypeMap[newProperty.listing_type] || 1,
        max_guests: parseInt(newProperty.max_guests || 1),
        bedrooms: parseInt(newProperty.bedrooms || 1),
        beds: parseInt(newProperty.beds),
        bathrooms: parseInt(newProperty.bathrooms || 1),
        cleaning_fee: parseFloat(newProperty.cleaning_fee || 0)
      });

      const propertyId = response.data?.data?.id || response.data?.id;

      console.log('Property created - Full response:', response.data);
      console.log('Property created - Property ID:', propertyId);
      console.log('Property created - Has host?:', response.data?.data?.host || response.data?.host);

      // Upload de imagens se houver
      if (selectedImages.length > 0 && propertyId) {
        const formData = new FormData();
        selectedImages.forEach((image, index) => {
          formData.append('images[]', image);
        });

        try {
          await api.post(`/properties/${propertyId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (imgError) {
          console.error('Error uploading images:', imgError);
          notify('Propriedade criada, mas erro ao fazer upload das imagens', 'warning');
        }
      }

      notify('Propriedade publicada com sucesso!', 'success');
      setShowAddModal(false);
      setNewProperty({
        title: '',
        description: '',
        summary: '',
        price_per_night: '',
        cleaning_fee: '',
        max_guests: '',
        bedrooms: '',
        bathrooms: '',
        beds: '',
        city_id: '',
        address: '',
        neighborhood: '',
        postal_code: '',
        latitude: '',
        longitude: '',
        property_type: 'apartment',
        listing_type: 'entire_place',
        check_in_time: '15:00',
        check_out_time: '11:00'
      });
      setSelectedImages([]);
      
      // Aguarda um pouco antes de recarregar para garantir que a propriedade foi salva
      setTimeout(() => {
        fetchHostProperties();
      }, 500);
    } catch (error) {
      console.error('Error creating property:', error);
      if (error.response?.data?.errors) {
        notify(Object.values(error.response.data.errors).flat().join('\n'), 'error');
      } else {
        notify('Erro ao publicar propriedade', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Tem certeza que deseja eliminar esta propriedade?')) {
      return;
    }

    try {
      await api.delete(`/properties/${propertyId}`);
      notify('Propriedade eliminada com sucesso', 'success');
      fetchHostProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      notify('Erro ao eliminar propriedade', 'error');
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
            <title>Discover - Painel Anfitrião</title>
            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              Painel Anfitrião
            </h1>
            <p className="text-gray-600 font-medium">
              Gerir as suas propriedades publicadas
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus size={20} />
            Nova Propriedade
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Total Propriedades
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
                  Propriedades Ativas
                </p>
                <p className="text-3xl font-black text-green-600">
                  {properties.filter(p => p.settings?.published || p.status === 'available').length}
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
                  Receita Potencial
                </p>
                <p className="text-3xl font-black text-purple-600">
                  €{properties.reduce((sum, p) => sum + (parseFloat(p.price?.per_night || p.price_per_night) || 0), 0).toFixed(0)}
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
              Nenhuma propriedade publicada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece a publicar as suas propriedades para receber reservas
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Primeira Publicação
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
                      {property.status === 'available' ? 'Ativo' : 'Inativo'}
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
                    <span className="line-clamp-1">{property.location?.city?.name || 'Localização'}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {property.capacity?.max_guests || property.max_guests}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-blue-600 text-lg">
                      €{property.price?.per_night || property.price_per_night}/noite
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
                    >
                      <Edit size={16} />
                      Editar
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
                Publicar Nova Propriedade
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
                  Título da Propriedade *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Apartamento Moderno no Centro"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={newProperty.description}
                  onChange={handleInputChange}
                  placeholder="Descreva a sua propriedade..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Resumo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Resumo *
                </label>
                <textarea
                  name="summary"
                  value={newProperty.summary}
                  onChange={handleInputChange}
                  placeholder="Breve resumo da propriedade..."
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>

              {/* Grid para campos numéricos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Preço/Noite (€) *
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
                    Taxa de Limpeza (€)
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
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hóspedes
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
                    Quartos
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
                    Camas *
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={newProperty.beds}
                    onChange={handleInputChange}
                    placeholder="2"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Casas de Banho
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

              {/* Tipo de Propriedade e Listing Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tipo de Propriedade *
                  </label>
                  <select
                    name="property_type"
                    value={newProperty.property_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="villa">Moradia</option>
                    <option value="studio">Estúdio</option>
                    <option value="room">Quarto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tipo de Alojamento *
                  </label>
                  <select
                    name="listing_type"
                    value={newProperty.listing_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="entire_place">Local Inteiro</option>
                    <option value="private_room">Quarto Privado</option>
                    <option value="shared_room">Quarto Partilhado</option>
                  </select>
                </div>
              </div>

              {/* Check-in e Check-out Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hora Check-in *
                  </label>
                  <input
                    type="time"
                    name="check_in_time"
                    value={newProperty.check_in_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hora Check-out *
                  </label>
                  <input
                    type="time"
                    name="check_out_time"
                    value={newProperty.check_out_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Cidade, Bairro e Código Postal */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <select
                    name="city_id"
                    value={newProperty.city_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">Selecione</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Vizinhança *
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={newProperty.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Ex: Centro Histórico"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={newProperty.postal_code}
                    onChange={handleInputChange}
                    placeholder="1000-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Morada, Latitude e Longitude */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Morada
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={newProperty.address}
                    onChange={handleInputChange}
                    placeholder="Rua, número..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={newProperty.latitude}
                    onChange={handleInputChange}
                    placeholder="38.7223"
                    step="0.000001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={newProperty.longitude}
                    onChange={handleInputChange}
                    placeholder="-9.1393"
                    step="0.000001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Upload de Imagens */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Imagens da Propriedade
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste imagens
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (máx. 5 imagens)</p>
                      {selectedImages.length > 0 && (
                        <p className="mt-2 text-xs text-blue-600 font-semibold">
                          {selectedImages.length} imagem(ns) selecionada(s)
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Se não adicionar imagens, serão utilizadas imagens padrão
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      A publicar...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Publicar Propriedade
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
