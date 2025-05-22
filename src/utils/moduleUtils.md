# Module Layout Pattern

This document outlines the standard pattern for creating module layouts in the application.

## Components to Use

1. `ModuleLayout` - A wrapper component that provides a consistent layout for all modules
2. `ModuleMenu` - A component that displays a menu for the module
3. Module-specific menu items from `moduleMenuItems.tsx`

## Implementation Steps

### 1. Import Required Components and Utilities

```tsx
import { ModuleLayout } from '../../components/layout/ModuleLayout';
import { moduleNameMenuItems } from '../../utils/moduleMenuItems';
```

### 2. Use ModuleLayout in Your Module Component

```tsx
const ModuleName: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <ModuleProvider> {/* If applicable */}
      <ModuleLayout
        title="Module Title"
        description="Module description text"
        menuTitle="Module Menu"
        menuItems={moduleNameMenuItems}
        settingsPath="/module-path/settings"
      >
        {/* Module content goes here */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/some-path" element={<SomeComponent />} />
          {/* Additional routes */}
        </Routes>
      </ModuleLayout>
    </ModuleProvider>
  );
};
```

### 3. Add Module Menu Items

Add your module's menu items to `src/utils/moduleMenuItems.tsx`:

```tsx
// ModuleName Module Menu Items
export const moduleNameMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/module-path'
  },
  {
    icon: <SomeIcon className="h-4 w-4" />,
    label: 'Some Feature',
    path: '/module-path/some-feature'
  },
  // Additional menu items
];
```

## Benefits

1. **Consistency**: All modules will have the same layout structure
2. **Responsiveness**: The layout is responsive and works well on all screen sizes
3. **Maintainability**: Changes to the layout can be made in one place
4. **User Experience**: Users will have a consistent experience across all modules

## Example

See `src/pages/radiology/RadiologyModule.tsx` for a complete example of this pattern.
