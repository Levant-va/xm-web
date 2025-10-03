import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PilotsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Pilots</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Webeye</h2>
            <p className="text-gray-600">Access real-time flight tracking and monitoring tools for pilots.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Pilot Exam/Training Guidelines</h2>
            <p className="text-gray-600">Comprehensive guidelines for pilot examinations and training programs.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Communication Manual</h2>
            <p className="text-gray-600">Essential communication procedures and protocols for pilots.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
