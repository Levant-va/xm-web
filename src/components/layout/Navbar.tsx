'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const navigationItems = [
    {
      name: 'Division',
      href: '/division',
      submenu: [
        { name: 'About us', href: '/division/about' },
        { name: 'Staff Team', href: '/division/staff' },
        { name: 'Upcoming Events', href: '/division/events' },
        { name: 'Virtual Airlines', href: '/division/virtual-airlines' },
        { name: 'Tours', href: '/division/tours' },
      ]
    },
    {
      name: 'Pilots',
      href: '/pilots',
      submenu: [
        { name: 'Webeye', href: '/pilots/webeye' },
        { name: 'Pilot Exam/Training Guidelines', href: '/pilots/exam-guidelines' },
        { name: 'Communication Manual', href: '/pilots/communication-manual' },
      ]
    },
    {
      name: 'Controllers',
      href: '/controllers',
      submenu: [
        { name: 'ATC Operation', href: '/controllers/atc-operation' },
        { name: 'ATC Exam/Training Guidelines', href: '/controllers/exam-guidelines' },
        { name: 'OJAI Procedures', href: '/controllers/ojai-procedures' },
        { name: 'ORBI Procedures', href: '/controllers/orbi-procedures' },
        { name: 'OSDI Procedures', href: '/controllers/osdi-procedures' },
      ]
    },
    {
      name: 'Training',
      href: '/training',
      submenu: [
        { name: 'Request Training', href: '/training/request-training' },
        { name: 'Request Exam', href: '/training/request-exam' },
        { name: 'VFR Communication', href: '/training/vfr-communication' },
        { name: 'IFR Communication', href: '/training/ifr-communication' },
      ]
    },
    {
      name: 'Resources',
      href: '/resources',
      submenu: [
        { name: 'Aeronautical Charts', href: '/resources/charts' },
        { name: 'Scenery', href: '/resources/scenery' },
        { name: 'Join IVAO', href: '/resources/join-ivao' },
        { name: 'Forum', href: '/resources/forum' },
        { name: 'Division Transfers', href: '/resources/transfers' },
        { name: 'XM Wiki', href: '/resources/wiki' },
        { name: 'Rules & Regulations', href: '/resources/rules' },
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
                Admin
              </Link>
            )}
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
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
