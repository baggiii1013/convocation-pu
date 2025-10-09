'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
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
    name: 'Prof. Anjali Sharma',
    title: 'Guest of Honor',
    role: 'Dean of Engineering',
    bio: 'Leading researcher in computer science and artificial intelligence',
    image: '/guests/guest-2.jpg',
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
            Distinguished Guests
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Meet the eminent personalities who will grace the convocation ceremony
          </p>
        </motion.div>

        {/* Guests Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {guests.map((guest, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                variant="elevated"
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full"
              >
                <CardContent className="p-0">
                  {/* Guest Image */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 overflow-hidden">
                    {/* Placeholder for guest image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl">
                          👤
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {guest.name}
                        </p>
                      </div>
                    </div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Title badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-black/90 text-primary-600 dark:text-primary-400 rounded-full">
                        {guest.title}
                      </span>
                    </div>

                    {/* Social links on hover */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {guest.social.linkedin && (
                        <a
                          href={guest.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${guest.name}'s LinkedIn profile`}
                          className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors duration-200"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {guest.social.twitter && (
                        <a
                          href={guest.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${guest.name}'s Twitter profile`}
                          className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors duration-200"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {guest.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3">
                      {guest.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {guest.bio}
                    </p>
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
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            More distinguished guests will be announced soon. Stay tuned for updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
