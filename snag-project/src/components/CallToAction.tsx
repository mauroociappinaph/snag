import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to streamline your booking process?
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Join thousands of service businesses using Snag to manage their appointments and grow their revenue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors flex items-center justify-center mx-auto sm:mx-0 group">
            Get started for free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium transition-colors mx-auto sm:mx-0">
            Schedule a demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;