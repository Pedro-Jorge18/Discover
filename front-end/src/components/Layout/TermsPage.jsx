import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Scale, FileText, Info, ArrowUp, List } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { Link } from 'react-router-dom';

function TermsPage({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showToc, setShowToc] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'acceptance', title: t('terms.section1.title') },
    { id: 'services', title: t('terms.section2.title') },
    { id: 'accounts', title: t('terms.section3.title') },
    { id: 'payments', title: t('terms.section4.title') },
    { id: 'cancellations', title: t('terms.section5.title') },
    { id: 'host', title: t('terms.section6.title') },
    { id: 'guest', title: t('terms.section7.title') },
  ];

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <main className="max-w-7xl mx-auto px-5 sm:px-10 pt-44 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-32 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <button
                onClick={() => setShowToc(!showToc)}
                className="flex items-center gap-2 font-bold text-gray-900 mb-4 lg:cursor-default"
              >
                <List className="w-5 h-5 text-blue-600" />
                {t('common.tableOfContents') || 'Table of Contents'}
              </button>
              <nav className={`space-y-2 ${showToc ? 'block' : 'hidden lg:block'}`}>
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {idx + 1}. {section.title}
                  </button>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/privacy" className="text-sm text-blue-600 hover:underline block mb-2">
                  📄 {t('footer.privacy') || 'Privacy Policy'}
                </Link>
                <Link to="/help" className="text-sm text-blue-600 hover:underline block">
                  ❓ {t('footer.helpCenter') || 'Help Center'}
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
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
          <section id="acceptance" className="scroll-mt-32">
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
          <section id="services" className="scroll-mt-32">
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
          <section id="accounts" className="scroll-mt-32">
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
          <section id="payments" className="scroll-mt-32">
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
          <section id="cancellations" className="scroll-mt-32">
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
          <section id="host" className="scroll-mt-32">
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
          <section id="guest" className="scroll-mt-32">
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermsPage;
