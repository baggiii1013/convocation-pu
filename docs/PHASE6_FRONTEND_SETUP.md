# Phase 6: Frontend Setup and Core Structure (Next.js)

## Overview

Phase 6 focuses on setting up the complete frontend infrastructure using Next.js 15 with App Router, implementing modern React patterns, authentication integration, and creating a scalable component architecture for the PU Convocation platform.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Core Components](#core-components)
4. [Authentication System](#authentication-system)
5. [Routing and Navigation](#routing-and-navigation)
6. [UI Component Library](#ui-component-library)
7. [State Management](#state-management)
8. [Middleware and Security](#middleware-and-security)
9. [Styling and Theming](#styling-and-theming)
10. [Development Workflow](#development-workflow)
11. [Testing Strategy](#testing-strategy)
12. [Performance Optimization](#performance-optimization)

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Dashboard route group
│   │   │   └── dashboard/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── layouts/           # Layout components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI primitives
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utility libraries
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Technology Stack

### Core Technologies
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library with concurrent features
- **TypeScript** - Type safety and development experience
- **Tailwind CSS 4** - Utility-first CSS framework

### Frontend Libraries
- **axios** - HTTP client for API communication
- **react-hook-form** - Form handling and validation
- **@hookform/resolvers** - Form validation resolvers
- **zod** - Schema validation
- **clsx** - Conditional className utility
- **tailwind-merge** - Tailwind class merging
- **framer-motion** - Animation library
- **class-variance-authority** - Component variant management

## Core Components

### 1. Layout Components

#### Root Layout (`src/app/layout.tsx`)
```tsx
// Global layout with providers and metadata
- ThemeProvider integration
- AuthProvider integration
- Global CSS and fonts
- SEO metadata configuration
```

#### Dashboard Layout (`src/components/layouts/DashboardLayout.tsx`)
```tsx
// Dashboard-specific layout
- Sidebar navigation
- Header with user menu
- Mobile-responsive design
- Footer integration
```

### 2. Shared Components

#### Header (`src/components/shared/Header.tsx`)
- Navigation menu
- User authentication status
- Theme toggle
- Mobile-responsive hamburger menu
- User dropdown with profile actions

#### Footer (`src/components/shared/Footer.tsx`)
- Brand information
- Quick links navigation
- Support links
- Copyright and legal information

#### Sidebar (`src/components/shared/Sidebar.tsx`)
- Dashboard navigation
- Role-based menu items
- Mobile overlay functionality
- Active route highlighting

## Authentication System

### Context Provider (`src/contexts/AuthContext.tsx`)

```tsx
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  studentId?: string;
  department?: string;
  program?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
```

### Custom Hook (`src/hooks/useAuth.ts`)
- Simplified authentication state access
- Type-safe user data
- Authentication status checks
- Role-based permission helpers

### API Integration (`src/lib/axios.ts`)
- Axios instance configuration
- Request/response interceptors
- Automatic token attachment
- Token refresh mechanism
- Error handling for 401/403 responses

## Routing and Navigation

### Route Groups
- `(auth)` - Authentication pages (login, register)
- `(dashboard)` - Protected dashboard pages

### Middleware (`src/middleware.ts`)
```typescript
// Route protection logic
- Public routes definition
- Protected routes authentication
- Admin-only route access
- Automatic redirects for authenticated users
```

### Navigation Structure
```
/ (home)
├── /login
├── /register
├── /dashboard
│   ├── /ceremonies
│   ├── /registrations
│   ├── /attendance
│   └── /profile
└── /admin (admin-only)
    ├── /users
    ├── /ceremonies
    └── /reports
```

## UI Component Library

### 1. Button Component (`src/components/ui/Button.tsx`)

```tsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}
```

**Features:**
- Multiple variants and sizes
- Loading states with spinner
- TypeScript prop validation
- Accessible button attributes

### 2. Input Component (`src/components/ui/Input.tsx`)

```tsx
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}
```

**Features:**
- Label association
- Error state styling
- Helper text support
- Required field indicators
- Form integration compatibility

### 3. Card Component (`src/components/ui/Card.tsx`)

```tsx
// Component family
- Card (container)
- CardHeader
- CardTitle
- CardDescription
- CardContent
- CardFooter
```

**Features:**
- Modular card system
- Consistent spacing and styling
- Dark mode support
- Flexible content arrangement

## State Management

### 1. Theme Context (`src/contexts/ThemeContext.tsx`)
```tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

**Features:**
- System preference detection
- localStorage persistence
- CSS class application
- Media query listening

### 2. Authentication Context
- User session management
- Token storage and refresh
- Role-based permissions
- Login/logout state handling

## Middleware and Security

### Route Protection (`src/middleware.ts`)

```typescript
// Security features
- Authentication verification
- Role-based access control
- Automatic redirects
- Token validation
- Protected route enforcement
```

**Route Categories:**
- **Public Routes:** Home, auth pages, static pages
- **Protected Routes:** Dashboard, profile, user-specific pages
- **Admin Routes:** Admin dashboard, user management, reports

## Styling and Theming

### Tailwind CSS Configuration
```typescript
// tailwind.config.ts
- Dark mode support
- Custom color palette
- Component-specific utilities
- Responsive design tokens
```

### Design System
- **Colors:** Slate-based palette with dark mode variants
- **Typography:** Consistent font scaling and spacing
- **Spacing:** Standardized margin and padding scale
- **Components:** Reusable design patterns

### Global Styles (`src/app/globals.css`)
```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS variables for theming */
/* Component-specific styles */
```

## Development Workflow

### 1. Component Development
```bash
# Create new component
touch src/components/ui/NewComponent.tsx

# Follow naming conventions
- PascalCase for components
- camelCase for props
- Descriptive file names
```

### 2. Form Implementation
```tsx
// Using react-hook-form + zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### 3. API Integration
```tsx
// Using axios with error handling
try {
  const response = await api.post('/auth/login', data);
  // Handle success
} catch (error) {
  // Handle error
}
```

## Testing Strategy

### 1. Component Testing
- Unit tests for UI components
- Integration tests for forms
- Accessibility testing
- Visual regression testing

### 2. Authentication Testing
- Login/logout flows
- Route protection verification
- Token refresh scenarios
- Permission-based access

### 3. API Integration Testing
- Mock API responses
- Error handling verification
- Loading state testing
- Data validation

## Performance Optimization

### 1. Next.js Optimizations
- **App Router:** Improved performance and developer experience
- **Server Components:** Reduced client-side JavaScript
- **Code Splitting:** Automatic route-based splitting
- **Image Optimization:** Built-in next/image optimization

### 2. Bundle Optimization
- **Tree Shaking:** Eliminate unused code
- **Dynamic Imports:** Lazy load components
- **Bundle Analysis:** Monitor bundle size
- **Caching:** Implement proper caching strategies

### 3. Loading States
- **Skeleton Screens:** Improve perceived performance
- **Loading Spinners:** Clear loading indicators
- **Progressive Enhancement:** Graceful degradation
- **Error Boundaries:** Robust error handling

## Implementation Checklist

### ✅ Completed Features

#### Project Setup
- [x] Next.js 15 with App Router configuration
- [x] TypeScript setup with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint and development tools

#### Core Infrastructure
- [x] Axios HTTP client with interceptors
- [x] Authentication context and hooks
- [x] Theme context with dark mode
- [x] Utility functions and helpers
- [x] Route protection middleware

#### UI Components
- [x] Button component with variants
- [x] Input component with validation
- [x] Card component family
- [x] Layout components (Header, Footer, Sidebar)
- [x] Dashboard layout with navigation

#### Authentication Pages
- [x] Login page with form validation
- [x] Register page with comprehensive form
- [x] Error handling and success states
- [x] Responsive design implementation

#### Dashboard
- [x] Main dashboard with stats
- [x] Navigation sidebar
- [x] User menu and profile access
- [x] Quick action cards

### 🚧 In Progress

#### Route Implementation
- [ ] Complete dashboard sub-pages
- [ ] Admin panel pages
- [ ] Profile management pages
- [ ] Settings and preferences

#### Advanced Features
- [ ] Form validation enhancements
- [ ] Data fetching with React Query
- [ ] Advanced state management
- [ ] Real-time updates

### 📋 Future Enhancements

#### User Experience
- [ ] Animation and transitions
- [ ] Advanced loading states
- [ ] Offline functionality
- [ ] Progressive Web App features

#### Developer Experience
- [ ] Storybook component documentation
- [ ] End-to-end testing
- [ ] Performance monitoring
- [ ] Accessibility improvements

## API Integration

### Authentication Endpoints
```typescript
// Login
POST /auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }

// Register
POST /auth/register
Body: { email: string, password: string, displayName: string, ... }
Response: { user: User, token: string }

// Refresh Token
POST /auth/refresh
Headers: { Authorization: Bearer <token> }
Response: { token: string }
```

### Error Handling
```typescript
// Axios interceptor error handling
- 401: Redirect to login
- 403: Show permission denied
- 500: Show server error message
- Network: Show connection error
```

## Security Considerations

### 1. Client-Side Security
- **Token Storage:** Secure token management
- **XSS Prevention:** Input sanitization
- **CSRF Protection:** Request validation
- **Content Security Policy:** Header configuration

### 2. Route Protection
- **Middleware Validation:** Server-side route protection
- **Role-Based Access:** Permission checking
- **Redirect Handling:** Secure navigation
- **Session Management:** Proper logout handling

## Deployment Considerations

### 1. Build Configuration
```bash
# Production build
bun run build

# Environment variables
NEXT_PUBLIC_API_URL=https://api.convocation.pu.edu.in
```

### 2. Static Asset Optimization
- Image optimization with next/image
- Font optimization with next/font
- CSS minification and purging
- JavaScript bundling and compression

## Troubleshooting Guide

### Common Issues

#### 1. Authentication Problems
```typescript
// Debug authentication state
console.log('Auth state:', { user, isAuthenticated, loading });

// Check token validity
console.log('Token:', localStorage.getItem('token'));
```

#### 2. Routing Issues
```typescript
// Debug middleware
console.log('Current path:', request.nextUrl.pathname);
console.log('User role:', request.cookies.get('userRole')?.value);
```

#### 3. API Connection
```typescript
// Check API base URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Debug request/response
api.interceptors.request.use(config => {
  console.log('Request:', config);
  return config;
});
```

## Best Practices

### 1. Component Design
- **Single Responsibility:** One purpose per component
- **Prop Drilling:** Use context for deep props
- **Composition:** Prefer composition over inheritance
- **TypeScript:** Strict type definitions

### 2. State Management
- **Local State:** useState for component-specific state
- **Global State:** Context for app-wide state
- **Server State:** React Query for API data
- **Form State:** react-hook-form for forms

### 3. Performance
- **Memoization:** useMemo and useCallback appropriately
- **Code Splitting:** Dynamic imports for large components
- **Image Optimization:** next/image for all images
- **Bundle Analysis:** Regular bundle size monitoring

## Conclusion

Phase 6 successfully establishes a robust, scalable frontend architecture for the PU Convocation platform. The implementation provides:

- **Modern React Patterns:** App Router, Server Components, TypeScript
- **Comprehensive Authentication:** Context-based auth with API integration
- **Reusable Components:** Type-safe UI component library
- **Security:** Route protection and role-based access
- **Developer Experience:** Hot reload, TypeScript, ESLint
- **User Experience:** Responsive design, dark mode, accessibility

The foundation is now ready for Phase 7, which will focus on implementing the complete ceremony management system and advanced dashboard features.

---

**Next Phase:** [Phase 7: Advanced Dashboard and Ceremony Management](./PHASE7_DASHBOARD_CEREMONIES.md)
