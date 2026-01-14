// EXAMPLE: How to send notifications to users (guests)
// when a reservation is accepted or rejected
//
// This example demonstrates how to use pushUserNotification() in any component
// where the host can accept or reject a reservation.

import { pushUserNotification } from '../../utils/userNotifications';

// Exemplo 1: Aceitar uma reserva
const handleAcceptReservation = (guestId, propertyTitle, reservationDates) => {
  pushUserNotification({
    userId: guestId,  // Guest ID
    type: 'reservation_accepted',  // Notification type
    title: t('userNotifications.acceptedTitle'),  // "Reserva aceite"
    message: `${t('userNotifications.acceptedBody')} em ${propertyTitle} (${reservationDates})`,
    reservationId: reservationId,  // ID da reserva (opcional)
    meta: {
      propertyTitle,
      reservationDates,
      // Adicione outros dados que quiser armazenar
    }
  });
};

// Exemplo 2: Rejeitar uma reserva
const handleRejectReservation = (guestId, propertyTitle, reason) => {
  pushUserNotification({
    userId: guestId,
    type: 'reservation_rejected',
    title: t('userNotifications.rejectedTitle'),  // "Reserva rejeitada"
    message: `${t('userNotifications.rejectedBody')} em ${propertyTitle}`,
    reservationId: reservationId,
    meta: {
      propertyTitle,
      reason,  // Save the reason if necessary
    }
  });
};

// Important notes:
// 1. The pushUserNotification() function doesn't require backend - works entirely on the client
// 2. Data is stored in localStorage with the key: user_notifications_{userId}
// 3. Maximum of 50 notifications per user are stored (old ones are removed)
// 4. Notifications also trigger a custom 'user-notification' event to update UI
// 5. The UserNotifications dropdown component shows up to 5 most recent notifications
// 6. The /reservas-notificacoes page shows all notifications with management options

// Available notification types:
// - 'reservation_accepted' - Green icon
// - 'reservation_rejected' - Red icon
// - 'info' - Default icon (grey)

// Example of integration in a reservation management component:
/*
  function ReservationManager({ reservation, user }) {
    const { t } = useTranslation();
    
    const handleApprove = async () => {
      // Send to API/backend if necessary
      await api.patch(`/reservations/${reservation.id}/approve`, { status: 'approved' });
      
      // Notify the guest
      pushUserNotification({
        userId: reservation.guest_id,
        type: 'reservation_accepted',
        title: t('userNotifications.acceptedTitle'),
        message: `${t('userNotifications.acceptedBody')} em ${reservation.property.title}`,
        reservationId: reservation.id,
        meta: {
          propertyTitle: reservation.property.title,
          checkInDate: reservation.check_in_date,
          checkOutDate: reservation.check_out_date,
        }
      });
      
      notify(t('common.success'), 'success');
    };
    
    const handleReject = async () => {
      // Send to API/backend if necessary
      await api.patch(`/reservations/${reservation.id}/reject`, { status: 'rejected' });
      
      // Notify the guest
      pushUserNotification({
        userId: reservation.guest_id,
        type: 'reservation_rejected',
        title: t('userNotifications.rejectedTitle'),
        message: `${t('userNotifications.rejectedBody')} em ${reservation.property.title}`,
        reservationId: reservation.id,
      });
      
      notify(t('common.success'), 'success');
    };
    
    return (
      <div>
        <button onClick={handleApprove}>Aceitar</button>
        <button onClick={handleReject}>Rejeitar</button>
      </div>
    );
  }
*/

export default {
  description: 'Este ficheiro contém exemplos de como usar pushUserNotification()'
};
