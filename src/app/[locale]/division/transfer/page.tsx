import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';

export default function DivisionTransferPage() {
  const t = useTranslations();
  
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
              {t('divisionTransfer.title')}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('divisionTransfer.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Transfer Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Requirements Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">{t('divisionTransfer.requirements')}</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-300 text-lg">{t('divisionTransfer.activeIvaoAccount')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-300 text-lg">{t('divisionTransfer.emailAccess')}</p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">{t('divisionTransfer.process')}</h2>
          <p className="text-gray-300 text-lg mb-6 text-center">
            {t('divisionTransfer.processDescription')}
          </p>
        </div>

        {/* Email Details Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">{t('divisionTransfer.emailDetails')}</h2>
          
          <div className="space-y-6">
            {/* To Field */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">{t('divisionTransfer.to')}</h3>
              <div className="space-y-2">
                <p className="text-gray-300 font-mono text-lg">xm-hq@ivao.aero</p>
                <p className="text-gray-300 font-mono text-lg">XX-hq@ivao.aero</p>
                <p className="text-gray-400 text-sm mt-2">{t('divisionTransfer.currentDivisionNote')}</p>
              </div>
            </div>

            {/* CC Field */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-green-400 mb-3">{t('divisionTransfer.cc')}</h3>
              <p className="text-gray-300 font-mono text-lg">members@ivao.aero</p>
            </div>

            {/* Subject Field */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('divisionTransfer.subject')}</h3>
              <p className="text-gray-300 font-mono text-lg">DIVISION TRANSFER VID</p>
              <p className="text-gray-400 text-sm mt-2">{t('divisionTransfer.vidNote')}</p>
            </div>

            {/* Email Body */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">{t('divisionTransfer.emailBody')}</h3>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  {t('divisionTransfer.emailTemplate')}
                </p>
                <br />
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  {t('divisionTransfer.yourName')}
                </p>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold">
              <span>📧</span>
              <span>{t('divisionTransfer.send')}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm">ℹ</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">{t('divisionTransfer.importantNotes')}</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• {t('divisionTransfer.note1')}</li>
                <li>• {t('divisionTransfer.note2')}</li>
                <li>• {t('divisionTransfer.note3')}</li>
                <li>• {t('divisionTransfer.note4')}</li>
                <li>• {t('divisionTransfer.note5')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
