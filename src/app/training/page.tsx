import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Training</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Request Training</h2>
            <p className="text-gray-600">Submit your training requests and get personalized instruction.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Request Exam</h2>
            <p className="text-gray-600">Schedule your examinations and assessments.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">VFR Communication</h2>
            <p className="text-gray-600">Master Visual Flight Rules communication procedures.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">IFR Communication</h2>
            <p className="text-gray-600">Learn Instrument Flight Rules communication protocols.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
