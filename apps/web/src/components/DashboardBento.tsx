'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import MagicBento, { BentoCardProps } from './MagicBento';

/**
 * Dashboard Bento Component
 * 
 * Displays all main pages/features of the convocation system
 * in a beautiful bento grid layout with interactive effects
 */

export interface DashboardBentoProps {
  userRole?: 'admin' | 'user';
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

// Define all pages/features of your convocation system - ADMIN
const adminCards: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Seat allocation overview and statistics',
    label: 'Overview'
  },
  {
    color: '#060010',
    title: 'Reserve Seats',
    description: 'Reserve specific seats for VIPs',
    label: 'Reservations'
  },
  {
    color: '#060010',
    title: 'Enclosures',
    description: 'Manage venue enclosures and seating',
    label: 'Venue Setup'
  },
  {
    color: '#060010',
    title: 'Aerial View',
    description: 'Visualize venue layout and seating',
    label: 'Visualization'
  },
  {
    color: '#060010',
    title: 'Aerial Editor',
    description: 'Edit and customize aerial view',
    label: 'Editor'
  },
  {
    color: '#060010',
    title: 'Upload Students',
    description: 'Bulk import student data via Excel',
    label: 'Data Import'
  },
  {
    color: '#060010',
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    label: 'Users'
  },
  {
    color: '#060010',
    title: 'Create Account',
    description: 'Create new user accounts',
    label: 'New User'
  },
  {
    color: '#060010',
    title: 'My Profile',
    description: 'View and update your profile',
    label: 'Profile'
  }
];

// Define all pages/features - REGULAR USER
const userCards: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Your personal dashboard',
    label: 'Home'
  },
  {
    color: '#060010',
    title: 'My Profile',
    description: 'View and update your profile',
    label: 'Profile'
  },
  {
    color: '#060010',
    title: 'My Seat',
    description: 'Check your allocated seat details',
    label: 'Seat Info'
  },
  {
    color: '#060010',
    title: 'Venue View',
    description: 'Explore the venue layout',
    label: 'Venue'
  },
  {
    color: '#060010',
    title: 'Settings',
    description: 'Customize your preferences',
    label: 'Settings'
  }
];

// Map cards to their routes - ADMIN
const adminRoutes = [
  '/admin/dashboard',
  '/admin/reserve-seats',
  '/admin/enclosures',
  '/admin/aerial-view',
  '/admin/aerial-view-editor',
  '/admin/upload-students',
  '/admin/users',
  '/admin/create-account',
  '/dashboard/profile'
];

// Map cards to their routes - USER
const userRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/attendee',
  '/admin/aerial-view',
  '/settings'
];

const DashboardBento: React.FC<DashboardBentoProps> = ({
  userRole = 'admin',
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = 300,
  particleCount = 12,
  enableTilt = false,
  glowColor = '132, 0, 255',
  clickEffect = true,
  enableMagnetism = true
}) => {
  const router = useRouter();
  
  // Select appropriate cards based on user role
  const cards = userRole === 'admin' ? adminCards : userCards;
  const routes = userRole === 'admin' ? adminRoutes : userRoutes;

  // Handle card click navigation
  const handleCardClick = (index: number) => {
    router.push(routes[index]);
  };

  return (
    <div className="w-full flex justify-center items-center py-8">
      <style>
        {`
          .dashboard-bento-wrapper .card {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .dashboard-bento-wrapper .card:hover {
            transform: translateY(-4px);
          }
          
          .dashboard-bento-wrapper .card:active {
            transform: translateY(-2px);
          }
        `}
      </style>
      
      <div 
        className="dashboard-bento-wrapper"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const card = target.closest('.card');
          if (card) {
            const cards = Array.from(card.parentElement?.children || []);
            const index = cards.indexOf(card);
            if (index !== -1) {
              handleCardClick(index);
            }
          }
        }}
      >
        <MagicBento
          cards={cards}
          textAutoHide={textAutoHide}
          enableStars={enableStars}
          enableSpotlight={enableSpotlight}
          enableBorderGlow={enableBorderGlow}
          disableAnimations={disableAnimations}
          spotlightRadius={spotlightRadius}
          particleCount={particleCount}
          enableTilt={enableTilt}
          glowColor={glowColor}
          clickEffect={clickEffect}
          enableMagnetism={enableMagnetism}
        />
      </div>
    </div>
  );
};

export default DashboardBento;
