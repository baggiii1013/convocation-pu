# Enclosures Page - API Enhancements

## Overview
Added comprehensive API functionality to the Enclosures Management page to provide a complete CRUD experience with bulk operations, search, and export capabilities.

## Changes Made

### 1. New API Calls Added

#### **Refresh Enclosures**
- **Endpoint**: `GET /api/v1/enclosures`
- **Function**: `handleRefresh()`
- **Purpose**: Manually reload all enclosures from the server
- **Features**:
  - Loading state with spinner
  - Success/error toast notifications
  - Fetches latest enclosure data

#### **Delete Selected (Bulk Delete)**
- **Endpoint**: `DELETE /api/v1/enclosures/:id` (multiple calls)
- **Function**: `handleDeleteSelected()`
- **Purpose**: Delete multiple selected enclosures at once
- **Features**:
  - Confirmation dialog showing count
  - Batch API calls with Promise.allSettled
  - Success/failure count reporting
  - Clears selection after deletion
  - Refreshes data after completion

#### **Clear All Enclosures**
- **Endpoint**: `DELETE /api/v1/enclosures/:id` (for all)
- **Function**: `handleDeleteAll()`
- **Purpose**: Bulk delete all enclosures
- **Features**:
  - Strong confirmation warning
  - Parallel deletion with Promise.all
  - Loading state during operation
  - Complete UI state reset

#### **Export Enclosures**
- **Function**: `handleExport()`
- **Purpose**: Export all enclosures to CSV file
- **Features**:
  - CSV with headers: Letter, Name, Allocated For, Entry Direction, Total Seats, Allocated Seats, Rows, Display Order
  - Automatic file download with timestamp
  - Client-side export (no API call needed)
  - Handles empty name fields properly with quotes

#### **Duplicate Enclosure**
- **Function**: `handleDuplicate()`
- **Purpose**: Clone an existing enclosure
- **Features**:
  - Copies all enclosure data
  - Removes ID for new creation
  - Appends "(Copy)" to name
  - Prompts user to update letter
  - Opens edit form with copied data

### 2. Search & Filter Functionality

#### **Search Feature**
- **Function**: `filteredEnclosures`
- **Purpose**: Filter enclosures in real-time
- **Search Fields**:
  - Enclosure letter
  - Enclosure name
  - Allocated for (STUDENTS, FACULTY, etc.)
  - Entry direction (NORTH, SOUTH, etc.)
- **Features**:
  - Real-time filtering as user types
  - Case-insensitive search
  - Shows filtered count vs total
  - Updates selection state

### 3. Bulk Selection System

#### **Select Individual**
- **Function**: `toggleSelectEnclosure()`
- Checkbox next to each enclosure
- Maintains selection state in Set

#### **Select All**
- **Function**: `toggleSelectAll()`
- Checkbox in action bar
- Selects/deselects all filtered enclosures
- Smart toggle based on current state

#### **Selection State Management**
- Uses `Set<string>` for efficient lookups
- Persists across filtering
- Clears after bulk operations
- Shows count in UI

### 4. Enhanced UI Components

#### **Action Bar**
New comprehensive control panel featuring:
1. **Search Input** (with Search icon)
   - Full-width on mobile
   - Max-width on desktop
   - Clear placeholder text
   
2. **Refresh Button** (Indigo)
   - Icon: RefreshCw
   - Animated spinner when loading
   - Reloads enclosure data
   
3. **Export Button** (Blue)
   - Icon: Download
   - Exports to CSV
   - Disabled when no enclosures
   
4. **Delete Selected Button** (Orange/Red)
   - Icon: Trash2
   - Shows selected count
   - Only visible when items selected
   
5. **Clear All Button** (Red)
   - Icon: X
   - Clears all enclosures
   - Disabled when empty or loading

#### **Selection Info Bar**
- "Select All" checkbox with label
- Shows filtered count: "Showing X of Y"
- Shows selected count: "N selected"
- Appears only when enclosures exist

#### **Enclosure Cards - Enhanced**
Each card now includes:
1. **Selection Checkbox**
   - Left of enclosure letter badge
   - Accessible with aria-label
   - Visual feedback on hover
   
2. **Duplicate Button** (Green)
   - Icon: Copy
   - Next to Edit button
   - Quick clone functionality

#### **Enhanced Empty States**
1. **No Enclosures** (when database is empty)
   - Indigo/purple theme
   - Plus icon
   - "Create First Enclosure" CTA button
   
2. **No Search Results** (when filter returns nothing)
   - Gray theme
   - Search icon
   - "Clear Search" button
   - Helpful message about adjusting query

### 5. New Icons Imported
```typescript
import { Copy, Download, Edit, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
```

### 6. New State Management
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [selectedEnclosures, setSelectedEnclosures] = useState<Set<string>>(new Set());
```

## File Changes

### Modified Files
- `/apps/web/src/app/admin/enclosures/enclosures-client.tsx`

### Key Sections Updated

1. **Imports** (Line ~4)
   - Added new icons: Copy, Download, RefreshCw, Search, X
   - Added Input component for search

2. **State Management** (Lines ~39-42)
   - Added searchQuery state
   - Added selectedEnclosures Set

3. **API Functions** (Lines ~120-260)
   - `handleDuplicate()` - Clone enclosure
   - `handleRefresh()` - Reload data
   - `handleDeleteSelected()` - Bulk delete selected
   - `handleDeleteAll()` - Delete all enclosures
   - `handleExport()` - Export to CSV
   - `toggleSelectEnclosure()` - Toggle individual selection
   - `toggleSelectAll()` - Toggle all selections
   - `filteredEnclosures` - Computed filtered list

4. **UI Components** (Lines ~300-580)
   - Action bar with search and buttons
   - Selection info bar
   - Enhanced enclosure cards with checkbox
   - Duplicate button added to each card
   - Two empty states (no data vs no results)

## API Endpoints Used

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/v1/enclosures` | Fetch all enclosures | ✅ Existing |
| GET | `/api/v1/enclosures/:id` | Fetch single enclosure | ✅ Existing |
| POST | `/api/v1/enclosures` | Create enclosure | ✅ Existing |
| PUT | `/api/v1/enclosures/:id` | Update enclosure | ✅ Existing |
| PATCH | `/api/v1/enclosures/:id/layout` | Update layout | ✅ Existing |
| DELETE | `/api/v1/enclosures/:id` | Delete enclosure | ✅ **Enhanced (Bulk)** |

## Benefits

### For Users
1. **Bulk Operations**: Manage multiple enclosures efficiently
2. **Quick Search**: Find enclosures instantly by any field
3. **Data Export**: Export configuration for backup/analysis
4. **Duplicate**: Quick setup of similar enclosures
5. **Better Control**: Clear all or selected items at once

### For Administrators
1. **Efficiency**: Bulk operations save time
2. **Flexibility**: Search and filter large datasets
3. **Backup**: Export for documentation/recovery
4. **Safety**: Clear confirmations prevent accidents
5. **Visibility**: Selection state always visible

## User Experience Improvements

### Visual Feedback
- Loading spinners on async operations
- Color-coded buttons (green=duplicate, blue=edit, red=delete)
- Disabled states prevent accidental actions
- Toast notifications for all operations
- Badge showing selected count

### Accessibility
- Aria-labels on checkboxes
- Keyboard navigation support
- Clear action labels
- High contrast colors
- Logical tab order

### Error Handling
- Confirmation dialogs for destructive actions
- Detailed error messages
- Partial success reporting (e.g., "deleted 3, failed 1")
- Graceful fallbacks
- Console logging for debugging

## Testing Checklist

- [x] Refresh button updates enclosure list
- [x] Search filters by letter, name, allocated for, and entry direction
- [x] Select all checkbox works correctly
- [x] Individual selection toggles work
- [x] Delete selected removes only selected items
- [x] Clear all deletes all enclosures with confirmation
- [x] Export generates correct CSV format
- [x] Duplicate creates copy with "(Copy)" suffix
- [x] Empty states display correctly
- [x] Search empty state shows when no results
- [x] Selection count displays accurately
- [x] Toast notifications appear for all actions
- [x] Loading states prevent duplicate operations
- [x] Buttons disabled appropriately

## Future Enhancements (Optional)

1. **Advanced Filters**: Multi-select filters for allocated for, entry direction
2. **Sorting**: Sort by letter, name, total seats, etc.
3. **Pagination**: For very large enclosure lists
4. **Import**: Import enclosures from CSV
5. **Batch Edit**: Edit multiple enclosures at once
6. **Templates**: Save/load enclosure templates
7. **History**: Track changes and allow undo
8. **Validation**: Pre-check for letter conflicts
9. **Drag & Drop**: Reorder enclosures visually
10. **Preview**: Visual preview of enclosure layout

## Performance Notes

- **Filtering**: Client-side filtering is instant (no API calls)
- **Bulk Delete**: Uses Promise.allSettled for parallel execution
- **Export**: Client-side generation (no server load)
- **Selection**: Set data structure for O(1) lookups
- **State Updates**: Optimized re-renders with proper hooks

## Breaking Changes
None - all changes are additive and backward compatible.

## Migration Notes
No migration required - existing data and API endpoints work as-is.
