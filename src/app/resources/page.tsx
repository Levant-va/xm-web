import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Aeronautical Charts</h2>
            <p className="text-gray-600">Access comprehensive aeronautical charts and navigation aids.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Scenery</h2>
            <p className="text-gray-600">Download high-quality scenery packages for flight simulation.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Join IVAO</h2>
            <p className="text-gray-600">Learn how to join the IVAO network and start your journey.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Forum</h2>
            <p className="text-gray-600">Connect with the community through our discussion forums.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Division Transfers</h2>
            <p className="text-gray-600">Information about transferring between IVAO divisions.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">XM Wiki</h2>
            <p className="text-gray-600">Comprehensive knowledge base and documentation.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Rules & Regulations</h2>
            <p className="text-gray-600">Official rules and regulations for IVAO Middle East Division.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
