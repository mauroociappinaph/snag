import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {t('hero.title')}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> {t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center justify-center group">
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.pexels.com/photos/4048742/pexels-photo-4048742.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="Scheduling interface"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white py-3 px-4 rounded-lg shadow-lg flex items-center">
            <div className="bg-green-500 rounded-full h-3 w-3 mr-2"></div>
            <p className="text-sm font-medium">{t('hero.stats', { count: 25 })}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
