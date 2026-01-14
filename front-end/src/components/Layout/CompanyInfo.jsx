import React from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Building2, MapPin, Mail, Phone, Clock, Users, Award, Heart, Zap } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function CompanyInfo({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 pt-44 pb-20">
        {/* Page Title */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            {t('companyInfo.title')}
          </h1>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200">
            <div className="text-4xl font-black text-blue-600 mb-2">2K+</div>
            <p className="text-gray-700 font-semibold">Propriedades Listadas</p>
            <p className="text-sm text-gray-600 mt-1">Em crescimento</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border border-green-200">
            <div className="text-4xl font-black text-green-600 mb-2">5K+</div>
            <p className="text-gray-700 font-semibold">Hóspedes Ativos</p>
            <p className="text-sm text-gray-600 mt-1">Comunidade em crescimento</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center border border-purple-200">
            <div className="text-4xl font-black text-purple-600 mb-2">4.7★</div>
            <p className="text-gray-700 font-semibold">Classificação Média</p>
            <p className="text-sm text-gray-600 mt-1">De avaliações verificadas</p>
          </div>
        </div>

        {/* Company Overview Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t('companyInfo.about')}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            A Discover é a plataforma de hospedagem que conecta viajantes com anfitriões autênticos em Portugal e Europa. Fundada em 2025, somos um projeto recente com uma missão clara: transformar a forma como as pessoas viajam.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nossa missão é democratizar a viagem, permitindo que qualquer pessoa possa se hospedar em casas reais com pessoas reais, promovendo conexões significativas e criando memórias inesquecíveis.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Embora sejamos novos no mercado, já contamos com 5.000+ hóspedes ativos e 2.000+ propriedades listadas. Crescemos rapidamente porque acreditamos em qualidade, transparência e autenticidade.
          </p>
        </div>

        {/* Company Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold text-gray-900">Confiança</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cada anfitião e hóspede é verificado. Segurança e transparência são fundamentais para nós.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-900">Autenticidade</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Experiências genuínas com pessoas reais. Nada de hotéis corporativos, apenas conexões reais.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Excelência</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Padrões elevados em tudo. Desde o design da plataforma até o atendimento ao cliente.
              </p>
            </div>
          </div>
        </div>


        {/* Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              {t('companyInfo.contactTitle')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email Geral</p>
                  <a href="mailto:info@discover.com" className="text-blue-600 hover:underline">
                    info@discover.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Atendimento</p>
                  <a href="tel:+351123456789" className="text-blue-600 hover:underline">
                    +351 123 456 789
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Suporte</p>
                  <a href="mailto:support@discover.com" className="text-blue-600 hover:underline">
                    support@discover.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              {t('companyInfo.addressTitle')}
            </h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-gray-700 font-semibold mb-3">Sede Principal - Porto</p>
                <p className="text-gray-700">Avenida da República, 123</p>
                <p className="text-gray-700">4000-123 Porto</p>
                <p className="text-gray-700">Portugal</p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              {t('companyInfo.hoursTitle')}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Seg. - Sex.</span>
                <span className="text-gray-900 font-semibold">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Sábado</span>
                <span className="text-gray-900 font-semibold">10:00 - 16:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Domingo</span>
                <span className="text-gray-900 font-semibold">Fechado</span>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">Suporte por chat disponível 24/7</p>
            </div>
          </div>

          {/* Legal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              {t('companyInfo.legalTitle')}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nome da Empresa</p>
                <p className="text-gray-900 font-semibold">Discover, Inc.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NIF</p>
                <p className="text-gray-900 font-semibold">PT123456789</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número de Registo</p>
                <p className="text-gray-900 font-semibold">987654321</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Certificações</p>
                <p className="text-gray-900 font-semibold">ISO 27001 • GDPR Compliant</p>
              </div>
            </div>
          </div>
        </div>


        {/* Additional Information */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h3>
          <p className="mb-6 text-indigo-100">
            A nossa equipa de suporte está aqui para ajudar. Entre em contacto connosco através do email, telefone ou chat em tempo real.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a 
              href="mailto:support@discover.com" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Contactar Suporte
            </a>
            <a 
              href="/help" 
              className="inline-block bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-400 transition-colors shadow-lg border border-white"
            >
              Centro de Ajuda
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CompanyInfo;
