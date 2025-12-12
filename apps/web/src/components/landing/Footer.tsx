'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

const footerLinks = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
  ],
  resources: [
    { label: 'Registration', href: '/register' },
    { label: 'Guidelines', href: '/guidelines' },
    { label: 'Accommodation', href: '/accommodation' },
    { label: 'Travel Info', href: '/travel' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/ParulUniversity/', label: 'Facebook' },
  { icon: Twitter, href: 'https://x.com/ParulUniversity', label: 'Twitter' },
  { icon: Instagram, href: 'https://www.instagram.com/ParulUniversity', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/school/paruluniversity/', label: 'LinkedIn' },
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'convocation@pu.edu.in',
    href: 'mailto:convocation@pu.edu.in',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 123 456 7890',
    href: 'tel:+911234567890',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Parul University, Vadodara, India',
    href: 'https://maps.google.com',
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-12 pb-6 md:pt-16 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 sm:col-span-2 pb-4 sm:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-base md:text-xl flex-shrink-0">
                  PU
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-bold leading-tight">Parul University</h3>
                  <p className="text-xs md:text-sm text-gray-400">Convocation 2025</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 md:mb-6 max-w-sm text-xs md:text-sm leading-relaxed">
                Join us in celebrating excellence and academic achievements at one of the most prestigious 
                convocation ceremonies in the region.
              </p>

              {/* Social Links */}
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-xs md:text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-xs md:text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <h4 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2.5 md:space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index}>
                    <a
                      href={info.href}
                      target={info.icon === MapPin ? '_blank' : undefined}
                      rel={info.icon === MapPin ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-2 text-gray-400 hover:text-primary-400 transition-colors duration-200 text-xs md:text-sm group"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-xs mb-0.5">{info.label}</p>
                        <p className="break-words break-all">{info.value}</p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6 md:my-8" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-4"
        >
          {/* Copyright */}
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="text-gray-400 text-xs md:text-sm mb-1.5 md:mb-2">
              © {new Date().getFullYear()} Parul University. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs md:text-sm mb-1.5 md:mb-2">
              Cordinators : Dr. Swapnil M Parikh, Ms. Sumitra Menaria, Mr. Mohit Rathod
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Designed and developed by{' '}
              <a
                href="https://github.com/baggiii1013"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium hover:underline"
              >
                Kaustubh Bagale
              </a>
              {' '}with{' '}
              <span className="text-red-500 inline-block animate-pulse">❤️</span>
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-3 md:gap-6 justify-center order-1 md:order-2">
            {footerLinks.legal.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-xs md:text-sm whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
