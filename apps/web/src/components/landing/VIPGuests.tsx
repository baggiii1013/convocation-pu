'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

interface Guest {
  name: string;
  title: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
  };
}

const guests: Guest[] = [
  {
    name: 'Dr. Rajesh Kumar',
    title: 'Chief Guest',
    role: 'Former Vice Chancellor',
    bio: 'Renowned educationist with 30+ years of experience in academic leadership',
    image: '/guests/guest-1.jpg',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Mrs. Sania Mirza',
    title: 'Guest of Honor',
    role: 'Former professional tennis player',
    bio: 'Sania Mirza  is an Indian former professional tennis player. A former doubles world No. 1, she won six major titles – three in womens doubles and three in mixed doubles.',
    image: 'https://cdn.shopify.com/s/files/1/0719/3886/7511/files/278_2_600x600.webp?v=1691218604',
    social: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Mr. Vikram Singh',
    title: 'Special Guest',
    role: 'Industry Leader',
    bio: 'CEO of Fortune 500 company, PU alumnus and philanthropist',
    image: '/guests/guest-3.jpg',
    social: {
      linkedin: '#',
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function VIPGuests() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-light-bg via-primary-50/30 to-light-bg dark:from-dark-bg dark:via-primary-950/20 dark:to-dark-bg overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-800/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 dark:bg-secondary-800/20 rounded-full blur-3xl" />
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
            <span className="px-4 py-2 text-sm font-semibold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full border border-primary-200 dark:border-primary-800">
              ✨ Special Guests
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent mb-6">
            Distinguished Guests
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Meet the eminent personalities who will grace the convocation ceremony
          </p>
        </motion.div>

        {/* Guests Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {guests.map((guest, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                variant="elevated"
                className="group hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/30 transition-all duration-500 overflow-hidden h-full border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-gray-900"
              >
                <CardContent className="p-0">
                  {/* Guest Image */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-primary-100 via-primary-200 to-secondary-200 dark:from-primary-900 dark:via-primary-800 dark:to-secondary-900 overflow-hidden">
                    {/* Guest image */}
                    <Image
                      src={guest.image}
                      alt={guest.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Gradient overlay - always visible, enhanced on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-500" />
                    
                    {/* Decorative shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                    
                    {/* Title badge with better styling */}
                    <motion.div 
                      className="absolute top-4 left-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        {guest.title}
                      </span>
                    </motion.div>

                    {/* Social links - improved positioning and style */}
                    <div className="absolute bottom-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      {guest.social.linkedin && (
                        <motion.a
                          href={guest.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${guest.name}'s LinkedIn profile`}
                          className="w-11 h-11 rounded-full bg-white/95 dark:bg-black/95 flex items-center justify-center hover:bg-primary-500 hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Linkedin className="w-5 h-5 text-primary-600 hover:text-white transition-colors" />
                        </motion.a>
                      )}
                      {guest.social.twitter && (
                        <motion.a
                          href={guest.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${guest.name}'s Twitter profile`}
                          className="w-11 h-11 rounded-full bg-white/95 dark:bg-black/95 flex items-center justify-center hover:bg-primary-500 hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Twitter className="w-5 h-5 text-primary-600 hover:text-white transition-colors" />
                        </motion.a>
                      )}
                    </div>

                    {/* Name overlay at bottom - visible on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                        {guest.name}
                      </h3>
                      <p className="text-sm text-primary-300 font-semibold">
                        {guest.role}
                      </p>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                    <div className="space-y-4">
                      {/* Info visible when not hovering */}
                      <div className="group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {guest.name}
                        </h3>
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          {guest.role}
                        </p>
                      </div>
                      
                      {/* Bio */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                        {guest.bio}
                      </p>
                    </div>

                    {/* Decorative bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl" />
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-primary-200 dark:border-primary-800 shadow-lg">
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium flex items-center justify-center gap-3">
                <span className="text-2xl">🎭</span>
                <span>More distinguished guests will be announced soon. Stay tuned for updates.</span>
                <span className="text-2xl">✨</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
