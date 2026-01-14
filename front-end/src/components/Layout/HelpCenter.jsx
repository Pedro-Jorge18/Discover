import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Search, ChevronDown, HelpCircle, Home, Users, CreditCard, Shield, AlertCircle, ArrowUp, List } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function HelpCenter({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'bookings', label: language === 'pt' ? 'Reservas' : 'Bookings', icon: Home },
    { id: 'hosts', label: language === 'pt' ? 'Anfitriões' : 'Hosts', icon: Users },
    { id: 'payments', label: language === 'pt' ? 'Pagamentos' : 'Payments', icon: CreditCard },
    { id: 'security', label: language === 'pt' ? 'Segurança' : 'Security', icon: Shield },
    { id: 'cancellation', label: language === 'pt' ? 'Cancelamentos' : 'Cancellations', icon: AlertCircle },
  ];

  const faqsData = {
    pt: {
      bookings: [
        { question: 'Como faço uma reserva na Discover?', answer: 'Para fazer uma reserva: 1) Procure uma propriedade utilizando a barra de pesquisa ou navegue a página inicial; 2) Clique na propriedade para ver detalhes completos, fotos e reviews; 3) Selecione as datas de check-in e check-out; 4) Clique em "Reservar" e complete o pagamento; 5) Receberá confirmação por email. Pode acompanhar a reserva em "Minhas Reservas".' },
        { question: 'Preciso de conta para reservar?', answer: 'Sim, precisa de uma conta Discover para fazer reservas. Pode criar uma conta usando email e password, ou fazer login com Google. A criação de conta é rápida e segura, e oferecemos autenticação multifator para maior segurança.' },
        { question: 'Posso contactar o anfitrião antes de reservar?', answer: 'Sim! Na página de detalhes da propriedade, pode ver informações do anfitrião e enviar uma mensagem antes de reservar. O anfitrião pode responder com dúvidas sobre a propriedade, regras da casa ou serviços adicionais. Isto ajuda a garantir que a propriedade é adequada às suas necessidades.' },
        { question: 'O que acontece após confirmar a reserva?', answer: 'Após confirmar a reserva: 1) Receberá email de confirmação com detalhes completos; 2) O anfitrião será notificado; 3) Pode acompanhar a reserva em "Minhas Reservas"; 4) Receberá notificações sobre o check-in; 5) Após a estadia, pode deixar uma avaliação do alojamento e do anfitrião.' },
        { question: 'Posso modificar as datas da minha reserva?', answer: 'Pode tentar negociar alterações contactando o anfitrião directamente através da mensagem na plataforma. A modificação dependerá da disponibilidade e da política de cancelamento da propriedade. Se não conseguir acordo com o anfitrião, pode cancelar e fazer nova reserva (sujeito a política de reembolso).' },
        { question: 'Como vejo minhas reservas?', answer: 'Clique no ícone de utilizador no canto superior direito e selecione "Minhas Reservas". Verá todas as suas reservas futuras e passadas, com informações completas, contacto do anfitrião, e opção para deixar avaliações de estadias passadas.' },
        { question: 'Posso fazer reserva como hóspede se tenho múltiplas contas?', answer: 'Cada email tem uma conta separada. Se tem múltiplas emails, pode utilizar diferentes contas, mas recomendamos usar apenas uma conta para melhor acompanhamento de histórico e confiabilidade na plataforma.' },
        { question: 'O preço mostrado é final?', answer: 'O preço mostrado inclui: valor do alojamento, taxa de serviço Discover (15%), impostos locais e quaisquer serviços adicionais. No passo final, antes de confirmar, vê a tabulação completa de custos. Não há custos escondidos.' },
      ],
      hosts: [
        { question: 'Como listo a minha propriedade?', answer: 'Para listar uma propriedade: 1) Faça login e aceda ao "Painel do Anfitrião"; 2) Clique "Nova Propriedade"; 3) Adicione detalhes (localização, descrição, número de quartos/casas de banho); 4) Carregue no mínimo 4 fotos de alta qualidade; 5) Defina preço por noite e política de cancelamento; 6) Publique. A propriedade aparecerá nos resultados de busca.' },
        { question: 'Qual o número mínimo de fotos necessárias?', answer: 'Precisa de no mínimo 4 fotos de alta qualidade. Recomendamos no mínimo 8-12 fotos para melhor apresentação. As fotos devem mostrar: sala de estar/quarto principal, quartos, casas de banho, cozinha e vistas gerais. Fotos de boa qualidade resultam em mais reservas.' },
        { question: 'Como defino a política de cancelamento?', answer: 'No formulário de criação de propriedade, escolha entre: 1) Flexível (reembolso total até 24h antes do check-in); 2) Moderada (reembolso total até 5 dias antes); 3) Rigorosa (50% de reembolso até 7 dias antes). Políticas flexíveis tendem a ter mais reservas, mas escolha conforme sua confiança.' },
        { question: 'Quando recebo o pagamento das reservas?', answer: 'Recebe o pagamento em sua conta bancária registada dentro de 24-48 horas após o check-in bem-sucedido do hóspede. A Discover processa o pagamento via transferência bancária segura. Pode acompanhar os pagamentos no Painel do Anfitrião.' },
        { question: 'Qual a comissão da Discover?', answer: 'A Discover cobra uma taxa de serviço de 15% sobre o valor total da reserva (sem incluir impostos). Esta taxa cobre: processamento de pagamentos, suporte ao anfitrião e hóspede, segurança da plataforma, e resolução de disputas.' },
        { question: 'Como actualizo os detalhes da minha propriedade?', answer: 'Aceda ao Painel do Anfitrião, selecione a propriedade e clique "Editar". Pode modificar: descrição, fotos, preço, política de cancelamento, regras da casa. Mudanças no preço afectam futuras reservas mas não as já confirmadas.' },
        { question: 'O que devo fazer se um hóspede cancelar?', answer: 'Se um hóspede cancela, o reembolso é automático conforme a política: Flexível (100%), Moderada (100%), Rigorosa (50%). Você recebe notificação. As datas ficam novamente disponíveis para novas reservas no mesmo dia. Se o hóspede não aparece, contacte o suporte Discover.' },
        { question: 'Posso bloquear datas da minha propriedade?', answer: 'Sim. No Painel do Anfitrião, na secção de calendário, pode bloquear datas quando a propriedade não está disponível (manutenção, uso pessoal, etc.). Datas bloqueadas não aparecem para novos hóspedes.' },
        { question: 'Como aumento minhas reservas?', answer: 'Melhor classificação = mais reservas. Recomendações: 1) Fotos de qualidade profissional; 2) Descrição detalhada e honesta; 3) Preço competitivo; 4) Responda rápido a mensagens; 5) Mantenha a propriedade limpa; 6) Deixe comentários positivos. Propriedades com 4.5+ estrelas recebem mais visitas.' },
      ],
      payments: [
        { question: 'Que métodos de pagamento aceitam?', answer: 'Aceitamos: Cartão de Crédito (Visa, Mastercard), Cartão de Débito (Visa, Mastercard), e Google Pay. Todos os pagamentos são processados por gateway certificado PCI-DSS com encriptação 256-bit SSL/TLS para máxima segurança.' },
        { question: 'Os dados do meu cartão são seguros?', answer: 'Sim, completamente seguros. Não armazenamos dados completos do cartão. Após processamento, guardamos apenas os últimos 4 dígitos. Todos os pagamentos passam por verificação de fraude automática. Utilizamos encriptação de banco para proteger informações sensíveis.' },
        { question: 'Quando é cobrado o pagamento?', answer: 'O pagamento é cobrado imediatamente após clicar "Confirmar Reserva". Receberá confirmação por email com todos os detalhes da transação. O recibo está disponível na sua conta Discover, secção "Minhas Reservas".' },
        { question: 'Posso pagar em múltiplas parcelas?', answer: 'Actualmente, o pagamento da reserva é integral no momento da confirmação. Não oferecemos parcelamento. Para estadias prolongadas (30+ dias), pode contactar directamente o anfitrião para negociar termos de pagamento alternativos.' },
        { question: 'Como solicito reembolso?', answer: 'Se cancela a reserva, o reembolso é automático conforme a política de cancelamento da propriedade. Será processado na sua conta bancária original em 5-10 dias úteis. Pode acompanhar o estado do reembolso em "Minhas Reservas".' },
        { question: 'E se há erro na cobrança?', answer: 'Se nota cobranças duplicadas ou erros, contacte nosso suporte imediatamente em support@discover.com. Forneceremos prova de transação. Investigaremos e, se comprovado erro, faremos reembolso integral. Também pode contestar via seu banco.' },
        { question: 'Vejo cobranças da Discover. O que é?', answer: 'As cobranças mostram como "DISCOVER INC" ou "DISCOVER.COM". Podem ser: 1) Reserva de alojamento, 2) Taxa de serviço (15%), ou 3) Impostos locais. Detalhes completos constam em "Minhas Reservas" → "Detalhes de Pagamento".' },
      ],
      security: [
        { question: 'Como crio uma password segura?', answer: 'Use uma password com: no mínimo 8 caracteres, mistura de letras maiúsculas/minúsculas, números e símbolos (!@#$%^&*). Evite datas de nascimento, nomes ou palavras comuns. Recomendamos ativar autenticação multifator (MFA) em Configurações para protecção extra.' },
        { question: 'O que é autenticação multifator?', answer: 'É uma camada extra de segurança. Além de password, introduz um código de 6 dígitos enviado por SMS ao seu telefone. Mesmo se alguém souber sua password, não consegue aceder sem o código. Ative em Configurações → Segurança.' },
        { question: 'A minha conta foi hackeada. O que faço?', answer: 'Imediatamente: 1) Clique "Esqueci a password" e defina nova password forte; 2) Mude a password em Configurações; 3) Active autenticação multifator; 4) Revise histórico de login em Configurações; 5) Contacte support@discover.com com detalhes. Investigaremos atividade suspeita.' },
        { question: 'Posso confiar em hosts/hóspedes que vejo na plataforma?', answer: 'Todos os utilizadores Discover passam por verificação: email verificado, telemóvel opcional, ID verificado (para anfitriões). Reviews com 100+ avaliações e classificação 4.0+ são muito confiáveis. Leia reviews antes de decidir. Pode reportar comportamento suspeito.' },
        { question: 'Como denuncio um utilizador suspeito?', answer: 'Clique nos três pontos (...) no perfil do utilizador e selecione "Reportar utilizador". Descreva a razão. Nossa equipa investigará. Se comprovado abuso, a conta será suspensa ou eliminada. Todos os reports são confidenciais.' },
        { question: 'Que informações pessoais vê o anfitrião/hóspede?', answer: 'O hóspede vê: nome, foto, email de contacto se deixar review. O anfitrião vê: nome, foto, email de contacto, e notas especiais se indicou. Número de telefone, morada completa, ID nunca são partilhados na plataforma.' },
        { question: 'Dados de cartão são vistos por host/guest?', answer: 'Não, nunca. Os dados do cartão são processados por gateway de pagamento externo certificado, não por Discover. Nem hosts nem hóspedes veem qualquer detalhe do cartão. O anfitrião apenas vê que recebeu pagamento com sucesso.' },
      ],
      cancellation: [
        { question: 'Qual a diferença entre as 3 políticas de cancelamento?', answer: 'FLEXÍVEL: Reembolso 100% até 24h antes do check-in; depois sem reembolso. MODERADA: Reembolso 100% até 5 dias antes do check-in; depois sem reembolso. RIGOROSA: Reembolso de 50% até 7 dias antes; depois sem reembolso. A política é definida pelo anfitrião.' },
        { question: 'Como cancelo a minha reserva?', answer: 'Vá a "Minhas Reservas", clique na reserva e selecione "Cancelar Reserva". Receberá aviso sobre o reembolso conforme a política. Se confirma, o cancelamento é imediato. O reembolso é processado em 5-10 dias úteis para conta bancária original.' },
        { question: 'Posso cancelar no dia da chegada?', answer: 'Sim, pode cancelar a qualquer momento. Mas se cancelar no dia de check-in ou depois, não receberá reembolso (independentemente da política). Recomendamos cancelar com antecedência se mudou de planos.' },
        { question: 'E se o anfitrião cancela?', answer: 'Se o anfitrião cancela, você recebe reembolso INTEGRAL mais possível compensação de 50% do valor para encontrar alternativa. A Discover ajuda a encontrar propriedade similar ou superior. Contactamos automaticamente.' },
        { question: 'Posso cancelar sem razão?', answer: 'Sim, pode cancelar qualquer reserva sem indicar razão. Mas receberá apenas o reembolso conforme a política de cancelamento (0-100% dependendo de quanto falta para o check-in). Sem exceções por "mudança de ideias".' },
        { question: 'E se tenho emergência/doença?', answer: 'Se ocorre emergência genuína (doença grave, morte na família, etc.), contacte support@discover.com com comprovação (atestado médico, certidão, etc.). Analisaremos caso a caso e pode qualificar para reembolso além da política padrão.' },
        { question: 'Quando recebo o reembolso?', answer: 'Reembolsos são processados em 5-10 dias úteis para a conta bancária original usada para pagar. Depende do banco - alguns mostram em 3 dias, outros em até 10. Acompanhe em "Minhas Reservas" → "Histórico de Reembolsos".' },
      ],
    },
    en: {
      bookings: [
        { question: 'How do I make a booking on Discover?', answer: 'To make a booking: 1) Search for a property using the search bar or browse the homepage; 2) Click on the property to see full details, photos and reviews; 3) Select your check-in and check-out dates; 4) Click "Book Now" and complete payment; 5) You\'ll receive confirmation via email. Track your booking in "My Reservations".' },
        { question: 'Do I need an account to book?', answer: 'Yes, you need a Discover account to make bookings. You can create an account using email and password, or log in with Google. Account creation is quick and secure, and we offer multi-factor authentication for extra security.' },
        { question: 'Can I contact the host before booking?', answer: 'Yes! On the property details page, you can see host information and send a message before booking. The host can answer questions about the property, house rules, or additional services. This helps ensure the property meets your needs.' },
        { question: 'What happens after I confirm a booking?', answer: 'After confirming your booking: 1) You\'ll receive a confirmation email with full details; 2) The host will be notified; 3) You can track your booking in "My Reservations"; 4) You\'ll receive notifications about check-in; 5) After your stay, you can leave a review of the accommodation and host.' },
        { question: 'Can I modify my booking dates?', answer: 'You can try to negotiate changes by contacting the host directly through the messaging platform. The modification depends on availability and the property\'s cancellation policy. If you can\'t reach an agreement, you can cancel and make a new booking (subject to refund policy).' },
        { question: 'How do I view my bookings?', answer: 'Click the user icon in the top right corner and select "My Reservations". You\'ll see all your future and past bookings with complete information, host contact, and the option to leave reviews of past stays.' },
        { question: 'Can I book if I have multiple accounts?', answer: 'Each email has a separate account. If you have multiple emails, you can use different accounts, but we recommend using only one account for better booking history tracking and platform reliability.' },
        { question: 'Is the displayed price final?', answer: 'The displayed price includes: accommodation value, Discover service fee (15%), local taxes, and any additional services. In the final step, before confirming, you\'ll see a complete cost breakdown. There are no hidden fees.' },
      ],
      hosts: [
        { question: 'How do I list my property?', answer: 'To list a property: 1) Log in and access the "Host Dashboard"; 2) Click "New Property"; 3) Add details (location, description, number of bedrooms/bathrooms); 4) Upload at least 4 high-quality photos; 5) Set price per night and cancellation policy; 6) Publish. Your property will appear in search results.' },
        { question: 'What\'s the minimum number of photos needed?', answer: 'You need at least 4 high-quality photos. We recommend 8-12 photos for better presentation. Photos should show: living room/master bedroom, bedrooms, bathrooms, kitchen and general views. Quality photos result in more bookings.' },
        { question: 'How do I set my cancellation policy?', answer: 'On the property creation form, choose between: 1) Flexible (100% refund up to 24h before check-in); 2) Moderate (100% refund up to 5 days before); 3) Strict (50% refund up to 7 days before). Flexible policies tend to get more bookings, but choose based on your comfort level.' },
        { question: 'When do I receive payment for bookings?', answer: 'You receive payment in your registered bank account within 24-48 hours after successful guest check-in. Discover processes payment via secure bank transfer. You can track payments in your Host Dashboard.' },
        { question: 'What\'s Discover\'s commission?', answer: 'Discover charges a 15% service fee on the total booking value (excluding taxes). This fee covers: payment processing, host and guest support, platform security, and dispute resolution.' },
        { question: 'How do I update my property details?', answer: 'Go to your Host Dashboard, select the property and click "Edit". You can modify: description, photos, price, cancellation policy, house rules. Price changes affect future bookings but not confirmed ones.' },
        { question: 'What should I do if a guest cancels?', answer: 'If a guest cancels, the refund is automatic per the policy: Flexible (100%), Moderate (100%), Strict (50%). You\'ll receive notification. Dates become available for new bookings immediately. If a guest doesn\'t show, contact Discover support.' },
        { question: 'Can I block dates on my property?', answer: 'Yes. In your Host Dashboard, in the calendar section, you can block dates when your property is unavailable (maintenance, personal use, etc.). Blocked dates won\'t appear to new guests.' },
        { question: 'How do I get more bookings?', answer: 'Better rating = more bookings. Recommendations: 1) Professional quality photos; 2) Detailed and honest description; 3) Competitive pricing; 4) Respond quickly to messages; 5) Keep property clean; 6) Leave positive reviews. Properties with 4.5+ stars get more bookings.' },
      ],
      payments: [
        { question: 'What payment methods do you accept?', answer: 'We accept: Credit Card (Visa, Mastercard), Debit Card (Visa, Mastercard), and Google Pay. All payments are processed by a PCI-DSS certified gateway with 256-bit SSL/TLS encryption for maximum security.' },
        { question: 'Are my card details safe?', answer: 'Yes, completely safe. We don\'t store full card data. After processing, we only keep the last 4 digits. All payments pass through automatic fraud verification. We use bank-level encryption to protect sensitive information.' },
        { question: 'When is the payment charged?', answer: 'Payment is charged immediately after you click "Confirm Booking". You\'ll receive a confirmation email with full transaction details. Your receipt is available in your Discover account, "My Reservations" section.' },
        { question: 'Can I pay in installments?', answer: 'Currently, booking payment is full at confirmation. We don\'t offer installment plans. For extended stays (30+ days), you can contact the host directly to negotiate alternative payment terms.' },
        { question: 'How do I request a refund?', answer: 'If you cancel a booking, the refund is automatic per the property\'s cancellation policy. It will be processed to your original bank account within 5-10 business days. You can track refund status in "My Reservations".' },
        { question: 'What if there\'s a billing error?', answer: 'If you notice duplicate charges or errors, contact our support immediately at support@discover.com. We\'ll provide transaction proof. We\'ll investigate and, if an error is confirmed, issue a full refund. You can also dispute via your bank.' },
        { question: 'I see Discover charges. What are they?', answer: 'Charges appear as "DISCOVER INC" or "DISCOVER.COM". They can be: 1) Accommodation booking, 2) Service fee (15%), or 3) Local taxes. Full details are shown in "My Reservations" → "Payment Details".' },
      ],
      security: [
        { question: 'How do I create a secure password?', answer: 'Use a password with: minimum 8 characters, mix of uppercase/lowercase letters, numbers and symbols (!@#$%^&*). Avoid birthdays, names or common words. We recommend enabling multi-factor authentication (MFA) in Settings for extra protection.' },
        { question: 'What is multi-factor authentication?', answer: 'It\'s an extra layer of security. In addition to your password, you enter a 6-digit code sent via SMS to your phone. Even if someone knows your password, they can\'t access your account without the code. Enable it in Settings → Security.' },
        { question: 'My account was hacked. What do I do?', answer: 'Immediately: 1) Click "Forgot Password" and set a new strong password; 2) Change password in Settings; 3) Enable multi-factor authentication; 4) Review login history in Settings; 5) Contact support@discover.com with details. We\'ll investigate suspicious activity.' },
        { question: 'Can I trust hosts/guests on the platform?', answer: 'All Discover users go through verification: verified email, optional phone, verified ID (for hosts). Reviews with 100+ ratings and 4.0+ stars are very trustworthy. Read reviews before deciding. You can report suspicious behavior.' },
        { question: 'How do I report a suspicious user?', answer: 'Click the three dots (...) on their profile and select "Report User". Describe the reason. Our team will investigate. If abuse is confirmed, the account will be suspended or deleted. All reports are confidential.' },
        { question: 'What personal info do hosts/guests see?', answer: 'Guest sees: name, photo, email if you leave a review. Host sees: name, photo, email, and special notes if provided. Phone number, full address, ID are never shared on the platform.' },
        { question: 'Can hosts/guests see my card data?', answer: 'No, never. Card data is processed by an external certified payment gateway, not by Discover. Neither hosts nor guests see any card details. The host only sees that payment was received successfully.' },
      ],
      cancellation: [
        { question: 'What\'s the difference between the 3 cancellation policies?', answer: 'FLEXIBLE: 100% refund up to 24h before check-in; after that no refund. MODERATE: 100% refund up to 5 days before check-in; after that no refund. STRICT: 50% refund up to 7 days before; after that no refund. The policy is set by the host.' },
        { question: 'How do I cancel my booking?', answer: 'Go to "My Reservations", click on the booking and select "Cancel Booking". You\'ll see a warning about the refund per policy. If confirmed, cancellation is immediate. Refund is processed within 5-10 business days to your original bank account.' },
        { question: 'Can I cancel on check-in day?', answer: 'Yes, you can cancel anytime. But if you cancel on check-in day or after, you won\'t receive a refund (regardless of policy). We recommend canceling in advance if your plans change.' },
        { question: 'What if the host cancels?', answer: 'If the host cancels, you receive a FULL refund plus possible compensation of 50% of the value to find an alternative. Discover helps you find a similar or superior property. We\'ll contact you automatically.' },
        { question: 'Can I cancel without a reason?', answer: 'Yes, you can cancel any booking without stating a reason. But you\'ll only receive a refund per the cancellation policy (0-100% depending on how long until check-in). No exceptions for "change of mind".' },
        { question: 'What if I have an emergency or illness?', answer: 'If a genuine emergency occurs (serious illness, death in family, etc.), contact support@discover.com with proof (medical certificate, death certificate, etc.). We\'ll analyze case-by-case and you may qualify for a refund beyond the standard policy.' },
        { question: 'When do I receive my refund?', answer: 'Refunds are processed within 5-10 business days to the original bank account used for payment. It depends on your bank - some show it in 3 days, others up to 10. Track it in "My Reservations" → "Refund History".' },
      ],
    },
  };

  const faqs = faqsData[language === 'pt' ? 'pt' : 'en'];

  const filteredFaqs = selectedCategory === 'all' 
    ? Object.values(faqs).flat()
    : faqs[selectedCategory];

  const searchedFaqs = filteredFaqs.filter(
    faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-44 pb-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-10 h-10" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              {t('helpCenter.title')}
            </h1>
          </div>
          <p className="text-xl text-blue-100 mb-8">
            {t('helpCenter.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('helpCenter.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white bg-white"
            />
          </div>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-5 sm:px-10 py-16">
        <div className="flex gap-8">
          
          {/* Sidebar Navigation */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 shrink-0`}>
            <div className="sticky top-32 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <List className="w-5 h-5" />
                  {language === 'pt' ? 'Categorias' : 'Categories'}
                </h3>
              </div>
              
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = faqs[category.id]?.length || 0;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        scrollToCategory(category.id);
                        setExpandedFaq(null);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>{language === 'pt' ? 'Total FAQs' : 'Total FAQs'}</span>
                    <span className="font-semibold text-gray-900">
                      {Object.values(faqs).reduce((acc, arr) => acc + arr.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'pt' ? 'Categorias' : 'Categories'}</span>
                    <span className="font-semibold text-gray-900">{categories.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
        
        {/* Category Tabs - Mobile Only */}
        <div className="mb-8 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            <span className="flex items-center gap-2">
              <List className="w-5 h-5" />
              {language === 'pt' ? 'Ver Categorias' : 'View Categories'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* FAQs by Category */}
        {selectedCategory === 'all' ? (
          categories.map((category) => {
            const Icon = category.icon;
            const categoryFaqs = faqs[category.id] || [];
            const filteredCategoryFaqs = categoryFaqs.filter(
              faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredCategoryFaqs.length === 0 && searchQuery) return null;

            return (
              <div key={category.id} id={`category-${category.id}`} className="mb-12 scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
                    <p className="text-sm text-gray-600">
                      {filteredCategoryFaqs.length} {language === 'pt' ? 'perguntas' : 'questions'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {filteredCategoryFaqs.map((faq, index) => {
                    const globalIndex = `${category.id}-${index}`;
                    return (
                      <div
                        key={globalIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors bg-white"
                      >
                        <button
                          onClick={() => toggleFaq(globalIndex)}
                          className="w-full flex items-start justify-between p-5 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-base font-semibold text-gray-900 text-left pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
                              expandedFaq === globalIndex ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {expandedFaq === globalIndex && (
                          <div className="px-5 pb-5 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed pt-4">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div id={`category-${selectedCategory}`} className="scroll-mt-32">
            {(() => {
              const category = categories.find(c => c.id === selectedCategory);
              const Icon = category.icon;
              const categoryFaqs = searchedFaqs;

              return (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
                      <p className="text-sm text-gray-600">
                        {categoryFaqs.length} {language === 'pt' ? 'perguntas' : 'questions'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {categoryFaqs.length > 0 ? (
                      categoryFaqs.map((faq, index) => {
                        const globalIndex = `${selectedCategory}-${index}`;
                        return (
                          <div
                            key={globalIndex}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors bg-white"
                          >
                            <button
                              onClick={() => toggleFaq(globalIndex)}
                              className="w-full flex items-start justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-base font-semibold text-gray-900 text-left pr-4">
                                {faq.question}
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
                                  expandedFaq === globalIndex ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            {expandedFaq === globalIndex && (
                              <div className="px-5 pb-5 bg-gray-50 border-t border-gray-200">
                                <p className="text-gray-700 leading-relaxed pt-4">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                          {t('helpCenter.noResults')}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Additional Help */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('helpCenter.additionalHelp.title')}
          </h3>
          <p className="text-gray-700 mb-6">
            {t('helpCenter.additionalHelp.description')}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/termos" className="px-6 py-2 bg-white border border-blue-300 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              {t('helpCenter.additionalHelp.terms')}
            </a>
            <a href="/privacidade" className="px-6 py-2 bg-white border border-blue-300 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              {t('helpCenter.additionalHelp.privacy')}
            </a>
            <a href="/empresa" className="px-6 py-2 bg-white border border-blue-300 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              {t('helpCenter.additionalHelp.company')}
            </a>
          </div>
        </div>

          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}

      </main>
    </div>
  );
}

export default HelpCenter;
