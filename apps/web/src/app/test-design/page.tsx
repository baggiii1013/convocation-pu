'use client';

export default function DesignTestPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-card/80 backdrop-blur-lg border-b border-dark-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient-primary">
              Design System Test - Dark Mode
            </h1>
          </div>
        </div>
      </header>

      <main className="container-custom section-spacing">
          {/* Color Palette Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Color Palette</h2>
            
            {/* Primary Colors */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Primary Purple</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="space-y-2">
                    <div
                      className={`h-20 rounded-lg border border-dark-border`}
                      style={{ 
                        backgroundColor: `rgb(var(--primary-${shade}))` 
                      }}
                    />
                    <p className="text-sm text-center font-medium">{shade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Accent Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-blue border border-dark-border" />
                  <p className="text-sm text-center font-medium">Blue</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-pink border border-dark-border" />
                  <p className="text-sm text-center font-medium">Pink</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-green border border-dark-border" />
                  <p className="text-sm text-center font-medium">Green</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-orange border border-dark-border" />
                  <p className="text-sm text-center font-medium">Orange</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-red border border-dark-border" />
                  <p className="text-sm text-center font-medium">Red</p>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Typography</h2>
            <div className="space-y-4">
              <div>
                <p className="text-display-large">Display Large</p>
                <p className="text-sm text-muted-foreground">text-display-large</p>
              </div>
              <div>
                <p className="text-display-medium">Display Medium</p>
                <p className="text-sm text-muted-foreground">text-display-medium</p>
              </div>
              <div>
                <h1 className="text-5xl font-bold">Heading 1</h1>
                <p className="text-sm text-muted-foreground">text-5xl font-bold</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold">Heading 2</h2>
                <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">Heading 3</h3>
                <p className="text-sm text-muted-foreground">text-3xl font-bold</p>
              </div>
              <div>
                <p className="text-lg">Large body text - Inter font family</p>
                <p className="text-sm text-muted-foreground">text-lg</p>
              </div>
              <div>
                <p className="text-base">Regular body text - Inter font family</p>
                <p className="text-sm text-muted-foreground">text-base</p>
              </div>
              <div>
                <p className="text-sm">Small text - Inter font family</p>
                <p className="text-sm text-muted-foreground">text-sm</p>
              </div>
            </div>
          </section>

          {/* Cards & Glassmorphism */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Cards & Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Standard Card */}
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover-lift">
                <h3 className="text-xl font-semibold mb-2">Standard Card</h3>
                <p className="text-muted-foreground">
                  A card with hover lift effect and border.
                </p>
              </div>

              {/* Glass Card */}
              <div className="glass-card rounded-xl p-6 hover-lift">
                <h3 className="text-xl font-semibold mb-2">Glass Card</h3>
                <p className="text-muted-foreground">
                  Glassmorphism effect with backdrop blur.
                </p>
              </div>

              {/* Gradient Card */}
              <div className="bg-gradient-primary rounded-xl p-6 text-white hover-lift hover-glow">
                <h3 className="text-xl font-semibold mb-2">Gradient Card</h3>
                <p className="text-white/90">
                  Purple gradient with hover glow effect.
                </p>
              </div>
            </div>
          </section>

          {/* Shadows */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Shadow System</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-dark-card p-6 rounded-xl shadow-sm">
                <p className="font-medium">shadow-sm</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl shadow-md">
                <p className="font-medium">shadow-md</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl shadow-lg">
                <p className="font-medium">shadow-lg</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl shadow-xl">
                <p className="font-medium">shadow-xl</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl shadow-2xl">
                <p className="font-medium">shadow-2xl</p>
              </div>
              <div className="bg-primary-500 text-white p-6 rounded-xl shadow-glow-md">
                <p className="font-medium">shadow-glow-md</p>
              </div>
              <div className="bg-accent-blue text-white p-6 rounded-xl shadow-blue">
                <p className="font-medium">shadow-blue</p>
              </div>
              <div className="bg-accent-pink text-white p-6 rounded-xl shadow-pink">
                <p className="font-medium">shadow-pink</p>
              </div>
            </div>
          </section>

          {/* Animations */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Animations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-dark-card p-6 rounded-xl animate-fade-in">
                <p className="font-medium">fade-in</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl animate-slide-up">
                <p className="font-medium">slide-up</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl animate-scale-in">
                <p className="font-medium">scale-in</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl animate-pulse-slow">
                <p className="font-medium">pulse-slow</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl shimmer">
                <p className="font-medium">shimmer</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl hover:animate-wiggle cursor-pointer">
                <p className="font-medium">wiggle (hover)</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl interactive cursor-pointer">
                <p className="font-medium">interactive</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl hover-lift hover-glow cursor-pointer">
                <p className="font-medium">lift + glow</p>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Button Styles (Preview)</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all duration-200 hover:scale-102 active:scale-98">
                Primary Button
              </button>
              <button className="px-6 py-3 rounded-lg bg-gradient-primary text-white hover:shadow-glow-md transition-all duration-200 hover:scale-102 active:scale-98">
                Gradient Button
              </button>
              <button className="px-6 py-3 rounded-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200">
                Outline Button
              </button>
              <button className="px-6 py-3 rounded-lg text-primary-500 hover:bg-primary-900/20 transition-all duration-200">
                Ghost Button
              </button>
              <button className="px-6 py-3 rounded-lg bg-accent-green text-white hover:bg-accent-green/90 transition-all duration-200 hover:scale-102">
                Success Button
              </button>
              <button className="px-6 py-3 rounded-lg bg-accent-red text-white hover:bg-accent-red/90 transition-all duration-200 hover:scale-102">
                Danger Button
              </button>
            </div>
          </section>

          {/* Gradients */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Gradient Backgrounds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-primary rounded-xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-2">bg-gradient-primary</h3>
                <p className="text-white/90">Primary purple gradient</p>
              </div>
              <div className="bg-gradient-accent rounded-xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-2">bg-gradient-accent</h3>
                <p className="text-white/90">Purple to pink gradient</p>
              </div>
              <div className="bg-gradient-hero rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-2">bg-gradient-hero</h3>
                <p className="text-muted-foreground">Subtle hero gradient overlay</p>
              </div>
              <div className="bg-gradient-subtle rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-2">bg-gradient-subtle</h3>
                <p className="text-muted-foreground">Very subtle background gradient</p>
              </div>
            </div>
          </section>

          {/* Text Gradients */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Text Gradients</h2>
            <div className="space-y-4">
              <h3 className="text-5xl font-bold text-gradient-primary">
                Primary Text Gradient
              </h3>
              <h3 className="text-5xl font-bold text-gradient-accent">
                Accent Text Gradient
              </h3>
            </div>
          </section>

          {/* Spacing System */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Spacing System (8px grid)</h2>
            <div className="space-y-4">
              {[1, 2, 4, 6, 8, 12, 16, 24].map((space) => (
                <div key={space} className="flex items-center gap-4">
                  <div
                    className="bg-primary-500 h-8"
                    style={{ width: `${space * 0.25}rem` }}
                  />
                  <p className="font-mono text-sm">
                    {space} = {space * 0.25}rem = {space * 4}px
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Border Radius</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-primary-500 text-white p-6 rounded-sm">
                <p className="font-medium">rounded-sm</p>
                <p className="text-sm text-white/80">0.5rem</p>
              </div>
              <div className="bg-primary-500 text-white p-6 rounded-md">
                <p className="font-medium">rounded-md</p>
                <p className="text-sm text-white/80">0.75rem</p>
              </div>
              <div className="bg-primary-500 text-white p-6 rounded-lg">
                <p className="font-medium">rounded-lg</p>
                <p className="text-sm text-white/80">1rem</p>
              </div>
              <div className="bg-primary-500 text-white p-6 rounded-xl">
                <p className="font-medium">rounded-xl</p>
                <p className="text-sm text-white/80">1.5rem</p>
              </div>
              <div className="bg-primary-500 text-white p-6 rounded-2xl">
                <p className="font-medium">rounded-2xl</p>
                <p className="text-sm text-white/80">2rem</p>
              </div>
              <div className="bg-primary-500 text-white p-6 rounded-3xl">
                <p className="font-medium">rounded-3xl</p>
                <p className="text-sm text-white/80">3rem</p>
              </div>
            </div>
          </section>

          {/* Success Message */}
          <section>
            <div className="bg-gradient-primary rounded-2xl p-8 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">🎉 Phase 1 Complete!</h2>
              <p className="text-xl text-white/90 mb-6">
                Design system foundation is successfully implemented
              </p>
              <ul className="text-left max-w-2xl mx-auto space-y-2 text-white/90">
                <li>✅ Color palette configured</li>
                <li>✅ Typography system ready</li>
                <li>✅ Spacing and layout tokens defined</li>
                <li>✅ Animation system implemented</li>
                <li>✅ Utility classes created</li>
                <li>✅ Dark mode support enabled</li>
                <li>✅ Inter font loaded</li>
              </ul>
            </div>
          </section>
        </main>

        {/* Footer */}
      {/* Footer */}
      <footer className="border-t border-dark-border mt-16">
        <div className="container-custom py-8">
          <p className="text-center text-muted-foreground">
            PU Convocation Design System - Dark Mode Only
          </p>
        </div>
      </footer>
    </div>
  );
}
