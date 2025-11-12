# Quick Reference: Remaining Page Conversions

**Use this guide to quickly convert the remaining 5 pages.**

---

## 🎯 Conversion Checklist (Copy for Each Page)

```markdown
### Page: [PAGE_NAME]
- [ ] Read current implementation
- [ ] Identify client-side state and handlers
- [ ] Create Server Component (page.tsx)
  - [ ] Add auth check (requireAdmin or requireAuth)
  - [ ] Add data fetching function
  - [ ] Render client component with props
- [ ] Create Client Component (*-client.tsx)
  - [ ] Add 'use client' directive
  - [ ] Accept props from server
  - [ ] Move all useState, useEffect
  - [ ] Move all event handlers
  - [ ] Add router.refresh() after mutations
- [ ] Create Form Component if needed (*-form.client.tsx)
  - [ ] Complex forms only
  - [ ] Form validation logic
  - [ ] Submit handlers
- [ ] Test compilation (no errors)
- [ ] Update TODO list
- [ ] Update progress document
```

---

## 📝 Code Templates

### Template: Server Component (page.tsx)
```tsx
import { requireAdmin } from '@/lib/auth';
import { MyPageClient } from './my-page-client';

// TypeScript interfaces
interface MyData {
  id: string;
  // ... other fields
}

// Server-side data fetching
async function fetchMyData(): Promise<MyData[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/my-endpoint`, {
      credentials: 'include',
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Server Component
export default async function MyPage() {
  // 1. Auth
  await requireAdmin(); // or requireAuth()
  
  // 2. Fetch
  const initialData = await fetchMyData();
  
  // 3. Render
  return <MyPageClient initialData={initialData} />;
}
```

### Template: Client Component (*-client.tsx)
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface MyData {
  id: string;
  // ... other fields
}

interface MyPageClientProps {
  initialData: MyData[];
}

export function MyPageClient({ initialData }: MyPageClientProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  
  // Refresh data
  const refreshData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/my-endpoint`, {
        credentials: 'include',
      });
      const newData = await res.json();
      setData(newData);
    } catch (error) {
      toast.error('Failed to refresh');
    }
  };
  
  // Create/Update/Delete handlers
  const handleCreate = async (item: MyData) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/my-endpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Failed');
      
      toast.success('Created successfully');
      await refreshData();
      router.refresh(); // Important: refresh server data
    } catch (error) {
      toast.error('Failed to create');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {/* Your UI here */}
    </div>
  );
}
```

### Template: Form Component (*-form.client.tsx)
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import toast from 'react-hot-toast';

interface MyFormData {
  // ... form fields
}

interface MyFormProps {
  initialData?: MyFormData;
  onSave: (data: MyFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export function MyForm({ initialData, onSave, onCancel, loading }: MyFormProps) {
  const [formData, setFormData] = useState<MyFormData>(
    initialData || { /* default values */ }
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.someField) {
      toast.error('Please fill required fields');
      return;
    }
    
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="field">Field Name</Label>
        <Input
          id="field"
          value={formData.someField}
          onChange={(e) => setFormData({ ...formData, someField: e.target.value })}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
```

---

## 🗺️ Page-Specific Guides

### `/admin/users` (Complex CRUD)
**Complexity**: High (6-8 hours)  
**Files**: 3 (page.tsx, users-client.tsx, user-form.client.tsx)

**Key Points**:
- User list with search/filter
- Create/Edit user modal
- Delete with confirmation
- Role management
- Bulk actions

**Server Component**:
```tsx
async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
    credentials: 'include',
    cache: 'no-store',
  });
  return await res.json();
}

export default async function UsersPage() {
  await requireAdmin();
  const users = await fetchUsers();
  return <UsersClient initialUsers={users} />;
}
```

**Client Component**:
- State: users list, editing mode, current user
- Handlers: create, update, delete, search
- Modal for form
- Table for display

---

### `/admin/create-account` (Form-Heavy)
**Complexity**: Medium (4-6 hours)  
**Files**: 2 (page.tsx, create-account-client.tsx)

**Key Points**:
- Multi-field form
- Role selection
- Email validation
- Password requirements
- Success/error handling

**Server Component**:
```tsx
export default async function CreateAccountPage() {
  await requireAdmin();
  return <CreateAccountClient />;
}
```

**Client Component**:
- State: form data, validation errors, loading
- Handler: form submit, validation
- Display: form fields, error messages

---

### `/admin/upload-students` (Excel Upload)
**Complexity**: High (6-8 hours)  
**Files**: 2 (page.tsx, upload-client.tsx)

**Key Points**:
- File upload (Excel)
- File parsing
- Preview data
- Validation errors
- Bulk import

**Server Component**:
```tsx
export default async function UploadStudentsPage() {
  await requireAdmin();
  return <UploadStudentsClient />;
}
```

**Client Component**:
- State: file, parsed data, preview, errors
- Handlers: file upload, parse, validate, import
- Display: upload UI, preview table, error list

**Note**: Consider using server action for file processing

---

### `/admin/reserve-seats` (Seat Management)
**Complexity**: High (6-8 hours)  
**Files**: 2-3 (page.tsx, reserve-seats-client.tsx, seat-grid.client.tsx)

**Key Points**:
- Enclosure selection
- Seat grid display
- Select/deselect seats
- Batch reservation
- Visual feedback

**Server Component**:
```tsx
async function fetchEnclosures() {
  // Fetch enclosures with seats
}

export default async function ReserveSeatsPage() {
  await requireAdmin();
  const enclosures = await fetchEnclosures();
  return <ReserveSeatsClient initialEnclosures={enclosures} />;
}
```

**Client Component**:
- State: selected enclosure, selected seats, reserving
- Handlers: select seat, reserve batch
- Display: enclosure picker, seat grid, legend

---

### `/admin/aerial-view-editor` (Complex Canvas)
**Complexity**: Very High (8-10 hours)  
**Files**: 3-4 (page.tsx, editor-client.tsx, canvas.client.tsx, toolbar.client.tsx)

**Key Points**:
- Canvas editor
- Drag-and-drop
- Zoom/pan
- Save layout
- Load existing layout

**Server Component**:
```tsx
async function fetchLayout() {
  // Fetch saved layout
}

export default async function AerialViewEditorPage() {
  await requireAdmin();
  const layout = await fetchLayout();
  return <AerialViewEditorClient initialLayout={layout} />;
}
```

**Client Component**:
- State: canvas state, tools, zoom, elements
- Handlers: draw, move, delete, save
- Display: canvas, toolbar, properties panel

**Note**: This is the most complex page. Consider breaking into smaller components.

---

## 🎯 Priority Order

### Week 1 (This Week)
1. ✅ `/profile` - Done
2. ✅ `/admin/dashboard` - Done
3. ✅ `/admin/enclosures` - Done
4. ✅ `/settings` - Done
5. ⏳ `/admin/create-account` - Next (easier, form-heavy)

### Week 2 (Next Week)
6. `/admin/users` - Important
7. `/admin/upload-students` - Complex but critical
8. `/admin/reserve-seats` - Seat management
9. `/admin/aerial-view-editor` - Most complex, save for last

---

## ⚡ Speed Tips

1. **Copy from Similar Pages**
   - `/admin/users` similar to `/admin/enclosures`
   - `/admin/create-account` similar to `/settings`

2. **Use Templates**
   - Copy templates from this file
   - Adjust for specific needs

3. **Test Early**
   - Check compilation after each step
   - Don't wait until end

4. **Commit Often**
   - Commit after each successful conversion
   - Easy to revert if needed

5. **Follow Pattern**
   - Server: auth + data
   - Client: UI + interactions
   - Form: separate if complex

---

## 🔍 Common Issues

### Issue: "Cannot use useState in Server Component"
**Solution**: Add `'use client'` to file

### Issue: "requireAuth is not defined"
**Solution**: Import from `@/lib/auth`

### Issue: "Props not serializable"
**Solution**: Only pass JSON-serializable data from server to client

### Issue: "Hydration error"
**Solution**: Make sure client initial state matches server render

### Issue: "Data not refreshing"
**Solution**: Call `router.refresh()` after mutations

---

## 📞 Need Help?

1. Check [PHASE-3-TROUBLESHOOTING.md](./PHASE-3-TROUBLESHOOTING.md)
2. Review completed conversions
3. Check auth utilities in `apps/web/src/lib/auth/`
4. Refer to Phase 3 guides

---

**Remember**: Server Components are your friend! They make your app faster and more secure. 🚀
