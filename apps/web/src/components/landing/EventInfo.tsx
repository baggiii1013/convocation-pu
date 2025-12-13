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
    value: '3:00 PM - 9:00 PM',
    description: 'IST (UTC +5:30)',
    color: 'from-accent-blue to-blue-600',
  },
  {
    icon: MapPin,
    title: 'Venue',
    value: 'Convocation Ground',
    description: 'Near Design Building, Parul University Campus ',
    color: 'from-accent-pink to-pink-600',
  },
  {
    icon: Users,
    title: 'Attendees',
    value: '21,000+',
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
    <section className="relative py-24 bg-gradient-to-b from-light-bg via-secondary-50/30 to-light-bg dark:from-dark-bg dark:via-secondary-950/20 dark:to-dark-bg overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 dark:bg-accent-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 text-sm font-semibold bg-secondary-100 dark:bg-secondary-900/50 text-secondary-700 dark:text-secondary-300 rounded-full border border-secondary-200 dark:border-secondary-800">
              📅 Event Information
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-secondary-700 to-gray-900 dark:from-white dark:via-secondary-400 dark:to-white bg-clip-text text-transparent mb-6">
            Event Details
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about the convocation ceremony
          </p>
        </motion.div>

        {/* Event Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {eventDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="elevated"
                  className="group hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/30 transition-all duration-500 h-full border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 bg-white dark:bg-gray-900 relative overflow-hidden"
                >
                  {/* Animated gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${detail.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>

                  <CardHeader className="relative z-10">
                    <motion.div 
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${detail.color} mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-sm text-gray-500 dark:text-gray-500 font-semibold uppercase tracking-wider">
                      {detail.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-secondary-600 group-hover:bg-clip-text transition-all duration-300">
                      {detail.value}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {detail.description}
                    </p>
                  </CardContent>

                  {/* Decorative bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${detail.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
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
          className="mt-20"
        >
          <Card 
            variant="glass" 
            className="max-w-6xl mx-auto relative overflow-hidden border-2 border-primary-200 dark:border-primary-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary-500/10 to-transparent rounded-tr-full" />
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Important Information
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Please arrive at least 30 minutes before the ceremony',
                      'Convocational dress code is mandatory for all attendees',
                      'Attendees are expected to be seated at their designated seat',
                      'It is mandatory to bring Adhaar Card & university identification proof',
                      'All the students must collect their scarf from the respective department / institute. Only students having scarf with them will be allowed to enter at the convocation venue.'
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3 group"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform duration-300">
                          ✓
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-secondary-500 to-secondary-600 rounded-full" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Contact Information
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { icon: '🌐', text: 'www.paruluniversity.ac.in', link: 'www.paruluniversity.ac.in' },
                      { icon: '📞', text: '+91 2668260300', link: 'tel:+912668260300' },
                      { icon: '📧', text: 'info@paruluniversity.ac.in', link: 'info@paruluniversity.ac.in' },
                      { icon: '⏰', text: 'Helpdesk: 9:00 AM - 6:00 PM (Mon-Fri)', link: null },
                      { icon: '📍', text: 'Parul University, P.O. Limbda, Ta. Waghodia-3901760 , Dist. Vadodara(India)', link: null }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-3 group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900 dark:to-secondary-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        {item.link ? (
                          <a 
                            href={item.link}
                            className="text-gray-700 dark:text-gray-300 leading-relaxed hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors duration-300 underline-offset-4 hover:underline"
                          >
                            {item.text}
                          </a>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.text}
                          </span>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
