'use client';

import { useState, useEffect } from 'react';
import { Navbar, Footer, ProtectedRoute, useAuth } from '@/components';
import { Button } from '@/components/ui';
import { useBackgroundImage } from '@/components/context/BackgroundImageContext';
import Image from 'next/image';

interface HeroText {
  id: string;
  text: string;
  isActive: boolean;
}

interface AdminSettings {
  backgroundImage: string;
  heroTexts: HeroText[];
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
}

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { backgroundImage, updateBackgroundImage } = useBackgroundImage();
  const [settings, setSettings] = useState<AdminSettings>({
    backgroundImage: '',
    heroTexts: [
      { id: '1', text: "Enhance your skills in virtual aviation with professional training and dedicated support", isActive: true },
      { id: '2', text: "Join us today and experience the highest standard of flight simulation and air traffic control", isActive: true },
      { id: '3', text: "Connect with aviation enthusiasts from around the Middle East region", isActive: true },
      { id: '4', text: "Master the art of virtual flying with our comprehensive training programs", isActive: true }
    ],
    siteTitle: 'IVAO Middle East Division',
    siteDescription: 'Enhancing virtual aviation skills across the Middle East region',
    maintenanceMode: false
  });
  
  const [newText, setNewText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Sync settings background image with context
  useEffect(() => {
    if (backgroundImage) {
      setSettings(prev => ({ ...prev, backgroundImage }));
    }
  }, [backgroundImage]);

  const handleAddText = () => {
    if (newText.trim()) {
      const newHeroText: HeroText = {
        id: Date.now().toString(),
        text: newText.trim(),
        isActive: true
      };
      setSettings(prev => ({
        ...prev,
        heroTexts: [...prev.heroTexts, newHeroText]
      }));
      setNewText('');
    }
  };

  const handleRemoveText = (id: string) => {
    setSettings(prev => ({
      ...prev,
      heroTexts: prev.heroTexts.filter(text => text.id !== id)
    }));
  };

  const handleToggleText = (id: string) => {
    setSettings(prev => ({
      ...prev,
      heroTexts: prev.heroTexts.map(text => 
        text.id === id ? { ...text, isActive: !text.isActive } : text
      )
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
    
    setIsSaving(false);
  };


  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // TODO: Replace with database upload
      // In production, upload to database/storage service and get URL
      // For now, convert to base64 for immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSettings(prev => ({ ...prev, backgroundImage: result }));
        
        // Update the global background image context
        updateBackgroundImage(result);
        
        setIsUploading(false);
        
        // TODO: Save to database
        // await saveBackgroundImageToDatabase(result);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError('Failed to upload image');
      setIsUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <style jsx global>{`
          .navbar-dark nav {
            background: rgb(17 24 39) !important;
          }
          .navbar-dark nav * {
            color: white !important;
          }
          .navbar-dark nav button {
            color: white !important;
          }
          .navbar-dark nav a {
            color: white !important;
          }
          .navbar-dark nav span {
            color: white !important;
          }
          .navbar-dark nav .text-white {
            color: white !important;
          }
          .navbar-dark nav .text-gray-700 {
            color: white !important;
          }
          .navbar-dark nav .text-white\\/90 {
            color: white !important;
          }
        `}</style>
        <div className="bg-gray-900 shadow-sm border-b border-gray-700">
          <div className="navbar-dark">
            <Navbar />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-300 font-medium">Manage your XM Division website settings</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-green-800">Settings saved successfully!</p>
                </div>
              </div>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">Failed to save settings. Please try again.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Site Settings */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Site Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700 transition-all duration-200"
                    placeholder="Enter site title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700 transition-all duration-200"
                    rows={3}
                    placeholder="Enter site description"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-300 font-medium">
                    Maintenance Mode
                  </label>
                </div>
              </div>
            </div>

            {/* Background Image Settings */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Background Image
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Background Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="mt-2 text-blue-400 text-sm">Uploading image...</div>
                  )}
                  {uploadError && (
                    <div className="mt-2 text-red-400 text-sm">{uploadError}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden border">
                    {settings.backgroundImage ? (
                      <Image
                        src={settings.backgroundImage}
                        alt="Background preview"
                        width={400}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No background image uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Text Management */}
          <div className="mt-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
              <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Hero Section Texts
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Add New Text
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700 transition-all duration-200"
                  placeholder="Enter new hero text"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                />
                <Button
                  onClick={handleAddText}
                  size="sm"
                  disabled={!newText.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {settings.heroTexts.map((text) => (
                <div key={text.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors duration-200">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={text.isActive}
                      onChange={() => handleToggleText(text.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <span className={`text-sm flex-1 font-medium ${text.isActive ? 'text-white' : 'text-gray-400 line-through'}`}>
                      {text.text}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleRemoveText(text.id)}
                    variant="secondary"
                    size="sm"
                    className="ml-3 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Settings */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
