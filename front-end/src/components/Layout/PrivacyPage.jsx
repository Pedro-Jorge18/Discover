import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx';
import Footer from './Footer.jsx';
import { Shield, FileText, Info, Lock, Eye, Users, Globe, Mail, Scale, ArrowUp, List } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { Link } from 'react-router-dom';

function PrivacyPage({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
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
    { id: 'collection', title: t('privacy.section1.title') },
    { id: 'usage', title: t('privacy.section2.title') },
    { id: 'sharing', title: t('privacy.section3.title') },
    { id: 'security', title: t('privacy.section4.title') },
    { id: 'rights', title: t('privacy.section5.title') },
    { id: 'cookies', title: t('privacy.section6.title') },
    { id: 'children', title: t('privacy.section7.title') },
    { id: 'retention', title: t('privacy.section8.title') },
    { id: 'international', title: t('privacy.section9.title') },
    { id: 'thirdparty', title: t('privacy.section10.title') },
    { id: 'changes', title: t('privacy.section11.title') },
    { id: 'contact', title: t('privacy.section12.title') },
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
                <Link to="/terms" className="text-sm text-blue-600 hover:underline block mb-2">
                  📄 {t('footer.terms') || 'Terms'}
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
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
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
          <section id="collection" className="scroll-mt-32">
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
          <section id="usage" className="scroll-mt-32">
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
          <section id="sharing" className="scroll-mt-32">
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
          <section id="security" className="scroll-mt-32">
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
          <section id="rights" className="scroll-mt-32">
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
          <section id="cookies" className="scroll-mt-32">
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
          <section id="retention" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. {t('privacy.section7.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section7.p1')}</p>
              <p>{t('privacy.section7.p2')}</p>
            </div>
          </section>

          {/* Section 8: International Transfers */}
          <section id="international" className="scroll-mt-32">
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
          <section id="children" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. {t('privacy.section9.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section9.p1')}</p>
              <p>{t('privacy.section9.p2')}</p>
            </div>
          </section>

          {/* Section 10: Third-Party Links */}
          <section id="thirdparty" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. {t('privacy.section10.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section10.p1')}</p>
            </div>
          </section>

          {/* Section 11: Changes to Privacy Policy */}
          <section id="changes" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. {t('privacy.section11.title')}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed pl-9">
              <p>{t('privacy.section11.p1')}</p>
              <p>{t('privacy.section11.p2')}</p>
            </div>
          </section>

          {/* Section 12: Contact */}
          <section id="contact" className="scroll-mt-32">
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
                <p className="mb-1">Discover, Inc.</p>
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrivacyPage;
