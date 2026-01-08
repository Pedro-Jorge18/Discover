import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Nav/Header.jsx';
import PropertyFormModal from './PropertyFormModal.jsx';
import PropertyList from './PropertyList.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import { Plus, Loader2, Home, Eye, Calendar, TrendingUp, Clock, Check, X, User, MapPin } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import { useTranslation } from '../../contexts/TranslationContext';

function HostDashboard({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [processingReservation, setProcessingReservation] = useState(null);

  const [formData, setFormData] = useState({
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
    city_name: '',
    country_name: '',
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

  useEffect(() => {
    if (!user || user.role !== 'host') {
      navigate('/');
      return;
    }
    const loadData = async () => {
      await fetchHostProperties();
      fetchPendingReservations();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHostProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties', { 
        params: { 
          include_unpublished: true,
          per_page: 100  // Request up to 100 properties for host dashboard
        } 
      });
      console.log('API Response:', response.data);
      const allProperties = response.data?.data?.data || response.data?.data || response.data || [];
      console.log('All Properties:', allProperties);
      console.log('Current User ID:', user?.id);
      const myProperties = allProperties.filter(prop => {
        const hostId = prop.host?.id || prop.host_id;
        console.log('Property:', prop.id, 'Host ID:', hostId, 'Matches:', hostId === user?.id);
        return hostId === user?.id;
      });
      console.log('My Properties:', myProperties);
      const normalized = myProperties.map((prop) => {
        const published = prop.settings?.published ?? prop.published ?? false;
        return {
          ...prop,
          published,
          settings: {
            ...prop.settings,
            published
          }
        };
      });
      setProperties(normalized);
    } catch (error) {
      console.error('Error fetching properties:', error);
      if (error.response?.status && error.response.status >= 500) {
        notify(t('host.serverError'), 'error');
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReservations = async () => {
    try {
      setLoadingReservations(true);
      const response = await api.get('/reservations', {
        params: { status: 'pending', host_id: user?.id }
      });
      const allReservations = response.data?.data || response.data || [];
      // Ensure it's always an array
      setPendingReservations(Array.isArray(allReservations) ? allReservations : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setPendingReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleReservationAction = async (reservationId, action) => {
    try {
      setProcessingReservation(reservationId);
      await api.patch(`/reservations/${reservationId}`, {
        status: action === 'accept' ? 'confirmed' : 'cancelled'
      });
      notify(
        action === 'accept' 
          ? t('host.reservationAccepted') 
          : t('host.reservationRejected'), 
        'success'
      );
      // Refresh reservations list
      fetchPendingReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      notify(t('host.reservationError'), 'error');
    } finally {
      setProcessingReservation(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      notify(t('host.maxImages'), 'warning');
      return;
    }
    
    // Check file sizes (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      notify(`${t('host.imagesTooLarge')} (${oversizedFiles.length})`, 'error');
      return;
    }
    
    setSelectedImages(files);
  };

  const resetForm = () => {
    setFormData({
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
    setEditingProperty(null);
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['title','price_per_night','neighborhood','postal_code','beds','city_name'];
    const missing = requiredFields.find((field) => !formData[field]);
    if (missing) {
      notify(t('host.requiredFields'), 'error');
      return;
    }

    try {
      setSubmitting(true);
      const propertyTypeMap = { apartment: 1, house: 2, cabin: 3, hotel_room: 4 };
      const listingTypeMap = { entire_place: 1, private_room: 2, shared_room: 3 };

      // Format times based on operation: Y-m-d H:i:s for create, H:i for update
      let checkInFormatted, checkOutFormatted;
      if (editingProperty) {
        // For update: just H:i
        checkInFormatted = formData.check_in_time;
        checkOutFormatted = formData.check_out_time;
      } else {
        const today = new Date().toISOString().split('T')[0];
        checkInFormatted = `${today} ${formData.check_in_time}:00`;
        checkOutFormatted = `${today} ${formData.check_out_time}:00`;
      }

      const propertyData = {
        title: formData.title,
        description: formData.description || 'Descrição da propriedade',
        ...(formData.summary ? { summary: formData.summary } : {}),
        price_per_night: parseFloat(formData.price_per_night),
        host_id: user.id,
        check_in_time: checkInFormatted,
        check_out_time: checkOutFormatted,
        address: formData.address || 'Endereço não especificado',
        neighborhood: formData.neighborhood,
        postal_code: formData.postal_code,
        ...(formData.city_id ? { city_id: parseInt(formData.city_id) } : {}),
        ...(formData.city_name ? { city_name: formData.city_name } : {}),
        ...(formData.country_name ? { country_name: formData.country_name } : {}),
        ...(formData.latitude !== '' && formData.latitude != null ? { latitude: parseFloat(formData.latitude) } : {}),
        ...(formData.longitude !== '' && formData.longitude != null ? { longitude: parseFloat(formData.longitude) } : {}),
        property_type_id: propertyTypeMap[formData.property_type] || 1,
        listing_type_id: listingTypeMap[formData.listing_type] || 1,
        max_guests: parseInt(formData.max_guests || 1),
        bedrooms: parseInt(formData.bedrooms || 1),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms || 1),
        cleaning_fee: parseFloat(formData.cleaning_fee || 0)
      };

      let response;
      if (editingProperty) {
        response = await api.patch(`/properties/${editingProperty.id}`, propertyData);
        notify(t('host.propertyUpdated'), 'success');
      } else {
        response = await api.post('/properties', propertyData);
        notify(t('host.propertyCreated'), 'success');
      }

      const propertyId = response.data?.data?.id || response.data?.id || editingProperty?.id;

      // Upload images for both new and edited properties
      if (selectedImages.length > 0 && propertyId) {
        const formDataImages = new FormData();
        selectedImages.forEach(image => formDataImages.append('images[]', image));
        try {
          await api.post(`/properties/${propertyId}/images`, formDataImages, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (editingProperty) {
            notify(t('host.imagesAdded'), 'success');
          }
        } catch (imgError) {
          console.error('Error uploading images:', imgError);
          notify(editingProperty ? t('host.imagesUploadError') : t('host.imagesUploadPartial'), 'warning');
        }
      }

      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      // Refresh properties list after successful creation
      await fetchHostProperties();
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

  const handleTogglePublished = async (propertyId, currentStatus) => {
    const nextStatus = !currentStatus;
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, published: nextStatus, settings: { ...p.settings, published: nextStatus } }
          : p
      )
    );

    try {
      await api.patch(`/properties/${propertyId}`, {
        published: nextStatus,
        settings: { published: nextStatus }
      });
      notify(nextStatus ? t('host.propertyActivated') : t('host.propertyDeactivated'), 'success');
      fetchHostProperties();
    } catch (error) {
      console.error('Error toggling property status:', error);
      notify(t('host.toggleStatusError'), 'error');
      // Revert on failure
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, published: currentStatus, settings: { ...p.settings, published: currentStatus } }
            : p
        )
      );
    }
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    
    // Extract time from various possible formats
    let checkInTime = '15:00';
    let checkOutTime = '11:00';
    
    if (property.check_in_time) {
      // Try to extract HH:MM from datetime string or use directly if already in HH:MM format
      if (property.check_in_time.includes(' ')) {
        checkInTime = property.check_in_time.split(' ')[1].substring(0, 5);
      } else if (property.check_in_time.length >= 5) {
        checkInTime = property.check_in_time.substring(0, 5);
      }
    }
    
    if (property.check_out_time) {
      if (property.check_out_time.includes(' ')) {
        checkOutTime = property.check_out_time.split(' ')[1].substring(0, 5);
      } else if (property.check_out_time.length >= 5) {
        checkOutTime = property.check_out_time.substring(0, 5);
      }
    }

    const countryName =
      property.location?.country?.name ||
      property.location?.state?.country?.name ||
      property.country_name ||
      property.country ||
      'Portugal';
    
    setFormData({
      title: property.title,
      description: property.description || '',
      summary: property.summary || '',
      price_per_night: property.price?.per_night || property.price_per_night || '',
      cleaning_fee: property.price?.cleaning_fee || property.cleaning_fee || '',
      max_guests: property.capacity?.max_guests || property.max_guests || '',
      bedrooms: property.capacity?.bedrooms || property.bedrooms || '',
      bathrooms: property.capacity?.bathrooms || property.bathrooms || '',
      beds: property.capacity?.beds || property.beds || '',
      city_id: property.location?.city?.id || property.city_id || '',
      city_name: property.location?.city?.name || '',
      country_name: countryName,
      address: property.location?.address || property.address || '',
      neighborhood: property.location?.neighborhood || property.neighborhood || '',
      postal_code: property.location?.postal_code || property.postal_code || '',
      latitude: property.location?.coordinates?.latitude || property.latitude || '',
      longitude: property.location?.coordinates?.longitude || property.longitude || '',
      property_type: property.types?.property_type?.id || property.property_type_id || 'apartment',
      listing_type: property.types?.listing_type?.id || property.listing_type_id || 'entire_place',
      check_in_time: checkInTime,
      check_out_time: checkOutTime
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await api.delete(`/properties/${propertyToDelete.id}`);
      notify(t('host.propertyDeleted'), 'success');
      setShowDeleteModal(false);
      setPropertyToDelete(null);
      fetchHostProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      notify(t('host.deleteError'), 'error');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Discover - {t('host.dashboard')}</title>
      <Header 
        user={user} 
        setUser={setUser} 
        onOpenSettings={onOpenSettings}
        onOpenSettingsAdmin={onOpenSettingsAdmin}
      />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8">
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Home size={24} />
              </div>
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <h3 className="text-3xl font-black mb-1">{properties.length}</h3>
            <p className="text-blue-100 font-medium text-sm">{t('host.totalProperties')}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye size={24} />
              </div>
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <h3 className="text-3xl font-black mb-1">
              {properties.filter(p => p.settings?.published || p.published).length}
            </h3>
            <p className="text-green-100 font-medium text-sm">{t('host.activeProperties')}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar size={24} />
              </div>
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <h3 className="text-3xl font-black mb-1">{pendingReservations.length}</h3>
            <p className="text-purple-100 font-medium text-sm">{t('host.pendingReservations')}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">+0%</span>
            </div>
            <h3 className="text-3xl font-black mb-1">€0</h3>
            <p className="text-orange-100 font-medium text-sm">{t('host.revenue')}</p>
          </div>
        </div>

        {/* Pending Reservations Section - SEMPRE VISÍVEL */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-purple-600" size={28} />
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              {t('host.pendingReservationsTitle')}
            </h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
              {pendingReservations.length}
            </span>
          </div>

          {loadingReservations ? (
            <div className="bg-white rounded-2xl shadow-md p-16 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          ) : pendingReservations.length === 0 ? (
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-md p-16 text-center border-2 border-purple-100">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-purple-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('host.noPendingReservations')}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {t('host.noPendingReservationsDesc')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(pendingReservations) && pendingReservations.map((reservation) => (
                <div 
                  key={reservation.id}
                  className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-xl transition"
                >
                  {/* Property Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-gray-900 mb-1 line-clamp-1">
                        {reservation.property?.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span className="line-clamp-1">
                          {reservation.property?.location?.city?.name || reservation.property?.city?.name}
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-100 px-3 py-1 rounded-full">
                      <Clock size={14} className="text-purple-600" />
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="bg-white/80 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{reservation.guest?.name || 'Hóspede'}</p>
                        <p className="text-xs text-gray-500">{reservation.guests} {t('common.guests')}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{t('property.checkIn')}</p>
                        <p className="font-bold text-gray-900">
                          {new Date(reservation.check_in).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{t('property.checkOut')}</p>
                        <p className="font-bold text-gray-900">
                          {new Date(reservation.check_out).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 mb-4 text-white text-center">
                    <p className="text-xs font-semibold opacity-90 uppercase tracking-wide mb-1">{t('property.total')}</p>
                    <p className="text-2xl font-black">€{reservation.total_price}</p>
                  </div>

                  {/* Action Buttons - ACEITAR OU RECUSAR RESERVA */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleReservationAction(reservation.id, 'accept')}
                      disabled={processingReservation === reservation.id}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                    >
                      <Check size={20} strokeWidth={3} />
                      {processingReservation === reservation.id ? t('common.processing') : t('host.acceptReservation')}
                    </button>
                    <button
                      onClick={() => handleReservationAction(reservation.id, 'reject')}
                      disabled={processingReservation === reservation.id}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                    >
                      <X size={20} strokeWidth={3} />
                      {processingReservation === reservation.id ? t('common.processing') : t('host.rejectReservation')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
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
          <PropertyList
            properties={properties}
            onView={(id) => navigate(`/property/${id}`)}
            onEdit={handleEditProperty}
            onDelete={handleDeleteClick}
            onToggleStatus={handleTogglePublished}
          />
        )}
      </main>

      <PropertyFormModal
        show={showAddModal || showEditModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProperty}
        property={editingProperty}
        formData={formData}
        onChange={handleInputChange}
        selectedImages={selectedImages}
        onImageChange={handleImageChange}
        submitting={submitting}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        property={propertyToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setPropertyToDelete(null);
        }}
      />
    </div>
  );
}

export default HostDashboard;
