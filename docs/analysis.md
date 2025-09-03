# PU Convocation System Analysis & Conversion Plan

## Project Overview

**Source Repository**: https://github.com/mussiii1013/pu-convocation  
**Target Architecture**: Modern full-stack monorepo with Next.js, Express, and Prisma  
**Database**: MongoDB with Prisma ORM  
**Runtime**: Bun + TypeScript  

## 1. Core Features Analysis

### 1.1 Authentication & Authorization
- **Passkey Authentication**: Advanced authentication using WebAuthn
- **IAM System**: Role-based access control with policies
- **Account Management**: User registration, invitation system
- **JWT Tokens**: Multiple token types (refresh, authorization, invitation, service authorization)

### 1.2 Convocation Management
- **Attendee Management**: CSV upload, seat allocation, attendee tracking
- **Seat Allocation Algorithm**: Automated seat assignment based on availability and reserved spots
- **Ground Mapping**: Dynamic venue configuration with enclosures and rows
- **Transaction Management**: Payment processing and transaction tracking

### 1.3 Analytics & Monitoring
- **Traffic Analytics**: Daily visitors, popular countries, language preferences
- **Telemetry Data**: Real-time monitoring and analytics collection
- **Geographical Analytics**: Country and state-wise traffic analysis

### 1.4 Content Management
- **Remote Configuration**: Dynamic system configuration
- **Asset Management**: Image uploads and static asset handling
- **Internationalization**: Multi-language support

### 1.5 Admin Console
- **Dashboard**: Analytics overview and system monitoring
- **Account Manager**: User management and permissions
- **Settings**: System configuration and ground mapping
- **Attendee Console**: Attendee management and allocation

## 2. Database Models & Schemas

### 2.1 Core Entities

#### Account
```typescript
{
  _id: ObjectId
  email: string
  displayName: string
  profileImageURL?: string
  assignedIAMPolicies: string[]
  accountState: AccountState
  createdAt: Date
  updatedAt: Date
}
```

#### Attendee
```typescript
{
  _id: ObjectId
  enrollmentId: string
  name: string
  course: string
  school: string
  degree: string
  allocation?: SeatAllocation
  createdAt: Date
  updatedAt: Date
}
```

#### SeatAllocation
```typescript
{
  enclosure: string
  row: string
  seat: number
  allocatedAt: Date
}
```

#### RemoteConfig
```typescript
{
  _id: ObjectId
  active: boolean
  images: {
    bannerImageURL: string
    logoImageURL: string
  }
  countdown: {
    enabled: boolean
    targetDate: Date
    title: string
    description: string
  }
  groundMappings: Enclosure[]
  attendees: {
    locked: boolean
    csvFile?: string
  }
  showInstructions: boolean
  updatedAt: Date
}
```

#### Enclosure
```typescript
{
  letter: string
  allocatedFor: "STUDENTS" | "STAFF" | "GUESTS"
  entryDirection: "NORTH" | "SOUTH" | "EAST" | "WEST"
  rows: Row[]
}
```

#### Row
```typescript
{
  letter: string
  start: number
  end: number
  reserved: string
}
```

#### Transaction
```typescript
{
  _id: ObjectId
  attendeeId: ObjectId
  amount: number
  currency: string
  status: "PENDING" | "COMPLETED" | "FAILED"
  paymentMethod: string
  transactionId: string
  createdAt: Date
  updatedAt: Date
}
```

#### Analytics
```typescript
{
  _id: ObjectId
  date: Date
  visitors: number
  pageViews: number
  uniqueVisitors: number
  countries: Record<string, number>
  languages: Record<string, number>
  devices: Record<string, number>
}
```

#### IAMPolicy
```typescript
{
  _id: ObjectId
  name: string
  description: string
  permissions: string[]
  createdAt: Date
}
```

### 2.2 Prisma Schema Translation

The existing MongoDB collections will be converted to Prisma models:
- `accounts` → Account model
- `attendees` → Attendee model  
- `remote_config` → RemoteConfig model
- `transactions` → Transaction model
- `analytics` → Analytics model
- `iam_policies` → IAMPolicy model

## 3. API Endpoints

### 3.1 Authentication Service
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
POST /auth/invite
POST /auth/verify-invitation
```

### 3.2 Account Management
```
GET    /accounts
POST   /accounts
PUT    /accounts/:id
DELETE /accounts/:id
GET    /accounts/:id
PUT    /accounts/:id/iam-policies
```

### 3.3 Attendee Management
```
GET    /attendees
POST   /attendees
PUT    /attendees/:id
DELETE /attendees/:id
POST   /attendees/upload-csv
POST   /attendees/allocate-seats
GET    /attendees/allocation
```

### 3.4 Remote Configuration
```
GET    /config
PUT    /config/images
PUT    /config/countdown
PUT    /config/ground-mappings
PUT    /config/instructions
```


### 3.6 Transactions
```
GET    /transactions
POST   /transactions
PUT    /transactions/:id
GET    /transactions/:id
GET    /transactions/attendee/:attendeeId
```

### 3.7 Assets
```
POST   /assets/images/upload
GET    /assets/images/:id
DELETE /assets/images/:id
```

## 4. UI Components & Pages

### 4.1 Public Pages
- **Landing Page**: Event information and countdown
- **Authentication**: Login/register with passkey support
- **Instructions**: Event guidelines and information

### 4.2 Admin Console
- **Dashboard**: Analytics overview with charts
- **Attendee Manager**: List, search, upload, allocate seats
- **Account Manager**: User management and permissions
- **Settings**: 
  - Ground mapping configuration
  - Instructions management
  - Image uploads
  - Countdown configuration

### 4.3 UI Component Library
- **Forms**: Input, Select, Checkbox, FilePicker
- **Data Display**: Tables, Cards, Charts
- **Navigation**: Navbar, Sidebar, Breadcrumbs
- **Feedback**: Toasts, Alerts, Loading states
- **Layout**: Grid, Flex, Container components

## 5. Code to Exclude

### 5.1 AWS Services (Remove)
- **AWS ECS**: Container orchestration
- **AWS Lambda**: Serverless functions
- **AWS SQS**: Message queuing
- **AWS SES**: Email services
- **AWS CloudFront**: CDN
- **AWS S3**: File storage

### 5.2 Email Services (Remove)
- Email templates
- SMTP configuration
- Notification jobs
- Email verification flows

### 5.3 Analytics Services (Remove)
- Apache Kafka integration
- External analytics providers
- Telemetry streaming
- Complex analytics processing

### 5.4 Kotlin Backend (Replace)
- Ktor framework services
- Kotlin dependency injection (Koin)
- Coroutines and Kotlin-specific features

## 6. Technology Migration Plan

### 6.1 Backend Migration
**From**: Ktor (Kotlin) + AWS Services  
**To**: Express.js + Bun + Prisma

### 6.2 Frontend Migration  
**From**: Next.js with complex AWS integrations  
**To**: Simplified Next.js with dark theme

### 6.3 Database Migration
**From**: Direct MongoDB with Kotlin drivers  
**To**: MongoDB with Prisma ORM

### 6.4 Authentication Migration
**From**: Custom JWT + Passkey implementation  
**To**: Simplified JWT + modern auth patterns

## 7. Development Phases

### Phase 1: Foundation (Current)
- [x] Repository analysis
- [x] Monorepo structure setup
- [ ] Database schema design
- [ ] Development environment setup

### Phase 2: Backend Development
- [ ] Express.js API setup
- [ ] Prisma schema implementation
- [ ] Authentication system
- [ ] Core CRUD operations

### Phase 3: Frontend Development  
- [ ] Next.js app setup with dark theme
- [ ] Authentication flow
- [ ] Admin dashboard
- [ ] Attendee management interface

### Phase 4: Integration & Testing
- [ ] API integration
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security implementation

### Phase 5: Deployment
- [ ] Production environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring and logging

## 8. Current Monorepo Structure

```
convocation-pu/
├── apps/
│   ├── web/           # Next.js frontend (React 19, Tailwind CSS)
│   └── api/           # Express.js backend (Elysia currently)
├── packages/
│   ├── db/            # Prisma database package
│   └── types/         # Shared TypeScript types
├── docs/              # Documentation
└── package.json       # Root package with workspaces
```

## 9. Dependencies Analysis

### 9.1 Current Dependencies
- **Root**: Bun, TypeScript, Prisma
- **Web**: Next.js 15.5.2, React 19, Tailwind CSS 4
- **API**: Elysia (needs migration to Express)
- **DB**: Prisma with MongoDB provider

### 9.2 Required Additions
- **Backend**: Express.js, JWT libraries, validation libraries
- **Frontend**: UI component library, state management, forms
- **Database**: MongoDB connection, Prisma client
- **Shared**: Type definitions, utilities

## 10. Next Steps

1. **Create development branch**: `feature/fullstack-conversion`
2. **Setup environment files**: `.env.example` files for both apps
3. **Implement Prisma schemas**: Based on the analyzed models
4. **Setup Express.js backend**: Replace Elysia with Express
5. **Design UI system**: Dark theme component library
6. **Implement authentication**: JWT + modern auth patterns

---

**Analysis completed on**: January 2024  
**Total estimated models**: 8 core entities  
**Total estimated API endpoints**: 35+ endpoints  
**Key features**: Authentication, Attendee Management, Analytics, Admin Console  
**Complexity**: High (due to seat allocation algorithms and comprehensive admin system)
