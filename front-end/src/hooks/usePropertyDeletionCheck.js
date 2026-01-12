import { useEffect, useRef } from 'react';
import api from '../api/axios';
import { pushUserNotification } from '../utils/userNotifications';
import notify from '../utils/notify';

/**
 * Hook para verificar se propriedades foram deletadas e notificar utilizadores
 * Verifica reservas ativas e se a propriedade ainda existe
 */
export const usePropertyDeletionCheck = (user) => {
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!user || !user.id || hasChecked.current) return;

    const checkDeletedProperties = async () => {
      try {
        hasChecked.current = true;

        const response = await api.get('/reservations');
        let reservations = [];

        if (response.data?.data) {
          const dataContent = response.data.data;
          if (Array.isArray(dataContent)) {
            reservations = dataContent;
          } else if (dataContent?.data && Array.isArray(dataContent.data)) {
            reservations = dataContent.data;
          }
        }

        const activeReservations = reservations.filter(r => {
          const status = r.status_name || r.status || '';
          return ['Pendente', 'Pending', 'Confirmada', 'Confirmed'].includes(status);
        });

        for (const reservation of activeReservations) {
          try {
            await api.get(`/properties/${reservation.property_id}`);
          } catch (error) {
            if (error.response?.status === 404) {
              const message = reservation.status_name === 'Confirmada' || reservation.status_name === 'Confirmed'
                ? `A propriedade "${reservation.property?.title || 'Propriedade'}" foi removida. A sua reserva foi cancelada e o valor de €${reservation.total_amount} foi devolvido.`
                : `A propriedade "${reservation.property?.title || 'Propriedade'}" foi removida antes da confirmação. O valor de €${reservation.total_amount} foi devolvido.`;

              notify(message, 'warning');

              pushUserNotification({
                userId: user.id,
                title: '💰 Dinheiro Devolvido',
                message: message,
                type: 'refund',
                reservationId: reservation.id,
                meta: {
                  amount: reservation.total_amount,
                  propertyTitle: reservation.property?.title || 'Propriedade removida'
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking deleted properties:', error);
      }
    };

    const timer = setTimeout(checkDeletedProperties, 2000);

    return () => clearTimeout(timer);
  }, [user]);
};
