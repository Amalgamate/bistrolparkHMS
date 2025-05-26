# 🚀 Bristol Park Hospital - Development Guide

## 🔥 Hot Module Replacement (HMR) Setup

### **Quick Start**
```bash
# Standard development with auto-open browser
npm run dev

# Force HMR refresh (clears cache)
npm run dev:hmr

# Debug HMR issues
npm run dev:debug
```

### **🎯 HMR Features**

#### **✅ What Updates Instantly (No Page Reload):**
- ✅ **CSS/Tailwind changes** - Instant visual updates
- ✅ **React component changes** - Preserves component state
- ✅ **TypeScript changes** - Fast compilation and update
- ✅ **New components** - Hot-swapped into the app
- ✅ **Props/state changes** - Component re-renders only

#### **🔄 What Requires Page Reload:**
- 🔄 **Route changes** - New routes need full reload
- 🔄 **Context provider changes** - App-level state changes
- 🔄 **Environment variable changes** - Restart dev server
- 🔄 **Package.json changes** - Restart dev server

### **🎨 Visual HMR Status**

You'll see a **green indicator** in the bottom-right corner showing:
- 🟢 **HMR Ready** - Connected and waiting
- 🟡 **HMR Active** - Currently updating
- 🔴 **HMR Disconnected** - Connection lost

**Click the indicator** to see HMR info in console.

### **🔧 Browser Console Commands**

Open browser console and use these commands:
```javascript
// Show HMR status
hmr.status()

// Force page refresh
hmr.refresh()

// Clear console
hmr.clear()

// Show help
hmr.help()
```

### **⚡ Development Workflow**

#### **1. 🎯 Optimal Development Setup:**
1. **Open browser** to `http://localhost:5175`
2. **Open VS Code** with the project
3. **Split screen** - browser on one side, code on the other
4. **Save files** to see instant updates

#### **2. 🔥 Making Changes:**
```bash
# Edit any file and save
src/pages/PatientDetailsView.tsx

# See instant update in browser (no refresh needed)
# HMR preserves:
# - Form data
# - Component state
# - Scroll position
# - Tab selections
```

#### **3. 🎨 CSS/Styling Changes:**
```bash
# Edit Tailwind classes
className="bg-blue-500 hover:bg-blue-600"

# Save file → Instant visual update
# No page reload, no state loss
```

#### **4. 🧩 Component Development:**
```typescript
// Add new component
const NewComponent = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};

// Save → Component appears instantly
// State is preserved during updates
```

### **🚨 Troubleshooting HMR**

#### **Problem: HMR Not Working**
```bash
# Solution 1: Force refresh HMR
npm run dev:hmr

# Solution 2: Clear browser cache
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Solution 3: Restart dev server
Ctrl + C → npm run dev
```

#### **Problem: Changes Not Reflecting**
```bash
# Check console for errors
F12 → Console tab

# Look for HMR status indicator
# Should be green "HMR Ready"

# Try manual refresh
hmr.refresh()
```

#### **Problem: Page Keeps Reloading**
```bash
# Check for syntax errors
# Fix TypeScript/ESLint errors
# HMR falls back to full reload on errors
```

### **🎯 Best Practices**

#### **✅ Do:**
- ✅ **Save frequently** - Each save triggers HMR
- ✅ **Use TypeScript** - Better error detection
- ✅ **Keep components small** - Faster HMR updates
- ✅ **Use React DevTools** - Debug state changes
- ✅ **Check console** - Monitor HMR status

#### **❌ Don't:**
- ❌ **Manual browser refresh** - Let HMR handle it
- ❌ **Ignore TypeScript errors** - Breaks HMR
- ❌ **Large component files** - Slower updates
- ❌ **Inline styles** - Use Tailwind for HMR benefits

### **🔍 Debugging Tips**

#### **1. Monitor HMR Activity:**
```javascript
// In browser console
hmr.status()
// Shows: updates count, last update time, connection status
```

#### **2. Check Network Tab:**
```bash
F12 → Network → WS (WebSocket)
# Should show active WebSocket connection to Vite
```

#### **3. Vite Dev Server Logs:**
```bash
# Terminal running npm run dev shows:
# ✓ HMR update /src/pages/PatientDetailsView.tsx
# ✓ page reload src/App.tsx (hmr update failed)
```

### **🚀 Performance Tips**

#### **Faster HMR Updates:**
1. **Smaller files** - Break large components into smaller ones
2. **Lazy loading** - Use React.lazy() for heavy components
3. **Memoization** - Use React.memo() for expensive renders
4. **Efficient imports** - Import only what you need

#### **Example: Optimized Component**
```typescript
import React, { memo } from 'react';
import { PatientData } from '../types'; // Specific import

const PatientCard = memo(({ patient }: { patient: PatientData }) => {
  return (
    <div className="p-4 border rounded">
      {patient.name}
    </div>
  );
});

export default PatientCard;
```

---

## 🎉 Happy Developing!

With this HMR setup, you can develop Bristol Park Hospital features with:
- ⚡ **Instant feedback** on every change
- 🎯 **Preserved state** during updates  
- 🔥 **Fast iteration** cycles
- 🎨 **Live CSS updates**

**Save this file and watch it update instantly!** 🚀
