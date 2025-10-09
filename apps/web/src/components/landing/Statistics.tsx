'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import * as React from 'react';

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: 2000, label: 'Graduates', suffix: '+' },
  { value: 50, label: 'Departments', suffix: '+' },
  { value: 15, label: 'Years of Excellence', suffix: '' },
  { value: 95, label: 'Placement Rate', suffix: '%' },
];

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState('0');
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const controls = animate(count, value, {
            duration: 2,
            ease: 'easeOut',
          });

          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [count, value, hasAnimated]);

  React.useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayValue(latest.toString());
    });

    return () => unsubscribe();
  }, [rounded]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent-pink rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Celebrating excellence and achievements across the university
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-base md:text-lg text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Join thousands of successful alumni who have made their mark in various fields around the world
          </p>
        </motion.div>
      </div>
    </section>
  );
}
