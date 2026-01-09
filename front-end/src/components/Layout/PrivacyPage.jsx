import React from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Shield, FileText, Info, Lock, Eye, Users, Globe, Mail, Scale } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function PrivacyPage({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className="max-w-4xl mx-auto px-5 sm:px-10 pt-44 pb-20">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('privacy.title')}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <p className="text-sm">{t('privacy.lastUpdated')}: 7 {t('privacy.january')} 2026</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-800 leading-relaxed mb-3">
                {t('privacy.introText')}
              </p>
              <p className="text-gray-800 leading-relaxed">
                {t('privacy.introText2')}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-12">
          
          {/* Section 1: Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                1. {t('privacy.section1.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section1.p1')}</p>
              
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">{t('privacy.section1.subtitle1')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('privacy.section1.item1')}</li>
                  <li>{t('privacy.section1.item2')}</li>
                  <li>{t('privacy.section1.item3')}</li>
                  <li>{t('privacy.section1.item4')}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-gray-900">{t('privacy.section1.subtitle2')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('privacy.section1.item5')}</li>
                  <li>{t('privacy.section1.item6')}</li>
                  <li>{t('privacy.section1.item7')}</li>
                  <li>{t('privacy.section1.item8')}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-gray-900">{t('privacy.section1.subtitle3')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('privacy.section1.item9')}</li>
                  <li>{t('privacy.section1.item10')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                2. {t('privacy.section2.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section2.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.section2.item1')}</li>
                <li>{t('privacy.section2.item2')}</li>
                <li>{t('privacy.section2.item3')}</li>
                <li>{t('privacy.section2.item4')}</li>
                <li>{t('privacy.section2.item5')}</li>
                <li>{t('privacy.section2.item6')}</li>
                <li>{t('privacy.section2.item7')}</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Sharing Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                3. {t('privacy.section3.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section3.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.section3.item1')}</li>
                <li>{t('privacy.section3.item2')}</li>
                <li>{t('privacy.section3.item3')}</li>
                <li>{t('privacy.section3.item4')}</li>
                <li>{t('privacy.section3.item5')}</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                <p className="font-semibold text-gray-900">{t('privacy.section3.important')}</p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                4. {t('privacy.section4.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section4.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('privacy.section4.item1')}</li>
                <li>{t('privacy.section4.item2')}</li>
                <li>{t('privacy.section4.item3')}</li>
                <li>{t('privacy.section4.item4')}</li>
              </ul>
              <p>{t('privacy.section4.p2')}</p>
            </div>
          </section>

          {/* Section 5: Your Rights (GDPR) */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                5. {t('privacy.section5.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section5.p1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">{t('privacy.section5.right1Title')}:</span> {t('privacy.section5.right1')}</li>
                  <li><span className="font-semibold">{t('privacy.section5.right2Title')}:</span> {t('privacy.section5.right2')}</li>
                  <li><span className="font-semibold">{t('privacy.section5.right3Title')}:</span> {t('privacy.section5.right3')}</li>
                  <li><span className="font-semibold">{t('privacy.section5.right4Title')}:</span> {t('privacy.section5.right4')}</li>
                  <li><span className="font-semibold">{t('privacy.section5.right5Title')}:</span> {t('privacy.section5.right5')}</li>
                  <li><span className="font-semibold">{t('privacy.section5.right6Title')}:</span> {t('privacy.section5.right6')}</li>
                  <li><span className="font-semibold">{t('privacy.section5.right7Title')}:</span> {t('privacy.section5.right7')}</li>
                </ul>
              </div>
              <p>{t('privacy.section5.p2')}</p>
            </div>
          </section>

          {/* Section 6: Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. {t('privacy.section6.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section6.p1')}</p>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">{t('privacy.section6.subtitle1')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('privacy.section6.item1')}</li>
                  <li>{t('privacy.section6.item2')}</li>
                  <li>{t('privacy.section6.item3')}</li>
                  <li>{t('privacy.section6.item4')}</li>
                </ul>
              </div>
              <p>{t('privacy.section6.p2')}</p>
            </div>
          </section>

          {/* Section 7: Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. {t('privacy.section7.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section7.p1')}</p>
              <p>{t('privacy.section7.p2')}</p>
            </div>
          </section>

          {/* Section 8: International Transfers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                8. {t('privacy.section8.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section8.p1')}</p>
              <p>{t('privacy.section8.p2')}</p>
            </div>
          </section>

          {/* Section 9: Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. {t('privacy.section9.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section9.p1')}</p>
              <p>{t('privacy.section9.p2')}</p>
            </div>
          </section>

          {/* Section 10: Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. {t('privacy.section10.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section10.p1')}</p>
            </div>
          </section>

          {/* Section 11: Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. {t('privacy.section11.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section11.p1')}</p>
              <p>{t('privacy.section11.p2')}</p>
            </div>
          </section>

          {/* Section 12: Contact */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                12. {t('privacy.section12.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section12.p1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">Encarregado de Proteção de Dados</p>
                <p className="mb-1">Descobrir, Inc.</p>
                <p className="mb-1">Email: privacy@discover.com</p>
                <p className="mb-1">Email DPO: dpo@discover.com</p>
                <p>Morada: Avenida da República, 123, 4000-123 Porto, Portugal</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            {t('privacy.footerNote')}
          </p>
        </div>

      </main>
    </div>
  );
}

export default PrivacyPage;
