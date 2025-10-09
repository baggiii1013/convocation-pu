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
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
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
    <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                  PU
                </div>
                <div>
                  <h3 className="text-xl font-bold">Punjab University</h3>
                  <p className="text-sm text-gray-400">Convocation 2025</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Join us in celebrating excellence and academic achievements at one of the most prestigious 
                convocation ceremonies in the region.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Icon className="w-5 h-5" />
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
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
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
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
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
          >
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index}>
                    <a
                      href={info.href}
                      target={info.icon === MapPin ? '_blank' : undefined}
                      rel={info.icon === MapPin ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-3 text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm group"
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <p className="font-medium text-white text-xs mb-0.5">{info.label}</p>
                        <p>{info.value}</p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Parul University. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex gap-6">
            {footerLinks.legal.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
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
