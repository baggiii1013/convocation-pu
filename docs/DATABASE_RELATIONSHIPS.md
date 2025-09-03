# Database Schema Relationships

## Entity Relationship Overview

```
Account (1) ←→ (0..*) Attendee
    ↓
Transaction (0..*)

Attendee (1) ←→ (0..1) SeatAllocation
    ↓              ↓
Transaction    Row (1) ←→ (0..*) SeatAllocation
                ↓
            Enclosure (1) ←→ (0..*) Row

Department (standalone)
Convocation (standalone)
Analytics (standalone)
RemoteConfig (standalone)
IAMPolicy (standalone)
```

## Detailed Relationships

### Core User Flow
1. **Account** → **Attendee** (One-to-Many)
   - An account can be linked to multiple attendees (e.g., someone with multiple degrees)
   - An attendee may or may not have an account

2. **Attendee** → **SeatAllocation** (One-to-One)
   - Each attendee can have at most one seat allocation
   - Seat allocation links to a specific row

3. **Enclosure** → **Row** → **SeatAllocation** (Hierarchical)
   - Enclosures contain multiple rows
   - Rows contain multiple seat allocations
   - Forms the venue seating structure

### Transaction Flow
1. **Account** → **Transaction** (One-to-Many)
   - Account holders can have multiple transactions
   
2. **Attendee** → **Transaction** (One-to-Many)
   - Attendees can have multiple transactions (registration, tickets, etc.)

### Configuration & Analytics
- **Department**: Standalone reference data
- **Convocation**: Standalone event data
- **Analytics**: Standalone tracking data
- **RemoteConfig**: Standalone system configuration
- **IAMPolicy**: Standalone permission definitions

## Foreign Key Relationships

```prisma
// Account → Attendee (One-to-Many)
attendees Attendee[] // Account side
account Account? @relation(fields: [accountId], references: [id]) // Attendee side
accountId String? @db.ObjectId // Attendee side

// Attendee → SeatAllocation (One-to-One)
allocation SeatAllocation? // Attendee side
attendee Attendee @relation(fields: [attendeeId], references: [id]) // SeatAllocation side
attendeeId String @unique @db.ObjectId // SeatAllocation side

// Row → SeatAllocation (One-to-Many)
allocations SeatAllocation[] // Row side
row Row @relation(fields: [rowId], references: [id]) // SeatAllocation side
rowId String @db.ObjectId // SeatAllocation side

// Enclosure → Row (One-to-Many)
rows Row[] // Enclosure side
enclosure Enclosure @relation(fields: [enclosureId], references: [id]) // Row side
enclosureId String @db.ObjectId // Row side

// Account → Transaction (One-to-Many)
transactions Transaction[] // Account side
account Account? @relation(fields: [accountId], references: [id]) // Transaction side
accountId String? @db.ObjectId // Transaction side

// Attendee → Transaction (One-to-Many)
transactions Transaction[] // Attendee side
attendee Attendee @relation(fields: [attendeeId], references: [id]) // Transaction side
attendeeId String @db.ObjectId // Transaction side
```

## Index Strategy

### Primary Indexes (Automatic)
- All `@id` fields get automatic ObjectId indexes

### Unique Indexes
- `Account.email` - Unique email addresses
- `Attendee.enrollmentId` - Unique student IDs
- `Department.code` - Unique department codes
- `Analytics.date` - One record per date
- `RemoteConfig.key` - Unique configuration keys
- `IAMPolicy.name` - Unique policy names
- `SeatAllocation.attendeeId` - One seat per attendee

### Foreign Key Indexes (Automatic in MongoDB)
- All `@db.ObjectId` fields that reference other collections

## Query Patterns

### User Authentication Flow
```javascript
// 1. Find user by email
const account = await prisma.account.findUnique({
  where: { email: "user@example.com" }
});

// 2. Get user's attendee records
const attendees = await prisma.attendee.findMany({
  where: { accountId: account.id },
  include: { 
    allocation: {
      include: {
        row: {
          include: { enclosure: true }
        }
      }
    }
  }
});
```

### Seat Allocation Flow
```javascript
// 1. Find available seats
const availableRows = await prisma.row.findMany({
  where: {
    enclosure: { type: "STUDENT" },
    allocations: {
      none: {} // No existing allocations
    }
  },
  include: { enclosure: true }
});

// 2. Allocate seat
const allocation = await prisma.seatAllocation.create({
  data: {
    attendeeId: attendee.id,
    rowId: selectedRow.id,
    seatNumber: nextAvailableSeat
  }
});
```

### Analytics Queries
```javascript
// Daily analytics
const dailyStats = await prisma.analytics.findUnique({
  where: { date: new Date('2024-06-15') }
});

// Date range analytics
const monthlyStats = await prisma.analytics.findMany({
  where: {
    date: {
      gte: new Date('2024-06-01'),
      lte: new Date('2024-06-30')
    }
  }
});
```

### Administrative Queries
```javascript
// Get all departments by school
const engineeringDepts = await prisma.department.findMany({
  where: { school: "Faculty of Engineering and Technology" }
});

// Get attendees by convocation eligibility
const eligibleGraduates = await prisma.attendee.findMany({
  where: { 
    convocationEligible: true,
    convocationRegistered: false
  }
});

// Get transaction history for attendee
const transactions = await prisma.transaction.findMany({
  where: { attendeeId: attendee.id },
  orderBy: { createdAt: 'desc' }
});
```

## Performance Considerations

### Efficient Joins
- Use `include` for related data fetching
- Avoid N+1 queries with proper includes
- Use `select` to limit fields when possible

### Pagination
```javascript
// Paginated attendee list
const attendees = await prisma.attendee.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});
```

### Counting
```javascript
// Count with filters
const eligibleCount = await prisma.attendee.count({
  where: { convocationEligible: true }
});
```

## Data Integrity Rules

### Business Logic Constraints
1. **Seat Allocation**: One attendee can have only one seat
2. **Account Linking**: Attendees may exist without accounts (for bulk imports)
3. **Convocation Eligibility**: Must be validated before registration
4. **Transaction Status**: Must follow state machine (PENDING → COMPLETED/FAILED)
5. **Enclosure Capacity**: Sum of row capacities should not exceed enclosure capacity

### Validation Rules
1. **Email Format**: Valid email address for accounts
2. **Enrollment ID Pattern**: Department-year-number format
3. **Phone Format**: Valid phone number with country code
4. **Date Constraints**: Future dates for convocation events
5. **Seat Numbers**: Within row start-end range

---

**Note**: This schema supports the complete convocation management workflow from user registration through seat allocation to event management, with comprehensive analytics and administrative controls.
