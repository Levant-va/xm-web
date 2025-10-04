'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const PartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const partners = [
    {
      name: "IVAO",
      logo: "/img/partners/ivao-logo.png",
      description: "International Virtual Aviation Organization",
      url: "https://ivao.aero"
    },
    {
      name: "IVAO Levant VA",
      logo: "/img/partners/levant-va.png",
      description: "Leading Virtual Airline in the Levant Region",
      url: "https://levant-va.com/"
    },
    {
      name: "XM VA",
      logo: "/img/partners/xm-va.png", 
      description: "Excellence in Virtual Aviation",
      url: "https://xm-va.com/"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            <h2 className="text-4xl font-bold text-white mx-8">
              {t('partners.title')}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('partners.description')}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={index}
              className={`group text-center transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Partner Card */}
              <div className={`bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-8 hover-lift transition-all duration-500 group-hover:shadow-2xl relative overflow-hidden ${partner.url ? 'cursor-pointer' : ''}`}
                   onClick={() => partner.url && window.open(partner.url, '_blank')}>
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Logo */}
                <div className="relative z-10">
                  <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} Logo`}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                    {partner.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '100ms' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
