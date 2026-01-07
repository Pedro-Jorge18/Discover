import React from 'react';
import { X, Upload, Edit, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';

function PropertyFormModal({ 
  show, 
  onClose, 
  onSubmit, 
  property, 
  formData, 
  onChange, 
  cities, 
  selectedImages, 
  onImageChange, 
  submitting 
}) {
  if (!show) return null;

  const isEditing = !!property;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-black text-gray-900 uppercase">
            {isEditing ? 'Editar Propriedade' : 'Publicar Nova Propriedade'}
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
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Título da Propriedade *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
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
              value={formData.description}
              onChange={onChange}
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
              value={formData.summary}
              onChange={onChange}
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
                value={formData.price_per_night}
                onChange={onChange}
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
                value={formData.cleaning_fee}
                onChange={onChange}
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
                value={formData.max_guests}
                onChange={onChange}
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
                value={formData.bedrooms}
                onChange={onChange}
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
                Casas de Banho
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
                Tipo de Propriedade *
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={onChange}
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
                value={formData.listing_type}
                onChange={onChange}
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
                value={formData.check_in_time}
                onChange={onChange}
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
                value={formData.check_out_time}
                onChange={onChange}
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
                value={formData.city_id}
                onChange={onChange}
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
                value={formData.neighborhood}
                onChange={onChange}
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
                value={formData.postal_code}
                onChange={onChange}
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
                value={formData.address}
                onChange={onChange}
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
                value={formData.latitude}
                onChange={onChange}
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
                value={formData.longitude}
                onChange={onChange}
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
              {isEditing ? 'Adicionar Novas Imagens' : 'Imagens da Propriedade'}
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste imagens
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WebP (máx. 5 imagens, 2MB cada)</p>
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
                  onChange={onImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isEditing 
                ? '* Adicione novas imagens (as existentes serão mantidas)'
                : '* Se não adicionar imagens, serão utilizadas imagens padrão'
              }
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
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
                  {isEditing ? 'A atualizar...' : 'A publicar...'}
                </>
              ) : (
                <>
                  {isEditing ? <Edit size={20} /> : <Upload size={20} />}
                  {isEditing ? 'Atualizar Propriedade' : 'Publicar Propriedade'}
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