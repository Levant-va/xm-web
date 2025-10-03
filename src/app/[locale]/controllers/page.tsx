import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ControllersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Controllers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">ATC Operation</h2>
            <p className="text-gray-600">Learn about air traffic control operations and procedures.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">ATC Exam/Training Guidelines</h2>
            <p className="text-gray-600">Comprehensive guidelines for ATC examinations and training.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">OJAI Procedures</h2>
            <p className="text-gray-600">Specific procedures for OJAI airspace operations.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">ORBI Procedures</h2>
            <p className="text-gray-600">Specific procedures for ORBI airspace operations.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">OSDI Procedures</h2>
            <p className="text-gray-600">Specific procedures for OSDI airspace operations.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
