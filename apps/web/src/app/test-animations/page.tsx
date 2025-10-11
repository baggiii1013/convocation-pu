"use client";

import {
    FadeIn,
    HoverLiftCard,
    MagneticButton,
    PageTransition,
    ScaleIn,
    StaggerChildren,
    StaggerItem,
    TiltCard,
} from "@/components/animations";
import { AnimatedInput } from "@/components/ui/AnimatedInput";
import { AnimatedModal } from "@/components/ui/AnimatedModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { DotsSpinner, PulseSpinner, Spinner } from "@/components/ui/Spinner";
import { Heart, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export default function AnimationShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 py-12">
        <div className="container mx-auto px-4 space-y-16">
          {/* Hero Section */}
          <FadeIn direction="down" delay={0.1}>
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-accent-pink bg-clip-text text-transparent">
                Phase 7 Animation Showcase
              </h1>
              <p className="text-xl text-muted-foreground">
                All animations in one place
              </p>
            </div>
          </FadeIn>

          {/* Button Animations */}
          <section className="space-y-6">
            <FadeIn direction="up" delay={0.2}>
              <h2 className="text-3xl font-bold">Button Animations</h2>
              <p className="text-muted-foreground">
                Click buttons to see ripple effects
              </p>
            </FadeIn>

            <StaggerChildren className="flex flex-wrap gap-4">
              <StaggerItem>
                <Button>Primary with Ripple</Button>
              </StaggerItem>
              <StaggerItem>
                <Button variant="secondary">Secondary</Button>
              </StaggerItem>
              <StaggerItem>
                <Button variant="outline">Outline</Button>
              </StaggerItem>
              <StaggerItem>
                <Button variant="ghost">Ghost</Button>
              </StaggerItem>
              <StaggerItem>
                <Button variant="danger">Danger</Button>
              </StaggerItem>
              <StaggerItem>
                <Button variant="success">Success</Button>
              </StaggerItem>
            </StaggerChildren>

            <div className="pt-4">
              <FadeIn direction="up" delay={0.4}>
                <p className="text-sm text-muted-foreground mb-4">
                  Magnetic Button (hover to see effect):
                </p>
                <MagneticButton strength={0.3}>
                  <Button size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                    Hover Over Me!
                  </Button>
                </MagneticButton>
              </FadeIn>
            </div>
          </section>

          {/* Card Animations */}
          <section className="space-y-6">
            <FadeIn direction="up" delay={0.3}>
              <h2 className="text-3xl font-bold">Card Hover Effects</h2>
              <p className="text-muted-foreground">
                Hover over cards to see lift and tilt effects
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScaleIn delay={0.4}>
                <HoverLiftCard liftAmount={-12}>
                  <Card className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-primary-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Hover Lift</h3>
                    <p className="text-sm text-muted-foreground">
                      This card lifts up on hover with shadow
                    </p>
                  </Card>
                </HoverLiftCard>
              </ScaleIn>

              <ScaleIn delay={0.5}>
                <TiltCard tiltAmount={15}>
                  <Card className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-accent-blue/10 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-accent-blue" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">3D Tilt</h3>
                    <p className="text-sm text-muted-foreground">
                      This card tilts with your mouse movement
                    </p>
                  </Card>
                </TiltCard>
              </ScaleIn>

              <ScaleIn delay={0.6}>
                <HoverLiftCard>
                  <Card className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Smooth Scale</h3>
                    <p className="text-sm text-muted-foreground">
                      Subtle scale effect with shadow
                    </p>
                  </Card>
                </HoverLiftCard>
              </ScaleIn>
            </div>
          </section>

          {/* Animated Input */}
          <section className="space-y-6">
            <FadeIn direction="up" delay={0.4}>
              <h2 className="text-3xl font-bold">Animated Inputs</h2>
              <p className="text-muted-foreground">
                Focus on inputs to see floating labels
              </p>
            </FadeIn>

            <div className="max-w-2xl space-y-4">
              <ScaleIn delay={0.5}>
                <AnimatedInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  error={emailError}
                  helperText="We'll never share your email"
                />
              </ScaleIn>

              <ScaleIn delay={0.6}>
                <AnimatedInput
                  label="Full Name"
                  success="Looks good!"
                />
              </ScaleIn>

              <ScaleIn delay={0.7}>
                <AnimatedInput
                  label="Phone Number"
                  type="tel"
                  helperText="Optional field"
                />
              </ScaleIn>
            </div>
          </section>

          {/* Loading States */}
          <section className="space-y-6">
            <FadeIn direction="up" delay={0.5}>
              <h2 className="text-3xl font-bold">Loading States</h2>
              <p className="text-muted-foreground">
                Skeleton screens and spinners
              </p>
            </FadeIn>

            <div className="space-y-8">
              {/* Spinners */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Spinners</h3>
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="space-y-2 text-center">
                    <Spinner size="md" variant="primary" />
                    <p className="text-sm text-muted-foreground">Default</p>
                  </div>
                  <div className="space-y-2 text-center">
                    <DotsSpinner size="md" />
                    <p className="text-sm text-muted-foreground">Dots</p>
                  </div>
                  <div className="space-y-2 text-center">
                    <PulseSpinner size="md" />
                    <p className="text-sm text-muted-foreground">Pulse</p>
                  </div>
                </div>
              </div>

              {/* Skeletons */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Skeleton Screens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SkeletonCard />
                  <div className="space-y-3">
                    <Skeleton variant="rectangular" className="h-12" animation="wave" />
                    <Skeleton variant="text" animation="pulse" className="w-4/5" />
                    <Skeleton variant="text" animation="shimmer" />
                    <div className="flex gap-3">
                      <Skeleton variant="circular" className="w-10 h-10" />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" className="w-3/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modal */}
          <section className="space-y-6">
            <FadeIn direction="up" delay={0.6}>
              <h2 className="text-3xl font-bold">Animated Modal</h2>
              <p className="text-muted-foreground">
                Click button to see modal animation
              </p>
            </FadeIn>

            <ScaleIn delay={0.7}>
              <Button onClick={() => setIsModalOpen(true)} size="lg">
                Open Animated Modal
              </Button>
            </ScaleIn>

            <AnimatedModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Beautiful Modal"
              size="md"
            >
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This modal animates in with a spring effect and fades out smoothly.
                  You can close it by clicking the X, pressing Escape, or clicking
                  the backdrop.
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => setIsModalOpen(false)}>
                    Close Modal
                  </Button>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </AnimatedModal>
          </section>

          {/* Stagger Effect Demo */}
          <section className="space-y-6">
            <FadeIn direction="up" delay={0.7}>
              <h2 className="text-3xl font-bold">Stagger Animation</h2>
              <p className="text-muted-foreground">
                Items appear one after another
              </p>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <StaggerItem key={num}>
                  <Card className="p-6 text-center">
                    <div className="text-4xl font-bold text-primary-500">
                      {num}
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>

          {/* Footer */}
          <FadeIn direction="up" delay={0.8}>
            <div className="text-center space-y-2 py-12">
              <p className="text-muted-foreground">
                All animations powered by Framer Motion
              </p>
              <p className="text-sm text-muted-foreground">
                Phase 7 Implementation Complete ✅
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
