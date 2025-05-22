# Module Navigation System

This document outlines the module navigation system implemented in the application.

## Overview

The module navigation system allows users to quickly switch between different modules of the application from any page. It consists of:

1. A dropdown selector in the header of each module
2. A consistent list of available modules
3. Direct navigation between modules without going through the main menu

## Implementation

### ModuleSelector Component

We've created a reusable `ModuleSelector` component that:

- Maintains a consistent list of available modules
- Handles navigation between modules
- Has a compact design to save space
- Is easily integrated into any module header

```tsx
// Example usage
<CompactModuleHeader
  title="Module Title"
  actions={
    <ModuleSelector currentModule="current-module-id" />
  }
/>
```

### Module List

The following modules are available in the dropdown:

- Back Office
- Clinical
- Pharmacy
- Laboratory
- Radiology
- Physiotherapy
- Maternity
- Procedures
- Emergency
- Blood Bank
- Ambulance
- Mortuary

### Integration with CompactModuleHeader

The ModuleSelector is designed to work seamlessly with the CompactModuleHeader component:

```tsx
<CompactModuleHeader
  title="Module Title"
  actions={
    <div className="flex items-center gap-2">
      <ModuleSelector currentModule="current-module-id" />
      {/* Additional actions can be added here */}
      <Button size="sm">Action</Button>
    </div>
  }
/>
```

## Benefits

1. **Improved Navigation**: Users can quickly switch between modules without returning to the main menu
2. **Consistency**: The same module list is available from every page
3. **Space Efficiency**: The dropdown design saves space compared to a full module list
4. **Discoverability**: Users can easily discover all available modules

## Future Enhancements

1. Add module icons to the dropdown items
2. Add recently used modules section
3. Add keyboard shortcuts for quick navigation
4. Add permissions-based filtering of available modules
