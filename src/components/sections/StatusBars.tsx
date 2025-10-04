'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

const StatusBars = () => {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const statusItems = [
    {
      title: t('statusBars.ivaoNetwork.title'),
      description: t('statusBars.ivaoNetwork.description'),
      icon: "🌐",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      delay: "0ms"
    },
    {
      title: t('statusBars.seamlessGrowth.title'),
      description: t('statusBars.seamlessGrowth.description'),
      icon: "📈",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      delay: "200ms"
    },
    {
      title: t('statusBars.dedicatedSupport.title'),
      description: t('statusBars.dedicatedSupport.description'),
      icon: "🎯",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      delay: "400ms"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-gradient bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">IVAO Middle East</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of virtual aviation with our cutting-edge platform and dedicated community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statusItems.map((item, index) => (
            <div
              key={index}
              className={`group text-center transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: item.delay }}
            >
              {/* Card Container */}
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-8 hover-lift transition-all duration-500 group-hover:shadow-2xl relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-xl`}>
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '100ms' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Training Sections */}
        <div className={`mt-16 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Pilot Support & Training */}
          <div className="bg-transparent border-2 border-gray-600 rounded-3xl p-8 mb-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-3xl font-bold text-white mb-6">
                  {t('training.pilotSupport.title')}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('training.pilotSupport.description')}
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <img 
                  src="/img/Pilot-Support.png" 
                  alt="Pilot Support" 
                  className="rounded-3xl shadow-lg"
                  style={{ width: '526px', height: '370px', objectFit: 'contain', borderRadius: '2rem' }}
                />
              </div>
            </div>
          </div>

          {/* ATC Training & Operations */}
          <div className="bg-transparent border-2 border-gray-600 rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img 
                  src="/img/ATC-Training.png" 
                  alt="ATC Training" 
                  className="rounded-3xl shadow-lg"
                  style={{ width: '526px', height: '370px', objectFit: 'contain', borderRadius: '2rem' }}
                />
              </div>
              <div className="order-2">
                <h3 className="text-3xl font-bold text-white mb-6">
                  {t('training.atcTraining.title')}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('training.atcTraining.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatusBars;
