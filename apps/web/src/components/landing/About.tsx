'use client';

import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Globe, Users } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

const features = [
  {
    icon: Award,
    title: 'Academic Excellence',
    description: 'Recognized globally for outstanding education and research',
  },
  {
    icon: Users,
    title: 'Diverse Community',
    description: 'Students from across India and around the world',
  },
  {
    icon: BookOpen,
    title: 'Wide Range of Programs',
    description: '50+ departments offering undergraduate and postgraduate courses',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Strong alumni network spanning across continents',
  },
];

const slideshowImages = [
  '/assests/slideshow/DJI_0918.jpg',
  '/assests/slideshow/DSC00972.jpg',
  '/assests/slideshow/DSC00980.jpg',
  '/assests/slideshow/DSC04230 (1).jpg',
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 2000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
      {slideshowImages.map((image, index) => (
        <motion.div
          key={image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Image
            src={image}
            alt={`Campus view ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slideshowImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}

export function About() {
  return (
    <section className="py-20 bg-white dark:bg-dark-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main image carousel */}
            <ImageCarousel />

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-8 -right-8 bg-white dark:bg-dark-surface rounded-xl shadow-lg p-6 max-w-[250px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                  10+
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years of</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                About Parul University
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Shaping Future Leaders Since 2010
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Parul University has been at the forefront of education, nurturing talent and fostering innovation. 
              Our commitment to academic excellence and holistic development has made us one of the leading 
              institutions in the region.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" variant="default">
                Learn More About Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
