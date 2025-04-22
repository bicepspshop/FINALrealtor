/**
 * Theme Transition Utility
 * 
 * This utility provides functions to help with smooth transitions 
 * between light and dark themes.
 */

/**
 * Adds a transitioning class to the HTML element during theme change
 * and removes it after the transition is complete
 */
export function applyThemeTransition() {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  
  // Add transition class
  html.classList.add('theme-transitioning');
  
  // Apply a staggered removal to ensure smooth transitions for all elements
  setTimeout(() => {
    // Remove it after the transition completes
    requestAnimationFrame(() => {
      html.classList.remove('theme-transitioning');
    });
  }, 400); // Match with CSS transition time
}

/**
 * Enhanced theme toggle that adds a smooth transition effect
 * 
 * @param {Function} setTheme - The setTheme function from next-themes
 * @param {string} currentTheme - The current theme (light, dark, or system)
 */
export function toggleThemeWithTransition(setTheme, currentTheme) {
  // Apply transition class first
  applyThemeTransition();
  
  // Brief timeout to allow the transition class to take effect
  setTimeout(() => {
    // Handle system theme separately
    if (currentTheme === 'system') {
      setTheme('system');
      return;
    }
    
    // Fix the reversed logic - now the theme name correctly matches what we want to set
    if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, 10); // Reduced timeout for more responsive toggling
}

/**
 * Apply transitions for all Tailwind theme properties
 * 
 * @param {HTMLElement} element - The DOM element to add transitions to
 * @param {number} duration - Transition duration in ms (default: 300)
 */
export function addThemeTransitions(element, duration = 300) {
  if (!element) return;

  const transitionProps = [
    'background-color',
    'color',
    'border-color',
    'box-shadow',
    'opacity',
    'transform'
  ];
  
  element.style.transition = transitionProps
    .map(prop => `${prop} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`)
    .join(', ');
}
