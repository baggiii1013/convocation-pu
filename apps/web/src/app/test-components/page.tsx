'use client';

import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/Skeleton';
import { Toaster, showToast } from '@/components/ui/Toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { ArrowRight, Download, Info, Lock, Mail, Plus, Search, Settings, Trash2, User } from 'lucide-react';
import { useState } from 'react';

export default function ComponentTestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <Toaster />
      <TooltipProvider>
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-primary-400 to-accent-pink bg-clip-text text-transparent">
              Phase 2 UI Components
            </h1>
            <p className="text-gray-400 text-lg">
              District.in-inspired design system showcase
            </p>
          </div>

          {/* Buttons Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Buttons</h2>
            <Card variant="default">
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>All button styles with different variants and sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variants */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button leftIcon={<Download />}>Download</Button>
                    <Button rightIcon={<ArrowRight />}>Continue</Button>
                    <Button variant="outline" leftIcon={<Plus />}>Add New</Button>
                    <Button variant="danger" leftIcon={<Trash2 />}>Delete</Button>
                  </div>
                </div>

                {/* States */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button loading={loading} onClick={handleLoadingDemo}>
                      {loading ? 'Loading...' : 'Click to Load'}
                    </Button>
                    <Button disabled>Disabled</Button>
                    <Button fullWidth>Full Width Button</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Standard card with border and shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">This is a default card variant with standard styling.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass Card</CardTitle>
                  <CardDescription>Glassmorphism effect with backdrop blur</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Beautiful glass effect with transparency.</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>Card with hover lift effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Hover over me to see the elevation effect!</p>
                </CardContent>
              </Card>

              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Gradient Card</CardTitle>
                  <CardDescription>Card with gradient background</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Stylish gradient background effect.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Form Inputs Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Form Inputs</h2>
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>Various input states and configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  clearable
                  onClear={() => setEmail('')}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  helperText="Must be at least 8 characters"
                />

                <Input
                  label="Search"
                  placeholder="Search something..."
                  leftIcon={<Search className="h-4 w-4" />}
                />

                <Input
                  label="With Error"
                  placeholder="This field has an error"
                  error="This field is required"
                  leftIcon={<User className="h-4 w-4" />}
                />

                <Input
                  label="Success State"
                  placeholder="This is valid"
                  variant="success"
                  leftIcon={<User className="h-4 w-4" />}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Select Option
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="grape">Grape</SelectItem>
                      <SelectItem value="mango">Mango</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dialog/Modal Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Dialogs & Modals</h2>
            <Card>
              <CardContent className="pt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="danger">Confirm Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </section>

          {/* Toast Notifications Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Toast Notifications</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => showToast.success('Operation completed successfully!')}>
                    Success Toast
                  </Button>
                  <Button onClick={() => showToast.error('Something went wrong!')}>
                    Error Toast
                  </Button>
                  <Button onClick={() => showToast.warning('Please review your changes')}>
                    Warning Toast
                  </Button>
                  <Button onClick={() => showToast.info('New update available')}>
                    Info Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tooltip Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Tooltips</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a tooltip!</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More information</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Badges</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Avatar Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Avatars</h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-end gap-4">
                    <Avatar size="sm">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <Avatar size="md">
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <Avatar size="lg">
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <Avatar size="xl">
                      <AvatarFallback>XL</AvatarFallback>
                    </Avatar>
                    <Avatar size="2xl">
                      <AvatarFallback>2XL</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">With Status</h3>
                  <div className="flex flex-wrap gap-4">
                    <Avatar status="online">
                      <AvatarFallback>ON</AvatarFallback>
                    </Avatar>
                    <Avatar status="offline">
                      <AvatarFallback>OFF</AvatarFallback>
                    </Avatar>
                    <Avatar status="away">
                      <AvatarFallback>AW</AvatarFallback>
                    </Avatar>
                    <Avatar status="busy">
                      <AvatarFallback>BS</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Group</h3>
                  <div className="flex -space-x-2">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>+5</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Skeleton Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Skeleton Loaders</h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSkeleton(!showSkeleton)}
                  >
                    {showSkeleton ? 'Hide' : 'Show'} Skeleton
                  </Button>
                </div>

                {showSkeleton ? (
                  <div className="space-y-6">
                    <SkeletonCard />
                    <SkeletonText lines={4} />
                    <div className="flex items-center gap-4">
                      <Skeleton variant="circular" className="h-12 w-12" />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" className="h-4 w-3/4" />
                        <Skeleton variant="text" className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Click the button to see skeleton loaders</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-400">
              🎨 Phase 2 UI Components Complete • District.in Inspired Design
            </p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
