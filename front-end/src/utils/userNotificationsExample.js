// EXEMPLO: Como enviar notificações para utilizadores (hóspedes)
// quando uma reserva é aceite ou rejeitada
//
// Este exemplo demonstra como usar pushUserNotification() em qualquer componente
// onde o host pode aceitar ou rejeitar uma reserva.

import { pushUserNotification } from '../../utils/userNotifications';

// Exemplo 1: Aceitar uma reserva
const handleAcceptReservation = (guestId, propertyTitle, reservationDates) => {
  pushUserNotification({
    userId: guestId,  // ID do hóspede
    type: 'reservation_accepted',  // Tipo de notificação
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
      reason,  // Guarde o motivo se necessário
    }
  });
};

// Notas importantes:
// 1. A função pushUserNotification() não requer backend - funciona inteiramente no cliente
// 2. Os dados são guardados em localStorage com a chave: user_notifications_{userId}
// 3. Máximo de 50 notificações por utilizador são guardadas (as antigas são removidas)
// 4. As notificações também disparam um evento custom 'user-notification' para atualizar UI
// 5. O componente UserNotifications dropdown mostra até 5 notificações mais recentes
// 6. A página /reservas-notificacoes mostra todas as notificações com opção de gerir

// Tipos de notificação disponíveis:
// - 'reservation_accepted' - Ícone verde
// - 'reservation_rejected' - Ícone vermelho
// - 'info' - Ícone padrão (cinzento)

// Exemplo de integração em um componente de gerenciar reservas:
/*
  function ReservationManager({ reservation, user }) {
    const { t } = useTranslation();
    
    const handleApprove = async () => {
      // Enviar para API/backend se necessário
      await api.patch(`/reservations/${reservation.id}/approve`, { status: 'approved' });
      
      // Notificar o hóspede
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
      // Enviar para API/backend se necessário
      await api.patch(`/reservations/${reservation.id}/reject`, { status: 'rejected' });
      
      // Notificar o hóspede
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
