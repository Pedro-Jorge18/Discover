import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import { useTranslation } from '../../contexts/TranslationContext';

export default function ReviewsList({ propertyId, onStatsUpdate }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId]);

  const fetchReviews = async () => {
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
              <p className="text-sm text-gray-600">{stats.total_reviews} avaliações</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.recommend_percentage}% recomendam
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="text-sm">
              <span className="text-gray-600">Limpeza:</span>
              <span className="ml-2 font-semibold">{stats.avg_cleanliness}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Comunicação:</span>
              <span className="ml-2 font-semibold">{stats.avg_communication}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Check-in:</span>
              <span className="ml-2 font-semibold">{stats.avg_checkin}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Precisão:</span>
              <span className="ml-2 font-semibold">{stats.avg_accuracy}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Localização:</span>
              <span className="ml-2 font-semibold">{stats.avg_location}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Qualidade/Preço:</span>
              <span className="ml-2 font-semibold">{stats.avg_value}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
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
    </div>
  );
}
