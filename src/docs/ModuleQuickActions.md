# Module-Specific Quick Actions

This document outlines the implementation of module-specific quick actions in the Bristol Park Hospital system.

## Overview

The module-specific quick actions feature provides users with contextual actions based on the current module they are using. When a user clicks the yellow quick action button in the app bar, they see a list of actions that are relevant to their current context.

## Implementation Details

### 1. Context System

The feature uses a React context system to track the current module and provide the appropriate quick actions:

- `ModuleQuickActionsContext.tsx`: Provides the current module and its quick actions
- `moduleQuickActions.tsx`: Defines the quick actions for each module

### 2. Quick Actions Button

The quick actions button in the app bar:

- Displays a "+" icon in a yellow background
- When clicked, shows a dropdown of module-specific actions
- Each action includes an icon, label, and optional description

### 3. Module Detection

The system automatically detects the current module based on the URL path:

```tsx
// Example of module detection logic
useEffect(() => {
  const path = location.pathname;
  let moduleId = '';

  if (path.startsWith('/clinical')) {
    moduleId = 'clinical';
  } else if (path.startsWith('/pharmacy')) {
    moduleId = 'pharmacy';
  }
  // ... other modules

  setCurrentModule(moduleId);
}, [location.pathname]);
```

### 4. Action Execution

When a user clicks on a quick action, the system navigates to the appropriate page:

```tsx
const executeQuickAction = (actionId: string) => {
  const action = quickActions.find(a => a.id === actionId);
  if (action) {
    navigate(action.path);
  }
};
```

## Module-Specific Actions

Each module has its own set of quick actions tailored to its functionality:

### Clinical Module

- New Patient
- Consultation Queue
- Vitals Capture
- Doctor Consultation

### Pharmacy Module

- Walk-In Patient
- New Pharmacy Request
- Confirm Drugs
- Reverse Confirmed

### Laboratory Module

- View Lab Requests
- New Lab Request
- Register Walk-In
- Manage Test Prices

### Radiology Module

- View Requests
- New Request
- Walk-In Patients
- View Reports

### Back Office Module

- Add Employee
- New Transaction
- Inventory Check
- New Purchase Order
- Facility Management

### Physiotherapy Module

- Manage Patients
- Schedule Appointment
- View Treatments
- Exercise Library

### Maternity Module

- Antenatal Appointments
- Labor Ward Status
- Postnatal Checkups

### Procedures Module

- Surgical Procedures
- Non-Surgical Procedures
- Schedule Procedure

### Emergency Module

- Triage Patient
- View Patients
- Trauma Center

## Benefits

1. **Contextual Relevance**: Users see only the actions relevant to their current task
2. **Efficiency**: Quick access to common actions without navigating through menus
3. **Consistency**: The quick action button is always in the same place across the application
4. **Discoverability**: Users can easily discover available actions for each module

## Future Enhancements

1. **User Customization**: Allow users to customize which quick actions appear for each module
2. **Usage Analytics**: Track which quick actions are used most frequently
3. **Keyboard Shortcuts**: Add keyboard shortcuts for quick actions
4. **Recently Used**: Show recently used actions at the top of the list
