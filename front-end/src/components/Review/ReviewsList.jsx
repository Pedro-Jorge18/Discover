import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Trash2, AlertCircle, X, Edit2 } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import { useTranslation } from '../../contexts/TranslationContext';

function ReviewsList({ propertyId, onStatsUpdate, user, propertyHostId }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRecommend, setEditRecommend] = useState(false);
  const [saving, setSaving] = useState(null);
  const MAX_CHARACTERS = 1000;

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
      notify(t('review.errorLoadingReviews'), 'error');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId, t]);

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
      notify(t('review.deleted'), 'success');
      // Refresh reviews list without reloading the page
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      notify(err.response?.data?.message || t('review.deleteError'), 'error');
    } finally {
      setDeleting(null);
    }
  };

  const canDeleteReview = (review) => {
    if (!user) return false;
    // Can delete if: owner of review, admin, or property host
    return review.user?.id === user.id || 
           user.role === 'admin' || 
           propertyHostId === user.id;
  };

  const canEditReview = (review) => {
    if (!user) return false;
    // Only the review owner can edit their comment
    return review.user?.id === user.id;
  };

  const handleEditReview = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
    setEditRecommend(review.recommend || false);
  };

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setEditComment(text);
    }
  };

  const handleSaveEdit = async () => {
    if (!editComment.trim()) {
      notify(t('review.commentCannotBeEmpty'), 'error');
      return;
    }

    try {
      setSaving(editingId);
      await api.put(`/reviews/${editingId}`, {
        comment: editComment,
        recommend: editRecommend
      });
      
      notify(t('review.updated'), 'success');
      // Update the review in the list
      setReviews(reviews.map(r => 
        r.id === editingId ? { ...r, comment: editComment, recommend: editRecommend } : r
      ));
      setEditingId(null);
      setEditComment('');
      setEditRecommend(false);
    } catch (err) {
      console.error('Error updating review:', err);
      notify(err.response?.data?.message || t('review.updateError'), 'error');
    } finally {
      setSaving(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditComment('');
    setEditRecommend(false);
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
        <p className="text-gray-500">{t('review.loading')}</p>
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
        <p className="text-gray-500">{t('review.noPropertyReviews')}</p>
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
              <p className="text-sm text-gray-600">{stats.total_reviews} {t('review.reviewsCount')}</p>
              <p className="text-sm text-gray-600 mt-1">
                {Math.round(stats.recommend_percentage || 0)}{t('review.recommendPercent')}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="text-sm">
              <span className="text-gray-600">{t('review.cleanliness')}:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_cleanliness).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">{t('review.communication')}:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_communication).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">{t('review.checkIn')}:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_checkin).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">{t('review.accuracy')}:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_accuracy).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">{t('review.location')}:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_location).toFixed(1)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">{t('review.valueForMoney')}:</span>
              <span className="ml-2 font-semibold">{parseFloat(stats.avg_value).toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 relative">
            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              {canEditReview(review) && (
                <button
                  onClick={() => handleEditReview(review)}
                  disabled={editingId === review.id || saving === review.id}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                  title="Editar comentário"
                >
                  <Edit2 size={18} />
                </button>
              )}
              {canDeleteReview(review) && (
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  disabled={deleting === review.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  title="Apagar avaliação"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

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

            {/* Comment - Edit or Display */}
            {editingId === review.id ? (
              <div className="mb-4 space-y-3">
                <div>
                  <textarea
                    value={editComment}
                    onChange={handleCommentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-sans text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    maxLength={MAX_CHARACTERS}
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {editComment.length}/{MAX_CHARACTERS}
                  </div>
                </div>

                {/* Recommend Checkbox */}
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    id={`recommend-${editingId}`}
                    checked={editRecommend}
                    onChange={(e) => setEditRecommend(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor={`recommend-${editingId}`} className="text-sm font-semibold text-green-700 cursor-pointer">
                    ✓ Recomendo esta propriedade
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving === editingId}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving === editingId ? 'A guardar...' : 'Guardar'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mb-3">{review.comment}</p>
            )}

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