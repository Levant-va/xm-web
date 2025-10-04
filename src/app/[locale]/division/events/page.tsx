import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DivisionEventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-500/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Divisional Events
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join our exciting virtual aviation events across the Middle East region
            </p>
          </div>
        </div>
      </div>

      {/* Events Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* No Events Message */}
        <div className="text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">📅</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No Events at This Time</h2>
            <p className="text-gray-300 text-lg mb-6">
              We&apos;re currently planning exciting events for the Middle East Division. 
              Stay tuned for upcoming virtual aviation activities!
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <span className="animate-pulse">🔔</span>
              <span className="text-sm font-medium">Check back soon for updates</span>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
