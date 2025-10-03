import { useTranslations } from 'next-intl';

const StatusBars = () => {
  const t = useTranslations();
  
  const statusItems = [
    {
      title: t('statusBars.ivaoNetwork.title'),
      description: t('statusBars.ivaoNetwork.description'),
      icon: "🌐",
      color: "bg-blue-500"
    },
    {
      title: t('statusBars.seamlessGrowth.title'),
      description: t('statusBars.seamlessGrowth.description'),
      icon: "📈",
      color: "bg-green-500"
    },
    {
      title: t('statusBars.dedicatedSupport.title'),
      description: t('statusBars.dedicatedSupport.description'),
      icon: "🎯",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statusItems.map((item, index) => (
            <div key={index} className="text-center group">
              <div className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatusBars;
