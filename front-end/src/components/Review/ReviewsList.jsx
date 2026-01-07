import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Trash2, AlertCircle, X } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';

function ReviewsList({ propertyId, onStatsUpdate, user, propertyHostId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get(`/properties/${propertyId}/reviews`);
      console.log('Reviews API Response:', response.data);
      const data = response.data;

      let reviewsData = [];
      if (data?.reviews) {

        reviewsData = data.reviews?.data || data.reviews;
      }
      console.log('Reviews Data:', reviewsData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setStats(data?.stats || null);
      
      // Notify parent component about stats update
      if (onStatsUpdate && data?.stats) {
        onStatsUpdate(data.stats);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      notify('Erro ao carregar avaliações', 'error');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId, onStatsUpdate]);

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId, fetchReviews]);

  const handleDeleteReview = async (reviewId) => {
    setConfirmDelete(reviewId);
  };

  const confirmDeleteReview = async () => {
    const reviewId = confirmDelete;
    setConfirmDelete(null);

    try {
      setDeleting(reviewId);
      await api.delete(`/reviews/${reviewId}`);
      notify('Avaliação apagada com sucesso', 'success');
      fetchReviews(); // Reload reviews
    } catch (err) {
      console.error('Error deleting review:', err);
      notify(err.response?.data?.message || 'Erro ao apagar avaliação', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const canDeleteReview = (review) => {
    if (!user) return false;
    // Can delete if: owner, admin, or property host
    return review.user?.id === user.id || 
           user.role === 'admin' || 
           propertyHostId === user.id;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">A carregar avaliações...</p>
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="text-gray-500">Esta propriedade ainda não tem avaliações</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {stats && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{parseFloat(stats.average_rating).toFixed(1)}</div>
              <div className="flex justify-center mt-1">{renderStars(Math.round(stats.average_rating))}</div>
            </div>
            <div className="border-l border-gray-300 pl-4">
              <p className="text-sm text-gray-600">{stats.total_reviews} avaliações</p>
              <p className="text-sm text-gray-600 mt-1">
                {Math.round(stats.recommend_percentage || 0)}% recomendam
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="text-sm">
              <span className="text-gray-600">Limpeza:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_cleanliness).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Comunicação:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_communication).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Check-in:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_checkin).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Precisão:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_accuracy).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Localização:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_location).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Qualidade/Preço:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_value).toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 relative">
            {/* Delete Button - Only visible for admin, host, or review owner */}
            {canDeleteReview(review) && (
              <button
                onClick={() => handleDeleteReview(review.id)}
                disabled={deleting === review.id}
                className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                title="Apagar avaliação"
              >
                <Trash2 size={18} />
              </button>
            )}

            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {review.user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{review.user?.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              {renderStars(review.rating_overall)}
              <span className="text-sm font-semibold text-gray-700">{review.rating_overall}</span>
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-3">{review.comment}</p>

            {/* Recommend Badge */}
            {review.recommend && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-3">
                ✓ Recomenda esta propriedade
              </div>
            )}

            {/* Host Reply */}
            {review.host_reply && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">Resposta do anfitrião:</p>
                <p className="text-sm text-gray-700">{review.host_reply}</p>
                {review.host_replied_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.host_replied_at).toLocaleDateString('pt-PT')}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">Apagar Avaliação</h3>
                <p className="text-sm text-gray-600 mt-1">Esta ação não pode ser desfeita.</p>
              </div>
              <button
                onClick={() => setConfirmDelete(null)}
                className="ml-auto p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteReview}
                disabled={deleting === confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting === confirmDelete ? 'A apagar...' : 'Apagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
