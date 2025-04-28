import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import FeatureCard from './common/FeatureCard';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="w-12 h-12 text-blue-500" />,
      title: "Smart Scheduling",
      description: "Our AI-powered scheduling system optimizes your calendar to maximize your business efficiency and client satisfaction."
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-500" />,
      title: "24/7 Bookings",
      description: "Allow clients to book appointments anytime, day or night, without requiring your staff's attention."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-blue-500" />,
      title: "Automated Reminders",
      description: "Reduce no-shows by automatically sending customizable reminders via email or SMS."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features designed for service businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your booking process and grow your business.
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
        
        <div className="mt-16 text-center">
          <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold flex items-center justify-center gap-2 mx-auto w-fit transition-colors">
            <span>View all features</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

import { ArrowRight } from 'lucide-react';

export default Features;