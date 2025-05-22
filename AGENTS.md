# AI Agent Instructions

This document provides instructions for AI agents working on this project.

## Project Overview

This is a barcode-based inventory management system with the following main features:
- Check-in page for scanning/entering barcodes
- Item history view for tracking scanned items
- Storage management for organizing items by location
- Item details and management

## UI Improvement Tasks

### Task 1: Item History UI Improvement

**Current State:**
The current Item History UI displays a simple list of scanned items showing barcode, quantity, and scan timestamp in a basic text format.

**Improvement Goals:**
Transform the history view into a modern card-based layout that:
- Presents each item as a distinct visual card
- Improves information hierarchy and readability
- Works well on both mobile and desktop views
- Enhances visual appeal and user experience

**Implementation Guidelines:**
1. **Card Layout & Structure**
   - Design cards with clear visual boundaries
   - Establish proper information hierarchy with barcode as primary identifier
   - Consider adding visual elements like barcode icons or thumbnails
   - Ensure consistent spacing and padding

2. **Card Visual Design**
   - Use subtle shadows and rounded corners for a modern look
   - Implement a clean color scheme consistent with the application's branding
   - Add appropriate hover/touch states for interactive feedback

3. **Responsive Design**
   - Desktop: Multi-column grid layout (2-3 columns)
   - Mobile: Single column layout with full-width cards
   - Ensure touch targets are appropriately sized on mobile

4. **UX Enhancements**
   - Consider adding filtering/sorting options at the top
   - Implement pagination or infinite scroll for large datasets
   - Add subtle animations for loading or interaction feedback

5. **Code Structure**
   - Update the HistoryItemCard.tsx component in components/history/
   - Ensure proper TypeScript typing for all props
   - Follow the established styling patterns (CSS modules)

### Task 2: Check-in UI Improvement

**Current State:**
The Check-in page has a webcam view, barcode input field, and submit button in a basic layout that lacks visual polish and optimal component arrangement.

**Improvement Goals:**
Create a more intuitive and visually appealing check-in interface that:
- Clearly guides users through the scanning/entry process
- Optimizes layout for both desktop and mobile use cases
- Provides clear visual feedback during the scanning process
- Enhances overall usability and professional appearance

**Implementation Guidelines:**
1. **Layout Optimization**
   - Desktop: Side-by-side arrangement with camera feed and input controls
   - Mobile: Stacked layout with camera feed above input controls
   - Ensure proper spacing between all elements

2. **Camera Feed Enhancements**
   - Add a subtle border or container to clearly define the camera area
   - Consider adding camera toggle or flash control options if applicable
   - Implement visual indicators for successful scans

3. **Input Controls Refinement**
   - Improve styling of input field and submit button
   - Group related controls together visually
   - Ensure touch targets are appropriately sized on mobile
   - Add appropriate feedback states (loading, success, error)

4. **Visual Design**
   - Implement consistent spacing, typography, and color scheme
   - Add subtle animations for state changes
   - Ensure adequate contrast for all text elements

5. **Code Structure**
   - Update components in components/check-in/ directory
   - Ensure proper TypeScript typing for all props and state
   - Follow established project patterns for styling and component structure

### Task 3: Responsive Navigation Menu Improvement

**Current State:**
The application currently uses a hamburger menu button on both mobile and desktop views, with a persistent top navigation bar on mobile.

**Improvement Goals:**
Create a more device-appropriate navigation system that:
- Removes the mobile menu button on desktop sizes
- Displays horizontal navigation on desktop
- Removes the top navbar on mobile devices
- Improves overall navigation usability

**Implementation Guidelines:**
1. **Desktop Navigation**
   - Remove the hamburger menu button completely
   - Display all navigation links ("Home", "Check-in", "History", "Storage") horizontally in the header
   - Add appropriate spacing between navigation items
   - Implement visual indicators for the active page
   - Add hover effects for better user feedback

2. **Mobile Navigation**
   - Remove the top navigation bar to save vertical space
   - Implement a bottom navigation bar with icons and labels
   - Use intuitive icons for each section
   - Apply appropriate highlighting for the active section
   - Ensure the bottom navigation is fixed and easily accessible

3. **Code Structure**
   - Update the MobileMenu.tsx and Navbar.tsx components
   - Use CSS media queries for responsive behavior
   - Ensure appropriate breakpoints (around 768px)
   - Pay attention to tap target sizes on mobile (minimum 44×44px)

### Task 4: Color Scheme Update

**Current State:**
The application currently uses a black background throughout the interface.

**Improvement Goals:**
Update the application to use a white background with appropriate adjustments to ensure content remains visible and accessible:
- Change the global background from black to white
- Update text colors for proper contrast on a white background
- Maintain visual hierarchy and component distinction
- Ensure consistent styling across the application

**Implementation Guidelines:**
1. **Global Background Change**
   - In globals.css, update the background color from black to white (#FFFFFF)
   - Change text colors from white to appropriate dark colors (e.g., #212121)
   - Ensure sufficient contrast for accessibility

2. **Component-Specific Updates**
   - Review and update all component backgrounds
   - For cards, consider light gray (#F5F5F5) or subtle gradients
   - Maintain high contrast for buttons and interactive elements
   - Update form elements with appropriate borders and focus states

3. **Visual Hierarchy Maintenance**
   - Use shadows and subtle borders for element separation
   - Implement a refined color palette for different UI elements
   - Ensure consistency across all pages and components

4. **Code Structure**
   - Primarily update globals.css
   - Update component-specific CSS modules as needed
   - Maintain the existing CSS module pattern

### Task 5: Barcode Detection Confirmation Modal

**Current State:**
Currently, when a barcode is detected, it's immediately processed without giving the user a chance to confirm or retry the scan.

**Improvement Goals:**
Implement a confirmation modal that appears when a barcode is successfully detected, providing options to:
- Confirm the detected barcode
- Try scanning again
- Cancel/dismiss the operation
- Improve user confidence in the scanning process

**Implementation Guidelines:**
1. **Modal Component Structure**
   - Create or use an existing Modal component in src/app/components/ui/
   - Implement overlay background with semi-transparency
   - Ensure proper positioning (centered) and z-index
   - Use proper animations for entrance/exit

2. **Modal Content Design**
   - Display a success icon or checkmark for visual confirmation
   - Show the detected barcode prominently
   - Include clear, concise text explaining the action required
   - Use the application's existing color scheme (from CSS variables)
   - Apply proper spacing and typography hierarchy

3. **Action Controls**
   - Implement distinct primary ("Confirm") and secondary ("Try Again") buttons
   - Consider adding a dismiss/cancel option if appropriate
   - Ensure buttons have proper hover/focus states
   - Provide adequate size for touch targets on mobile (minimum 44×44px)

4. **Integration with Scanner**
   - Update the BarcodeScanner component to show the modal when a barcode is detected
   - Pause scanning while the modal is open
   - Resume scanning if the user opts to try again
   - Process the barcode normally if confirmed

5. **Accessibility Considerations**
   - Implement focus trapping within the modal when open
   - Add keyboard support (Enter to confirm, Esc to dismiss)
   - Use proper ARIA attributes for screen readers
   - Ensure sufficient color contrast for text and interactive elements

6. **Code Structure**
   - Use React's createPortal for proper modal rendering
   - Implement TypeScript interfaces for props
   - Follow the established styling patterns using CSS modules

## Development Standards

When implementing these improvements:
- Maintain TypeScript type safety throughout
- Follow the project's existing CSS module pattern for styling
- Ensure all components are responsive across device sizes
- Keep accessibility in mind (proper contrast, keyboard navigation, etc.)
- Write clean, maintainable code with appropriate comments
