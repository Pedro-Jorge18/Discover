import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Nav/Header.jsx';
import PropertyFormModal from './PropertyFormModal.jsx';
import PropertyList from './PropertyList.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import { Plus, Loader2, Home, Eye, Calendar, TrendingUp } from 'lucide-react';
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
  const [cities, setCities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

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
    fetchHostProperties();
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHostProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties', { params: { include_unpublished: true } });
      const allProperties = response.data?.data?.data || response.data?.data || response.data || [];
      const myProperties = allProperties.filter(prop => prop.host?.id === user?.id);
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
      const propertyTypeMap = { apartment: 1, house: 2, villa: 3, studio: 4, room: 5 };
      const listingTypeMap = { entire_place: 1, private_room: 2, shared_room: 3 };

      // Format times based on operation: Y-m-d H:i:s for create, H:i for update
      let checkInFormatted, checkOutFormatted;
      if (editingProperty) {
        // For update: just H:i
        checkInFormatted = formData.check_in_time;
        checkOutFormatted = formData.check_out_time;
      } else {
        // For create: Y-m-d H:i:s
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
      setTimeout(fetchHostProperties, 500);
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

    // Debug: Log the property location structure
    console.log('Property location:', property.location);
    console.log('Country from location:', property.location?.country);
    console.log('Country from state:', property.location?.state?.country);
    
    const countryName = property.location?.country?.name || property.location?.state?.country?.name || '';
    console.log('Final country name:', countryName);
    
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
            <h3 className="text-3xl font-black mb-1">0</h3>
            <p className="text-purple-100 font-medium text-sm">{t('host.activeReservations')}</p>
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
        cities={cities}
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
