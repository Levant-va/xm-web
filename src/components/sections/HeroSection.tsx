'use client';

import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const animatedTexts = [
    "Enhance your skills in virtual aviation with professional training and dedicated support",
    "Join us today and experience the highest standard of flight simulation and air traffic control",
    "Connect with aviation enthusiasts from around the Middle East region",
    "Master the art of virtual flying with our comprehensive training programs"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        prevIndex === animatedTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [animatedTexts.length]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          IVAO Middle East Division
        </h1>
        
        {/* Animated Description */}
        <div className="h-20 flex items-center justify-center mb-12">
          <p className="text-lg sm:text-xl lg:text-2xl font-medium transition-all duration-500 ease-in-out">
            {animatedTexts[currentTextIndex]}
          </p>
        </div>
        
        {/* FIR Map Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Flight Information Regions (FIR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-lg p-6 hover:bg-white/30 transition-colors">
              <h3 className="text-xl font-semibold mb-2">OJAC</h3>
              <p className="text-sm opacity-90">Amman Control</p>
            </div>
            <div className="bg-white/20 rounded-lg p-6 hover:bg-white/30 transition-colors">
              <h3 className="text-xl font-semibold mb-2">OSDI</h3>
              <p className="text-sm opacity-90">Baghdad Control</p>
            </div>
            <div className="bg-white/20 rounded-lg p-6 hover:bg-white/30 transition-colors">
              <h3 className="text-xl font-semibold mb-2">ORBI</h3>
              <p className="text-sm opacity-90">Baghdad Control</p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Join IVAO
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
