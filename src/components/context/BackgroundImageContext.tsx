'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundImageContextType {
  backgroundImage: string;
  updateBackgroundImage: (imageUrl: string) => void;
}

const BackgroundImageContext = createContext<BackgroundImageContextType | undefined>(undefined);

export const BackgroundImageProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // Load background image from localStorage on mount
    const savedImage = localStorage.getItem('adminBackgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
  }, []);

  const updateBackgroundImage = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    localStorage.setItem('adminBackgroundImage', imageUrl);
  };

  return (
    <BackgroundImageContext.Provider value={{ backgroundImage, updateBackgroundImage }}>
      {children}
    </BackgroundImageContext.Provider>
  );
};

export const useBackgroundImage = () => {
  const context = useContext(BackgroundImageContext);
  if (context === undefined) {
    throw new Error('useBackgroundImage must be used within a BackgroundImageProvider');
  }
  return context;
};
