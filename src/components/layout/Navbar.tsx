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
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar-dropdown') && !target.closest('button')) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const navigationItems = [
    {
      name: t('navigation.division'),
      href: '/division',
      icon: '🏢',
      submenu: [
        { name: t('division.aboutUs'), href: '/division/about', icon: 'ℹ️' },
        { name: t('division.staffTeam'), href: '/division/staff', icon: '👥' },
        { name: t('division.upcomingEvents'), href: '/division/events', icon: '📅' },
        { name: t('division.virtualAirlines'), href: '/division/virtual-airlines', icon: '✈️' },
        { name: t('division.tours'), href: '/division/tours', icon: '🗺️' },
      ]
    },
    {
      name: t('navigation.pilots'),
      href: '/pilots',
      icon: '✈️',
      submenu: [
        { name: t('pilots.webeye'), href: '/pilots/webeye', icon: '👁️' },
        { name: t('pilots.examGuidelines'), href: '/pilots/exam-guidelines', icon: '📋' },
        { name: t('pilots.communicationManual'), href: '/pilots/communication-manual', icon: '📖' },
      ]
    },
    {
      name: t('navigation.controllers'),
      href: '/controllers',
      icon: '🎯',
      submenu: [
        { name: t('controllers.atcOperation'), href: '/controllers/atc-operation', icon: '🎮' },
        { name: t('controllers.examGuidelines'), href: '/controllers/exam-guidelines', icon: '📋' },
        { name: t('controllers.ojaiProcedures'), href: '/controllers/ojai-procedures', icon: '📄' },
        { name: t('controllers.orbiProcedures'), href: '/controllers/orbi-procedures', icon: '📄' },
        { name: t('controllers.osdiProcedures'), href: '/controllers/osdi-procedures', icon: '📄' },
      ]
    },
    {
      name: t('navigation.training'),
      href: '/training',
      icon: '🎓',
      submenu: [
        { name: t('training.requestTraining'), href: '/training/request-training', icon: '📝' },
        { name: t('training.requestExam'), href: '/training/request-exam', icon: '📝' },
        { name: t('training.vfrCommunication'), href: '/training/vfr-communication', icon: '📻' },
        { name: t('training.ifrCommunication'), href: '/training/ifr-communication', icon: '📻' },
      ]
    },
    {
      name: t('navigation.resources'),
      href: '/resources',
      icon: '📚',
      submenu: [
        { name: t('resources.charts'), href: '/resources/charts', icon: '🗺️' },
        { name: t('resources.scenery'), href: '/resources/scenery', icon: '🌍' },
        { name: t('resources.joinIvao'), href: '/resources/join-ivao', icon: '🔗' },
        { name: t('resources.forum'), href: '/resources/forum', icon: '💬' },
        { name: t('resources.transfers'), href: '/resources/transfers', icon: '🔄' },
        { name: t('resources.wiki'), href: '/resources/wiki', icon: '📖' },
        { name: t('resources.rules'), href: '/resources/rules', icon: '📋' },
      ]
    },
  ];

  return (
    <nav className={`static transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group -mt-2">
              <div className="h-40 w-40 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/img/xm-logo.png" 
                  alt="XM Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
              >
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-white hover:text-emerald-400 hover:bg-gray-800' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 text-shadow'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === item.name && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="navbar-dropdown absolute top-full left-0 mt-2 w-72 glass rounded-xl shadow-xl border border-white/20 py-2 z-50 animate-fade-in-up"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-gray-800 hover:text-emerald-400 transition-all duration-200 group"
                      >
                        <span className="text-base group-hover:scale-110 transition-transform duration-200">
                          {subItem.icon}
                        </span>
                        <span>{subItem.name}</span>
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10 text-shadow'
                }`}
              >
                <span className="text-base">⚙️</span>
                <span>{t('navigation.admin')}</span>
              </Link>
            )}

            {/* Language Switcher */}
            <div className="ml-2">
              <LanguageSwitcher />
            </div>

            {/* Zulu Time Display */}
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              isScrolled ? 'bg-gray-800' : 'bg-white/10'
            }`}>
              <div className="text-right">
                <div className={`text-sm font-mono font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-emerald-400' : 'text-white text-shadow'
                }`}>
                  {zuluTime}Z
                </div>
                <div className={`text-xs transition-colors duration-300 ${
                  isScrolled ? 'text-gray-500' : 'text-white/70'
                }`}>
                  Zulu Time
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'text-white hover:text-emerald-400 hover:bg-gray-800' 
                  : 'text-white hover:bg-white/10 text-shadow'
              }`}
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
          <div className="md:hidden animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass rounded-xl mt-2 border border-white/20">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => {
                      const newActiveDropdown = activeDropdown === item.name ? null : item.name;
                      setActiveDropdown(newActiveDropdown);
                    }}
                    className="flex items-center space-x-3 text-white hover:text-emerald-400 block px-3 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-200 w-full text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                  <div className="pl-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-sm">{subItem.icon}</span>
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Admin Link - Only visible when authenticated */}
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 block px-3 py-3 rounded-lg text-base font-medium hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">⚙️</span>
                  <span>{t('navigation.admin')}</span>
                </Link>
              )}

              {/* Zulu Time Display for Mobile */}
              <div className="px-3 py-3 border-t border-gray-200/50">
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