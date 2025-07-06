'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Users, Shield, TrendingUp } from 'lucide-react';

export default function FeatureShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Unlock All Features
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            You've discovered one of our amazing features! Join a society to access all the powerful tools that make community management effortless.
          </p>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Secure • Efficient • User-friendly
          </div>
        </motion.div>

        {/* Feature Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Community-Driven</h3>
            <p className="text-gray-600 text-sm">Connect with your neighbors and build a stronger community together.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade security measures.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Streamlined</h3>
            <p className="text-gray-600 text-sm">Automate tasks and reduce administrative overhead significantly.</p>
          </div>
        </motion.div>

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You Get When You Join
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Complete financial management and billing",
              "Visitor and security management",
              "Maintenance and complaint tracking",
              "Community polls and voting",
              "Emergency alerts and notifications",
              "Facility booking and management",
              "Document repository and storage",
              "Staff management and coordination",
              "Real-time communication tools",
              "Detailed reports and analytics"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to Transform Your Community?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of societies already using our platform to create better living experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join-society"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              Join a Society
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors font-medium"
            >
              Explore More Features
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            * Free for the first 3 months for new societies
          </p>
        </motion.div>
      </div>
    </div>
  );
}
