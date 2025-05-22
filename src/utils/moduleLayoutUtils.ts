/**
 * Module Layout Utilities
 * 
 * This file contains utility functions and constants for standardizing
 * module layouts across the application to maximize space efficiency.
 */

// Standard padding values for module containers
export const MODULE_CONTAINER_PADDING = {
  // Compact padding for main module containers
  CONTAINER: 'px-2 py-2',
  // Padding for content cards
  CARD: 'p-3',
  // Padding for menu items
  MENU: 'p-3',
  // Padding for dashboard sections
  DASHBOARD: 'p-4',
  // Padding for form sections
  FORM: 'p-4',
};

// Standard spacing values for module layouts
export const MODULE_SPACING = {
  // Spacing between grid items
  GRID_GAP: 'gap-3',
  // Spacing between menu items
  MENU_GAP: 'space-y-0.5',
  // Spacing between form elements
  FORM_GAP: 'space-y-3',
  // Margin below headers
  HEADER_MARGIN: 'mb-3',
  // Margin below section titles
  SECTION_MARGIN: 'mb-2',
};

// Standard font sizes for module text elements
export const MODULE_TYPOGRAPHY = {
  // Main module title
  MODULE_TITLE: 'text-lg font-semibold',
  // Section titles
  SECTION_TITLE: 'text-base font-medium',
  // Menu section titles
  MENU_TITLE: 'text-sm font-semibold',
  // Card titles
  CARD_TITLE: 'text-base font-medium',
  // Data values (large numbers, percentages)
  DATA_VALUE: 'text-2xl font-bold',
  // Data labels
  DATA_LABEL: 'text-xs text-gray-500',
};

// Standard icon sizes
export const MODULE_ICON_SIZES = {
  // Icons in menu items
  MENU_ICON: 'h-4 w-4',
  // Icons in cards
  CARD_ICON: 'h-8 w-8',
  // Icons in buttons
  BUTTON_ICON: 'h-3 w-3',
};

/**
 * Generates a standard compact module container class string
 */
export const getModuleContainerClasses = () => {
  return `container mx-auto ${MODULE_CONTAINER_PADDING.CONTAINER}`;
};

/**
 * Generates a standard compact card class string
 */
export const getCardClasses = () => {
  return `bg-white rounded-lg shadow-sm ${MODULE_CONTAINER_PADDING.CARD}`;
};

/**
 * Generates a standard compact menu class string
 */
export const getMenuClasses = () => {
  return `bg-white rounded-lg shadow-sm ${MODULE_CONTAINER_PADDING.MENU}`;
};
