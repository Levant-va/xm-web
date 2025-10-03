'use client';

import { useState } from 'react';
import { Navbar, Footer, ProtectedRoute, useAuth } from '@/components';
import { Button } from '@/components/ui';

const AdminPage = () => {
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80');
  const [heroTexts, setHeroTexts] = useState([
    "Enhance your skills in virtual aviation with professional training and dedicated support",
    "Join us today and experience the highest standard of flight simulation and air traffic control",
    "Connect with aviation enthusiasts from around the Middle East region",
    "Master the art of virtual flying with our comprehensive training programs"
  ]);
  const [newText, setNewText] = useState('');
  const { logout } = useAuth();

  const handleAddText = () => {
    if (newText.trim()) {
      setHeroTexts([...heroTexts, newText]);
      setNewText('');
    }
  };

  const handleRemoveText = (index: number) => {
    setHeroTexts(heroTexts.filter((_, i) => i !== index));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
            <Button
              onClick={logout}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              Logout
            </Button>
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Background Image Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Background Image</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={backgroundImage}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Hero Text Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Hero Section Texts</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New Text
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new hero text"
                  />
                  <Button
                    onClick={handleAddText}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {heroTexts.map((text, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700 flex-1">{text}</span>
                    <Button
                      onClick={() => handleRemoveText(index)}
                      variant="secondary"
                      size="sm"
                      className="ml-2 bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Settings */}
          <div className="mt-8 text-center">
            <Button className="px-6 py-3 bg-green-600 hover:bg-green-700">
              Save Settings
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;