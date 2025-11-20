import React from 'react';

/**
 * Simple footer component displaying legal links and copyright information.
 */
function Footer() {
  const year = new Date().getFullYear();
  
  // Array for footer links (Portuguese of Portugal)
  const links = [
    { name: "Privacidade", href: "#" },
    { name: "Termos", href: "#" },
    { name: "Mapa do Site", href: "#" },
    { name: "Informações da empresa", href: "#" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-4">
      <div className="max-w-[1790px] mx-auto px-5 sm:px-10 text-sm text-gray-600">
        
        {/* Copyright Section */}
        <p className="mb-2">
          © {year} Descobrir, Inc.
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