import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import ReviewForm from './ReviewForm.jsx';

export default function ReviewPrompt({ reservation, onReviewSubmitted }) {
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkEligibility();
  }, [reservation?.id]);

  const checkEligibility = async () => {
    if (!reservation?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/reviews/can-review/${reservation.id}`);
      setCanReview(response.data.can_review);
    } catch (err) {
      // User can't review (already reviewed or not eligible)
      setCanReview(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (review) => {
    setShowForm(false);
    setCanReview(false);
    if (onReviewSubmitted) onReviewSubmitted(review);
  };

  if (loading) return null;
  if (!canReview) return null;

  if (showForm) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <ReviewForm
          reservation={reservation}
          property={reservation.property}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-green-900 mb-1">Estadia Concluída!</h4>
        <p className="text-sm text-green-700">
          Gostaria de avaliar sua experiência em {reservation.property?.name}?
        </p>
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition font-semibold"
      >
        <Star size={18} />
        Avaliar
      </button>
    </div>
  );
}
