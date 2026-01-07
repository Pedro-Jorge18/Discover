import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, Edit, MessageSquare } from 'lucide-react';
import Header from '../Nav/Header.jsx';
import api from '../../api/axios';
import notify from '../../utils/notify';
import { useTranslation } from '../../contexts/TranslationContext';

export default function MyReviews({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    comment: '',
    recommend: true,
  });

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const response = await api.get('/reviews/my-reviews');
      const data = response.data?.data || response.data;
      // Handle both paginated and non-paginated responses
      const reviewsData = Array.isArray(data) ? data : (data?.data || data?.reviews || []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('Error fetching reviews:', err?.response || err);
      if (err?.response?.status === 401) {
        notify(t('auth.sessionExpired'), 'error');
      } else if (err?.response?.status === 404) {
        notify(t('review.routeNotFound'), 'error');
      } else {
        notify(t('review.errorLoadingYourReviews'), 'error');
      }
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('review.confirmDelete'))) return;

    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r.id !== id));
      notify(t('review.deletedSuccessfully'), 'success');
    } catch (err) {
      notify(t('review.errorDeleting'), 'error');
    }
  };

  const startEdit = (review) => {
    setEditingReview(review.id);
    setEditForm({
      comment: review.comment,
      recommend: review.recommend,
    });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ comment: '', recommend: true });
  };

  const handleUpdate = async (id) => {
    if (editForm.comment.length < 10) {
      notify(t('review.commentMinimumLength'), 'error');
      return;
    }

    try {
      const response = await api.put(`/reviews/${id}`, editForm);
      setReviews(reviews.map(r => r.id === id ? response.data.review : r));
      setEditingReview(null);
      notify(t('review.updatedSuccessfully'), 'success');
    } catch (err) {
      notify(t('review.errorUpdating'), 'error');
    }
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
      <>
        <Header 
          user={user} 
          setUser={setUser} 
          onOpenSettings={onOpenSettings}
          onOpenSettingsAdmin={onOpenSettingsAdmin}
        />
        <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
          <p className="text-center text-gray-500">{t('review.loadingYourReviews')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header 
        user={user} 
        setUser={setUser} 
        onOpenSettings={onOpenSettings}
        onOpenSettingsAdmin={onOpenSettingsAdmin}
      />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('review.myReviews')}</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageSquare className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-500">{t('review.noReviewsYet')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Property Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {review.property?.title || review.property?.name || t('property.property')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()} {t('common.at')} {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating_overall)}
                  <span className="font-semibold text-gray-700">{review.rating_overall}</span>
                </div>
              </div>

              {/* View Property Button */}
              {review.property && (
                <div className="mb-4">
                  <button
                    onClick={() => navigate(`/property/${review.property.id}`)}
                    className="text-sm px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
                  >
                    {t('property.viewProperty')}
                  </button>
                </div>
              )}

              {/* Edit Mode */}
              {editingReview === review.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    minLength={10}
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`recommend-${review.id}`}
                      checked={editForm.recommend}
                      onChange={(e) => setEditForm({ ...editForm, recommend: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`recommend-${review.id}`} className="text-sm font-medium text-gray-700">
                      {t('review.recommendThisProperty')}
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(review.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                    >
                      {t('common.save')}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* View Mode */}
                  <p className="text-gray-700 mb-3">{review.comment}</p>

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
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => startEdit(review)}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <Edit size={16} />
                        {t('common.edit')}
                      </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                        <Trash2 size={16} />
                        {t('common.delete')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
