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
      
      // Get UTC time directly using UTC methods
      const hours = now.getUTCHours().toString().padStart(2, '0');
      const minutes = now.getUTCMinutes().toString().padStart(2, '0');
      const seconds = now.getUTCSeconds().toString().padStart(2, '0');
      
      setZuluTime(`${hours}:${minutes}:${seconds}`);
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
      submenu: [
        { name: t('division.divisionalStaff'), href: 'https://www.ivao.aero/staff/division.asp?Id=XM', external: true },
        { name: t('division.divisionalEvents'), href: '/division/events' },
        { name: t('division.tours'), href: 'https://tours.th.ivao.aero/index.php?div=XM', external: true },
      ]
    },
    {
      name: t('navigation.pilots'),
      href: '/pilots',
      submenu: [
        { name: t('pilots.webeye'), href: 'https://webeye.ivao.aero/', external: true },
        { name: t('pilots.examGuidelines'), href: 'https://wiki.ivao.aero/en/home/training/documentation', external: true },
        { name: t('pilots.communicationManual'), href: '/pilots/communication-manual' },
        { name: t('pilots.ivaoTracker'), href: 'https://tracker.ivao.aero/', external: true },
      ]
    },
    {
      name: t('navigation.controllers'),
      href: '/controllers',
      submenu: [
        { name: 'Controller Training / Guidelines', href: 'https://wiki.ivao.aero/en/home/training/documentation', external: true },
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
            {/* Home Button */}
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-white hover:text-emerald-400 hover:bg-gray-800' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 text-shadow'
              }`}
            >
              <span>{t('navigation.home')}</span>
            </Link>
            
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
                  <span>{item.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === item.name && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="navbar-dropdown absolute top-full left-0 mt-2 w-72 glass rounded-xl shadow-xl border border-white/20 py-2 z-50 animate-fade-in-up"
                  >
                    {item.submenu.map((subItem) => (
                      subItem.external ? (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-gray-800 hover:text-emerald-400 transition-all duration-200 group"
                        >
                          <span>{subItem.name}</span>
                          <span className="text-xs opacity-70">↗</span>
                        </a>
                      ) : (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-gray-800 hover:text-emerald-400 transition-all duration-200 group"
                        >
                          <span>{subItem.name}</span>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Admin Dropdown - Only visible when authenticated */}
            {isAuthenticated && (
              <div className="relative navbar-dropdown">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'admin' ? null : 'admin')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-white hover:text-emerald-400 hover:bg-gray-800' 
                      : 'text-white/90 hover:text-white hover:bg-white/10 text-shadow'
                  }`}
                >
                  <span className="text-base">⚙️</span>
                  <span>{t('navigation.admin')}</span>
                </button>
                
                {activeDropdown === 'admin' && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="navbar-dropdown absolute top-full left-0 mt-2 w-72 glass rounded-xl shadow-xl border border-white/20 py-2 z-50 animate-fade-in-up"
                  >
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-gray-800 hover:text-emerald-400 transition-all duration-200 group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span>📊</span>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/admin/events"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-gray-800 hover:text-emerald-400 transition-all duration-200 group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span>📅</span>
                      <span>Manage Events</span>
                    </Link>
                  </div>
                )}
              </div>
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
              {/* Home Button for Mobile */}
              <Link
                href="/"
                className="flex items-center space-x-3 text-white hover:text-emerald-400 block px-3 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">🏠</span>
                <span>{t('navigation.home')}</span>
              </Link>
              
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => {
                      const newActiveDropdown = activeDropdown === item.name ? null : item.name;
                      setActiveDropdown(newActiveDropdown);
                    }}
                    className="flex items-center space-x-3 text-white hover:text-emerald-400 block px-3 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-200 w-full text-left"
                  >
                    <span>{item.name}</span>
                  </button>
                  <div className="pl-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      subItem.external ? (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{subItem.name}</span>
                          <span className="text-xs opacity-70">↗</span>
                        </a>
                      ) : (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{subItem.name}</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Admin Link - Only visible when authenticated */}
              {isAuthenticated && (
                <Link
                  href="/admin/dashboard"
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