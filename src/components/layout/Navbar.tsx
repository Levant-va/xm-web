'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [zuluTime, setZuluTime] = useState('');
  const { isAuthenticated } = useAuth();
  const t = useTranslations();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      
      // Format time as HH:MM:SS Z
      const timeString = utcTime.toISOString().substr(11, 8);
      setZuluTime(timeString);
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      name: t('navigation.division'),
      href: '/division',
      submenu: [
        { name: t('division.aboutUs'), href: '/division/about' },
        { name: t('division.staffTeam'), href: '/division/staff' },
        { name: t('division.upcomingEvents'), href: '/division/events' },
        { name: t('division.virtualAirlines'), href: '/division/virtual-airlines' },
        { name: t('division.tours'), href: '/division/tours' },
      ]
    },
    {
      name: t('navigation.pilots'),
      href: '/pilots',
      submenu: [
        { name: t('pilots.webeye'), href: '/pilots/webeye' },
        { name: t('pilots.examGuidelines'), href: '/pilots/exam-guidelines' },
        { name: t('pilots.communicationManual'), href: '/pilots/communication-manual' },
      ]
    },
    {
      name: t('navigation.controllers'),
      href: '/controllers',
      submenu: [
        { name: t('controllers.atcOperation'), href: '/controllers/atc-operation' },
        { name: t('controllers.examGuidelines'), href: '/controllers/exam-guidelines' },
        { name: t('controllers.ojaiProcedures'), href: '/controllers/ojai-procedures' },
        { name: t('controllers.orbiProcedures'), href: '/controllers/orbi-procedures' },
        { name: t('controllers.osdiProcedures'), href: '/controllers/osdi-procedures' },
      ]
    },
    {
      name: t('navigation.training'),
      href: '/training',
      submenu: [
        { name: t('training.requestTraining'), href: '/training/request-training' },
        { name: t('training.requestExam'), href: '/training/request-exam' },
        { name: t('training.vfrCommunication'), href: '/training/vfr-communication' },
        { name: t('training.ifrCommunication'), href: '/training/ifr-communication' },
      ]
    },
    {
      name: t('navigation.resources'),
      href: '/resources',
      submenu: [
        { name: t('resources.charts'), href: '/resources/charts' },
        { name: t('resources.scenery'), href: '/resources/scenery' },
        { name: t('resources.joinIvao'), href: '/resources/join-ivao' },
        { name: t('resources.forum'), href: '/resources/forum' },
        { name: t('resources.transfers'), href: '/resources/transfers' },
        { name: t('resources.wiki'), href: '/resources/wiki' },
        { name: t('resources.rules'), href: '/resources/rules' },
      ]
    },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">XM</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">IVAO Middle East</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
                
                {/* Dropdown Menu */}
                {activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Admin Link - Only visible when authenticated */}
            {isAuthenticated && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('navigation.admin')}
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Zulu Time Display */}
            <div className="flex items-center space-x-2 px-3 py-2">
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-blue-600">
                  {zuluTime}Z
                </div>
                <div className="text-xs text-gray-500">
                  Zulu Time
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  <div className="pl-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="text-gray-600 hover:text-blue-600 block px-3 py-1 rounded-md text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Admin Link - Only visible when authenticated */}
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.admin')}
                </Link>
              )}

              {/* Zulu Time Display for Mobile */}
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Zulu Time</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-mono font-bold text-blue-600">
                      {zuluTime}Z
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Language Switcher for Mobile */}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;