'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';

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

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white pb-6 md:pt-8 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">

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
              Co-ordinators : Dr. Swapnil M Parikh, Ms. Sumitra Menaria, Mr. Mohit Rathod
            </p>
            <p className="text-white text-lg leading-relaxed">
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
