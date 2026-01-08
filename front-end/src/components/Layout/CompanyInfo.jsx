import React from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Building2, MapPin, Mail, Phone, Clock, Users } from 'lucide-react';
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

        {/* Company Overview Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t('companyInfo.about')}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('companyInfo.description')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('companyInfo.mission')}
          </p>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
                  <p className="text-sm text-gray-500">{t('companyInfo.email')}</p>
                  <a href="mailto:info@discover.com" className="text-blue-600 hover:underline">
                    info@discover.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">{t('companyInfo.phone')}</p>
                  <a href="tel:+351123456789" className="text-blue-600 hover:underline">
                    +351 123 456 789
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
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('companyInfo.weekdays')}</span>
                <span className="text-gray-900 font-semibold">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('companyInfo.weekend')}</span>
                <span className="text-gray-900 font-semibold">{t('companyInfo.closed')}</span>
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              {t('companyInfo.legalTitle')}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">{t('companyInfo.companyName')}:</span> Discover, Inc.</p>
              <p><span className="font-semibold">{t('companyInfo.vat')}:</span> PT123456789</p>
              <p><span className="font-semibold">{t('companyInfo.registration')}:</span> 987654321</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('companyInfo.needHelp')}</h3>
          <p className="text-gray-700 mb-6">
            {t('companyInfo.supportText')}
          </p>
          <a 
            href="mailto:support@descobrir.com" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase italic tracking-tighter shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
          >
            {t('companyInfo.contactSupport')}
          </a>
        </div>
      </main>
    </div>
  );
}

export default CompanyInfo;
