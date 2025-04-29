import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import FeatureCard from './common/FeatureCard';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="w-12 h-12 text-blue-500" />,
      title: "Reservas",
      description: "Nuestro sistema de reservas optimiza tu calendario para maximizar la eficiencia de tu negocio y la satisfacción de tus clientes."
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-500" />,
      title: "Reservas 24/7",
      description: "Permite a tus clientes agendar citas en cualquier momento, día o noche, sin requerir atención de tu personal."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-blue-500" />,
      title: "Recordatorios Automáticos",
      description: "Reduce no-shows enviando recordatorios personalizados por correo electrónico o SMS."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Características diseñadas para negocios de servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para optimizar tu proceso de reservas y crecer tu negocio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>


      </div>
    </section>
  );
};



export default Features;
