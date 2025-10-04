'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const RequestTrainingButton = () => {
  const t = useTranslations();

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Link
            href="/training/request-training"
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 group"
          >
            <span className="text-lg">🎓</span>
            <span className="font-semibold">{t('training.requestTraining')}</span>
            <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestTrainingButton;
