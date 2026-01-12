import React from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Scale, FileText, Info } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function TermsPage({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className="max-w-4xl mx-auto px-5 sm:px-10 pt-44 pb-20">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('terms.title')}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <p className="text-sm">{t('terms.lastUpdated')}: 7 {t('terms.january')} 2026</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div>
              <p className="text-gray-800 leading-relaxed">
                {t('terms.introText')}
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          
          {/* Section 1: Acceptance */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                1. {t('terms.section1.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section1.p1')}</p>
              <p>{t('terms.section1.p2')}</p>
            </div>
          </section>

          {/* Section 2: Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. {t('terms.section2.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section2.p1')}</p>
              <p>{t('terms.section2.p2')}</p>
              <p>{t('terms.section2.p3')}</p>
            </div>
          </section>

          {/* Section 3: User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. {t('terms.section3.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section3.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section3.item1')}</li>
                <li>{t('terms.section3.item2')}</li>
                <li>{t('terms.section3.item3')}</li>
                <li>{t('terms.section3.item4')}</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Bookings and Payments */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. {t('terms.section4.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section4.p1')}</p>
              <p>{t('terms.section4.p2')}</p>
              <p className="font-semibold text-gray-900">{t('terms.section4.paymentTerms')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section4.item1')}</li>
                <li>{t('terms.section4.item2')}</li>
                <li>{t('terms.section4.item3')}</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Cancellations and Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. {t('terms.section5.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section5.p1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-3">{t('terms.section5.policies')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('terms.section5.flexible')}</li>
                  <li>{t('terms.section5.moderate')}</li>
                  <li>{t('terms.section5.strict')}</li>
                </ul>
              </div>
              <p>{t('terms.section5.p2')}</p>
            </div>
          </section>

          {/* Section 6: Host Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. {t('terms.section6.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section6.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section6.item1')}</li>
                <li>{t('terms.section6.item2')}</li>
                <li>{t('terms.section6.item3')}</li>
                <li>{t('terms.section6.item4')}</li>
                <li>{t('terms.section6.item5')}</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Guest Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. {t('terms.section7.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section7.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section7.item1')}</li>
                <li>{t('terms.section7.item2')}</li>
                <li>{t('terms.section7.item3')}</li>
                <li>{t('terms.section7.item4')}</li>
              </ul>
            </div>
          </section>

          {/* Section 8: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. {t('terms.section8.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section8.p1')}</p>
              <p>{t('terms.section8.p2')}</p>
            </div>
          </section>

          {/* Section 9: Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. {t('terms.section9.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section9.p1')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section9.item1')}</li>
                <li>{t('terms.section9.item2')}</li>
                <li>{t('terms.section9.item3')}</li>
                <li>{t('terms.section9.item4')}</li>
                <li>{t('terms.section9.item5')}</li>
                <li>{t('terms.section9.item6')}</li>
              </ul>
            </div>
          </section>

          {/* Section 10: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. {t('terms.section10.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section10.p1')}</p>
              <p>{t('terms.section10.p2')}</p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="font-semibold text-gray-900">{t('terms.section10.important')}</p>
              </div>
            </div>
          </section>

          {/* Section 11: Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. {t('terms.section11.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section11.p1')}</p>
              <p>{t('terms.section11.p2')}</p>
            </div>
          </section>

          {/* Section 12: Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. {t('terms.section12.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section12.p1')}</p>
              <p>{t('terms.section12.p2')}</p>
            </div>
          </section>

          {/* Section 13: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. {t('terms.section13.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('terms.section13.p1')}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">Discover, Inc.</p>
                <p>Email: legal@discover.com</p>
                <p>Morada: Avenida da República, 123, 4000-123 Porto, Portugal</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            {t('terms.footerNote')}
          </p>
        </div>

      </main>
    </div>
  );
}

export default TermsPage;
