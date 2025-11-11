"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent-blue rounded-full blur-3xl opacity-30"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <a href="ums.paruluniversity.ac.in" target="_blank"
                rel="noopener noreferrer" className="text-sm font-medium">
              Registration Now Open , Last date November 10 2025
            </a>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Parul University
            <br />
            <span className="bg-gradient-to-r from-white via-primary-100 to-white bg-clip-text text-transparent">
              Convocation 2025
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto"
          >
            Join us in celebrating the achievements of our graduates as they
            embark on their journey to shape the future.
          </motion.p>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          >
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-5 h-5" />
              <span className="text-sm md:text-base font-medium">
                December 15, 2025
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30" />
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span className="text-sm md:text-base font-medium">
                Dhoom Ground, PU Campus
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="https://ums.paruluniversity.ac.in" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="default"
                className="bg-white text-primary-600 hover:bg-white/90 min-w-[200px]"
              >
                Register Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="https://www.instagram.com/paruluniversity/?hl=en" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 min-w-[200px] my-2"
              >
                Learn More
              </Button>
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2 text-white/60"
            >
              <span className="text-sm">Scroll to explore</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
