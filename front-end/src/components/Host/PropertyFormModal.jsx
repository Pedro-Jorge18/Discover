import React from 'react';
import { X, Upload, Edit, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

  function PropertyFormModal({ 
    show, 
    onClose, 
    onSubmit, 
    property, 
    formData, 
    onChange, 
    selectedImages, 
    onImageChange, 
    submitting 
  }) {
  const { t } = useTranslation();
  const isEditing = !!property;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-black text-gray-900 uppercase">
            {isEditing ? t('host.editProperty') : t('host.publishNewProperty')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t('host.propertyTitle')} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder={t('host.propertyTitlePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {t('host.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder={t('host.descriptionPlaceholder')}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Grid for numeric fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.pricePerNight')} (€) *
              </label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={onChange}
                placeholder={t('host.pricePerNightPlaceholder')}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.cleaningFee')} (€)
              </label>
              <input
                type="number"
                name="cleaning_fee"
                value={formData.cleaning_fee}
                onChange={onChange}
                placeholder={t('host.cleaningFeePlaceholder')}
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
                {t('common.guests')}
              </label>
              <input
                type="number"
                name="max_guests"
                value={formData.max_guests}
                onChange={onChange}
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
                value={formData.bedrooms}
                onChange={onChange}
                placeholder="1"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('common.beds')} 
              </label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={onChange}
                placeholder="2"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('common.bathrooms')}
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={onChange}
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
                {t('host.propertyType')} *
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="apartment">{t('host.apartment')}</option>
                <option value="house">{t('host.house')}</option>
                <option value="cabin">{t('host.cabin')}</option>
                <option value="hotel_room">{t('host.hotelRoom')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.listingType')} *
              </label>
              <select
                name="listing_type"
                value={formData.listing_type}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="entire_place">{t('host.entirePlace')}</option>
                <option value="private_room">{t('host.privateRoom')}</option>
                <option value="shared_room">{t('host.sharedRoom')}</option>
              </select>
            </div>
          </div>

          {/* Check-in e Check-out Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.checkInTime')} *
              </label>
              <input
                type="time"
                name="check_in_time"
                value={formData.check_in_time}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.checkOutTime')} *
              </label>
              <input
                type="time"
                name="check_out_time"
                value={formData.check_out_time}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          {/* Country, City, Neighborhood */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.country')}
              </label>
              <select
                name="country_name"
                value={formData.country_name}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">{t('host.select')}</option>
                <option value="Portugal">Portugal</option>
                <option value="Espanha">Espanha</option>
                <option value="França">França</option>
                <option value="Alemanha">Alemanha</option>
                <option value="Itália">Itália</option>
                <option value="Reino Unido">Reino Unido</option>
                <option value="Brasil">Brasil</option>
                <option value="Estados Unidos">Estados Unidos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.city')} *
              </label>
              <input
                type="text"
                name="city_name"
                value={formData.city_name}
                onChange={onChange}
                placeholder={t('host.cityPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.neighborhood')} *
              </label>
              <select
                name="neighborhood"
                value={formData.neighborhood}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">{t('host.select')}</option>
                <option value="Centro histórico">Centro histórico</option>
                <option value="Centro">Centro</option>
                <option value="Norte">Norte</option>
                <option value="Sul">Sul</option>
                <option value="Comercial">Comercial</option>
                <option value="Rural">Rural</option>
                <option value="Residencial">Residencial</option>
              </select>
            </div>
          </div>

          {/* Address and Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.address')}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onChange}
                placeholder={t('host.addressPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t('host.postalCode')} *
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={onChange}
                placeholder={t('host.postalCodePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          {/* Upload de Imagens */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {isEditing ? t('host.addNewImages') : t('host.propertyImages')}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{t('host.clickToUpload')}</span> {t('host.orDragImages')}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WebP (exatamente 4 imagens, 2MB cada)</p>
                  {selectedImages.length > 0 ? (
                    <div className={`mt-2 text-xs font-semibold ${
                      !isEditing && selectedImages.length === 4 
                        ? 'text-green-600' 
                        : !isEditing && selectedImages.length !== 4
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {selectedImages.length} imagem(ns) selecionada(s)
                      {selectedImages.length !== 4 && (
                        <p className="mt-2 text-xs text-red-600 font-semibold">
                          {selectedImages.length !== 4 ? t('host.exactlyFourImages') : t('host.requiredFourImages')}
                        </p>
                      )}
                    </div>
                  ) : !isEditing && (
                    <p className="mt-2 text-xs text-red-600 font-semibold">
                      {t('host.requiredFourImages')}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={onImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isEditing 
                ? t('host.addNewImagesEdit')
                : t('host.fourImagesRequired')
              }
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
                  {isEditing ? t('host.updating') : t('host.publishing')}
                </>
              ) : (
                <>
                  {isEditing ? <Edit size={20} /> : <Upload size={20} />}
                  {isEditing ? t('host.updateProperty') : t('host.publishProperty')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyFormModal;