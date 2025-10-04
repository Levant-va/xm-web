'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const t = useTranslations();
  
  const animatedTexts = [
    t('hero.description1'),
    t('hero.description2'),
    t('hero.description3'),
    t('hero.description4')
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => 
          prevIndex === animatedTexts.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [animatedTexts.length]);


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Background Image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Main Title */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-shadow-lg">
            <div className="text-white text-4xl sm:text-5xl lg:text-6xl mb-2">
              Welcome to
            </div>
            <div className="text-gradient bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
              IVAO Middle East Division
            </div>
          </h1>
        </div>
        
        {/* Animated Description */}
        <div className={`h-24 flex items-center justify-center mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative w-full max-w-4xl">
            <div className="text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-shadow min-h-[3rem] flex items-center justify-center">
                <span 
                  className={`inline-block transition-all duration-300 ${
                    isTransitioning 
                      ? 'opacity-0 transform translate-y-4 scale-95' 
                      : 'opacity-100 transform translate-y-0 scale-100'
                  }`}
                >
                  {animatedTexts[currentTextIndex]}
                </span>
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default HeroSection;
