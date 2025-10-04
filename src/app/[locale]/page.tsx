import { Navbar, Footer, HeroSection, StatusBars, TrafficWidget, PartnersSection } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <HeroSection />
      
      <StatusBars />
      
      <PartnersSection />
      
      {/* Extra spacing before footer */}
      <div className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      <Footer />
    </div>
  );
}
