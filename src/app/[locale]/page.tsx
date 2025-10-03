import { Navbar, Footer, HeroSection, StatusBars, TrafficWidget } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      
      {/* Widgets Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <TrafficWidget />
          </div>
        </div>
      </section>
      
      <StatusBars />
      <Footer />
    </div>
  );
}
