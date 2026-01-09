import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import notify from '../../utils/notify';
import { pushHostNotification } from '../../utils/hostNotifications';
import { useTranslation } from '../../contexts/TranslationContext';

export default function ReviewForm({ reservation, property, onSuccess, onCancel, user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({
    rating_cleanliness: 0,
    rating_communication: 0,
    rating_checkin: 0,
    rating_accuracy: 0,
    rating_location: 0,
    rating_value: 0,
  });
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState({});

  const categories = [
    { key: 'rating_cleanliness', label: t('review.cleanness') },
    { key: 'rating_communication', label: t('review.communication') },
    { key: 'rating_checkin', label: t('review.checkIn') },
    { key: 'rating_accuracy', label: t('review.accuracy') },
    { key: 'rating_location', label: t('review.location') },
    { key: 'rating_value', label: t('review.valueForMoney') },
  ];

  const handleRatingClick = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se o utilizador está autenticado
    if (!user || !user.id) {
      notify(t('review.loginToReview'), 'warning');
      navigate('/login');
      return;
    }

    // Validate all ratings
    const allRated = Object.values(ratings).every(r => r > 0);
    if (!allRated) {
      notify(t('review.pleaseRateAllCategories'), 'error');
      return;
    }

    if (comment.length < 10) {
      notify(t('review.minCommentLength'), 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        property_id: property.id,
        ...ratings,
        comment,
        recommend,
      };

      // Only add reservation_id if it exists
      if (reservation?.id) {
        payload.reservation_id = reservation.id;
      }

      const response = await api.post('/reviews', payload);

      notify(t('review.reviewSubmittedSuccessfully'), 'success');

      const hostId = property?.host?.id || property?.user?.id;
      if (hostId) {
        pushHostNotification({
          hostId,
          type: 'review',
          title: t('hostNotifications.reviewTitle'),
          message: `${t('hostNotifications.reviewBody')} ${property?.title || ''}`,
          propertyId: property?.id,
        });
      }

      if (onSuccess) onSuccess(response.data.review);
    } catch (err) {
      console.error('Erro ao enviar review:', err?.response?.data);
      const msg = err?.response?.data?.message || 'Erro ao enviar avaliação';
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (category, currentRating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(category, star)}
            onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [category]: star }))}
            onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [category]: 0 }))}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`transition-colors ${
                star <= (hoveredRating[category] || currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">{t('review.rateYourStay')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Categories */}
        <div className="space-y-4">
          {categories.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              {renderStars(key, ratings[key])}
            </div>
          ))}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('review.commentRequired')}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder={t('review.tellUsAbout')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 {t('review.minCharacters')}
          </p>
        </div>

        {/* Recommend */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="recommend"
            checked={recommend}
            onChange={(e) => setRecommend(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="recommend" className="text-sm font-medium text-gray-700">
            {t('review.recommend')}
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? t('review.submitting') : t('review.sendReview')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
