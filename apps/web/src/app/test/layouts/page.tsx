'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Download, Plus, RefreshCw, Upload } from 'lucide-react';

export default function LayoutTest() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { title: 'Testing', href: '/test' },
        { title: 'Layouts' }
      ]}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Phase 3: Layout Components Test
        </h1>
        <p className="text-lg text-muted-foreground">
          Testing all layout components with responsive design
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
        <Button variant="secondary">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <Button variant="ghost">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2,543</div>
            <Badge variant="success" size="sm" className="mt-2">
              +12.5%
            </Badge>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12</div>
            <Badge variant="info" size="sm" className="mt-2">
              3 upcoming
            </Badge>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,284</div>
            <Badge variant="warning" size="sm" className="mt-2">
              45 pending
            </Badge>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">94.2%</div>
            <Badge variant="success" size="sm" className="mt-2">
              +2.3%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Content Cards */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
            <CardDescription>
              All Phase 3 components have been implemented
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Badge variant="success" size="sm">✓</Badge>
                <span>Responsive Header with search</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="success" size="sm">✓</Badge>
                <span>Collapsible Sidebar navigation</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="success" size="sm">✓</Badge>
                <span>Mobile Bottom Navigation</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="success" size="sm">✓</Badge>
                <span>Breadcrumb navigation</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="success" size="sm">✓</Badge>
                <span>Theme toggle (dark/light)</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="success" size="sm">✓</Badge>
                <span>User menu dropdown</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              Verify these features across different screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Desktop (&gt;1024px)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sidebar visible on left</li>
                  <li>• Header with search bar</li>
                  <li>• No bottom navigation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tablet (768-1024px)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sidebar toggles with button</li>
                  <li>• Header visible</li>
                  <li>• Bottom nav appears</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mobile (&lt;768px)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sidebar overlay on menu click</li>
                  <li>• Compact header</li>
                  <li>• Bottom nav fixed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animation Test Card */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Animation & Interaction Test</CardTitle>
          <CardDescription>
            All interactions use smooth transitions and Framer Motion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Try these interactions:
            </p>
            <ul className="text-sm space-y-2">
              <li>✓ Hover over navigation items (see highlight animation)</li>
              <li>✓ Click theme toggle (smooth icon transition)</li>
              <li>✓ Open/close sidebar (slide animation)</li>
              <li>✓ Click on bottom nav items (animated indicator)</li>
              <li>✓ Scroll page (header backdrop blur)</li>
              <li>✓ Open user menu (fade in animation)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
