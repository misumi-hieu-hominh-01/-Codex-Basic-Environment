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

## Development Standards

When implementing these improvements:
- Maintain TypeScript type safety throughout
- Follow the project's existing CSS module pattern for styling
- Ensure all components are responsive across device sizes
- Keep accessibility in mind (proper contrast, keyboard navigation, etc.)
- Write clean, maintainable code with appropriate comments
