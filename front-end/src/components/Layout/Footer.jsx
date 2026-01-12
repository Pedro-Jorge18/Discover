import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Simple footer component displaying legal links and copyright information.
 */
function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const yearDisplay = currentYear > startYear ? `${startYear} - ${currentYear}` : startYear;
  
  // Array for footer links (Portuguese of Portugal)
  const links = [
    { name: t('footer.privacy'), href: "/privacidade" },
    { name: t('footer.terms'), href: "/termos" },
    { name: t('footer.companyInfo'), href: "/empresa" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-4">
      <div className="max-w-[1790px] mx-auto px-5 sm:px-10 text-sm text-gray-600">
        
        {/* Copyright Section */}
        <p className="mb-2">
          © {yearDisplay} {t('footer.brand')}
        </p>

        {/* Links Section */}
        <div className="flex flex-wrap items-center space-x-3 sm:space-x-4">
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <a 
                href={link.href} 
                className="hover:underline transition-colors"
              >
                {link.name}
              </a>
              {/* Separator dot, hidden after the last link */}
              {index < links.length - 1 && <span>·</span>} 
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;