import React from 'react';
import { Trash2 } from 'lucide-react';

function DeleteConfirmModal({ show, property, onConfirm, onCancel }) {
  if (!show || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-black text-gray-900 text-center mb-2">
            Eliminar Propriedade
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Tem certeza que deseja eliminar <span className="font-bold">{property.title}</span>? 
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
