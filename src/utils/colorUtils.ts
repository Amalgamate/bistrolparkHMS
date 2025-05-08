/**
 * Generates a pastel color based on a string input (like a name)
 * @param input String to generate color from
 * @returns Pastel color in hex format
 */
export const generatePastelColor = (input: string): string => {
  // Hash the input string to get a consistent color for the same input
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate pastel color components
  // Using pastel range (180-255) for RGB values
  const r = ((hash & 0xFF0000) >> 16) % 76 + 180;
  const g = ((hash & 0x00FF00) >> 8) % 76 + 180;
  const b = (hash & 0x0000FF) % 76 + 180;

  // Convert to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Determines if a color is light or dark
 * @param color Hex color string
 * @returns Boolean indicating if the color is light (true) or dark (false)
 */
export const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate perceived brightness using the formula:
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
  
  // If brightness is greater than 155, color is considered light
  return brightness > 155;
};

/**
 * Returns a predefined set of pastel colors
 * @returns Array of pastel color hex codes
 */
export const getPastelColors = (): string[] => {
  return [
    '#FFD1DC', // Pastel Pink
    '#FFECB3', // Pastel Yellow
    '#B3E0FF', // Pastel Blue
    '#D1FFD1', // Pastel Green
    '#E0B3FF', // Pastel Purple
    '#FFD1B3', // Pastel Orange
    '#B3FFE0', // Pastel Mint
    '#D1D1FF', // Pastel Lavender
    '#FFE0B3', // Pastel Peach
    '#B3FFFF', // Pastel Cyan
    '#E0FFB3', // Pastel Lime
    '#FFB3D1', // Pastel Rose
  ];
};

/**
 * Gets a pastel color from the predefined set based on an index
 * @param index Number to select color from the predefined set
 * @returns Pastel color hex code
 */
export const getPastelColorByIndex = (index: number): string => {
  const colors = getPastelColors();
  return colors[index % colors.length];
};
