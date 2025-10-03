import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DivisionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Division</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">About Us</h2>
            <p className="text-gray-600">Learn about the IVAO Middle East Division and our mission to enhance virtual aviation.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Staff Team</h2>
            <p className="text-gray-600">Meet our dedicated team of aviation professionals and volunteers.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <p className="text-gray-600">Stay updated with our latest events and activities.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Virtual Airlines</h2>
            <p className="text-gray-600">Discover virtual airlines operating in the Middle East region.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Tours</h2>
            <p className="text-gray-600">Join our organized tours and explore the Middle East skies.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
