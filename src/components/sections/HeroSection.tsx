'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useBackgroundImage } from '@/components/context/BackgroundImageContext';

const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState<Array<{
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);
  const t = useTranslations();
  const { backgroundImage } = useBackgroundImage();
  
  const animatedTexts = [
    t('hero.description1'),
    t('hero.description2'),
    t('hero.description3'),
    t('hero.description4')
  ];

  useEffect(() => {
    // Generate particles only on client side to prevent hydration mismatch
    setParticles(
      [...Array(50)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 3,
        animationDuration: 3 + Math.random() * 2
      }))
    );
    
    setIsVisible(true);
    
    // Text rotation interval
    const textInterval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => 
          prevIndex === animatedTexts.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(textInterval);
  }, [animatedTexts.length]);


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Container */}
      <div className="absolute inset-0">
        {/* Show uploaded image if available, otherwise show gradient */}
        {backgroundImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"></div>
        )}
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`
              }}
            />
          ))}
        </div>
        
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
        <div className={`h-24 flex items-center justify-center mb-2 transition-all duration-1000 delay-300 ${
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
        
        {/* Flag Images */}
        <div className={`flex justify-center items-center space-x-8 mb-4 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Jordan Flag */}
          <div className="relative group">
            <div className="w-12 h-9 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/img/flag/jordan.png" 
                alt="Jordan Flag" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to colored div if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div className="w-full h-full hidden relative">
                {/* Red triangle on the left */}
                <div className="absolute left-0 top-0 w-1/3 h-full bg-red-600"></div>
                {/* Horizontal stripes */}
                <div className="absolute left-1/3 top-0 w-2/3 h-1/3 bg-black"></div>
                <div className="absolute left-1/3 top-1/3 w-2/3 h-1/3 bg-white"></div>
                <div className="absolute left-1/3 top-2/3 w-2/3 h-1/3 bg-green-500"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Jordan
            </div>
          </div>

          {/* Syria Flag */}
          <div className="relative group">
            <div className="w-12 h-9 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/img/flag/syria.png" 
                alt="Syria Flag" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div className="w-full h-full hidden relative">
                <div className="absolute top-0 w-full h-1/3 bg-green-500"></div>
                <div className="absolute top-1/3 w-full h-1/3 bg-white"></div>
                <div className="absolute top-2/3 w-full h-1/3 bg-black"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Syria
            </div>
          </div>

          {/* Iraq Flag */}
          <div className="relative group">
            <div className="w-12 h-9 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/img/flag/iraq.png" 
                alt="Iraq Flag" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div className="w-full h-full hidden relative">
                <div className="absolute top-0 w-full h-1/3 bg-red-600"></div>
                <div className="absolute top-1/3 w-full h-1/3 bg-white"></div>
                <div className="absolute top-2/3 w-full h-1/3 bg-black"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Iraq
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default HeroSection;
