'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import * as React from 'react';

const eventDetails = [
  {
    icon: Calendar,
    title: 'Date',
    value: 'December 15, 2025',
    description: 'Mark your calendar',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Clock,
    title: 'Time',
    value: '10:00 AM - 2:00 PM',
    description: 'IST (UTC +5:30)',
    color: 'from-accent-blue to-blue-600',
  },
  {
    icon: MapPin,
    title: 'Venue',
    value: 'Main Auditorium',
    description: 'Punjab University Campus',
    color: 'from-accent-pink to-pink-600',
  },
  {
    icon: Users,
    title: 'Attendees',
    value: '2,000+ Expected',
    description: 'Students, Faculty & Guests',
    color: 'from-accent-green to-green-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function EventInfo() {
  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Event Details
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about the convocation ceremony
          </p>
        </motion.div>

        {/* Event Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {eventDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant="elevated"
                  className="group hover:shadow-xl transition-all duration-300 h-full"
                >
                  <CardHeader>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${detail.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {detail.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {detail.value}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {detail.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card variant="glass" className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Important Information
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span>Please arrive at least 30 minutes before the ceremony</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span>Formal dress code is mandatory for all attendees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span>Photography and videography will be available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span>Parking facilities available on campus</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Contact Information
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">📧</span>
                      <span>convocation@pu.edu.in</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">📞</span>
                      <span>+91 123 456 7890</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">🌐</span>
                      <span>www.pu.edu.in/convocation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">⏰</span>
                      <span>Helpdesk: 9:00 AM - 6:00 PM (Mon-Fri)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
