# PLAN.MD: Warehouse Check-in & Storage Management App

## 1. Introduction

This document outlines the plan for building a mobile-first web application designed for warehouse check-in and item storage management. The application will allow users to scan item barcodes, manage scanned items, and organize them into storage locations, including the ability to add new locations with images and descriptions.

## 2. Technology Stack

- **Frontend**: Next.js (React + TypeScript) - Chosen for its robust framework features, server-side rendering capabilities, and strong TypeScript support.
- **Styling**: CSS Modules as already present in `page.module.css` for utility-first styling, ensuring a responsive and mobile-first design.
- **State Management**: React Context API for simpler global state or Redux ToolKits for more complex state.
- **Barcode Scanning**: A library like `barcode-detect` and `react-webcam` for accessing the device camera and decoding barcodes.
- **Data Persistence**:
  - **Local**: LocalStorage or IndexedDB for offline support or temporary storage of scanned items before backend sync.
  - **Backend**: A simple Node.js/Express backend with a database (MongoDB) for user authentication, data storage (items, locations, images), and API endpoints.
- **File Storage**: Cloud storage solution (Cloudinary) for storing images of storage locations.

## 3. Project Structure (Extending Existing Next.js App)

```
codex-build-app/
├── public/
│   ├── ... (existing files)
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── check-in/
│   │   │   │   └── page.tsx      # Barcode scanning and item check-in
│   │   │   ├── storage/
│   │   │   │   ├── page.tsx      # View/manage storage locations
│   │   │   │   └── new/
│   │   │   │       └── page.tsx  # Add new storage location
│   │   │   └── items/
│   │   │       └── [barcode]/
│   │   │           └── store/
│   │   │               └── page.tsx # Page to select/create storage for a scanned item
│   │   ├── api/                  # Next.js API Routes (if building a simple backend here)
│   │   │   ├── items/
│   │   │   │   └── route.ts      # API for item management
│   │   │   └── locations/
│   │   │       └── route.ts      # API for location management
│   │   ├── components/
│   │   │   ├── ui/               # General UI components (Button, Input, Modal, etc.)
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Input.tsx
│   │   │   ├── check-in/
│   │   │   │   ├── BarcodeScanner.tsx
│   │   │   │   └── ScannedItemsList.tsx
│   │   │   ├── storage/
│   │   │   │   ├── LocationForm.tsx
│   │   │   │   ├── LocationCard.tsx
│   │   │   │   └── LocationsList.tsx
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx
│   │   │       └── MobileMenu.tsx
│   │   ├── lib/                  # Utility functions, helper functions
│   │   │   └── barcodeUtils.ts
│   │   │   └── storageService.ts # Functions for interacting with backend/local storage
│   │   ├── hooks/                # Custom React Hooks
│   │   │   └── useCamera.ts
│   │   ├── store/                # State management (e.g., Zustand or Context)
│   │   │   ├── itemStore.ts
│   │   │   └── locationStore.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── index.ts          # Main types file
│   │   │   ├── item.ts
│   │   │   └── location.ts
│   │   ├── globals.css
│   │   ├── layout.tsx            # Main app layout
│   │   ├── page.module.css
│   │   └── page.tsx              # Homepage (can be a dashboard or redirect)
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── PLAN.md
```

## 4. Key Features

### 4.1. Barcode Check-in

- **Scan Item Barcodes**: Utilize device camera to scan barcodes.
  - Library: `barcode-detect` and `react-webcam`.
  - UI: Display camera feed, provide clear instructions.
- **Save Scan History**:
  - Store barcode value, timestamp of scan.
  - Allow adding metadata (e.g., item name, quantity if applicable - though not explicitly requested, good for future).
  - Initially, this list can be "unprocessed" items.

### 4.2. Storage Management

- **Add New Storage Locations**:
  - Upload an image of the location.
  - Enter a textual description (e.g., "Shelf A, Row 3, Bin 2").
  - Assign a unique ID/name to the location.
- **View/Manage Storage Locations**:
  - Display locations in a list or grid format.
  - Show image and description for each location.
  - (Future: Edit/delete locations).

## 5. Workflow Overview

1.  **Check-in Item**:

    - User navigates to the "Check-in" page.
    - Has two input options:
      1. **Scan Barcode via Camera**:
      - Activates device camera for barcode scanning.
      - On successful scan, item (barcode value + timestamp) is added to a **"Recently Scanned"** or **"Pending Storage"** list.
      2. **Manual Barcode Entry**:
      - User taps on **"Enter Manually"** button.
      - Inputs barcode value via text field.
      - (Optional) Can add metadata (e.g. item name).
      - Upon submit, item is added to the same list as scanned ones.
    - User can continue checking in multiple items using either method.
    - All scanned/entered items appear in a scrollable list with: Barcode, Time, Input method (e.g. `scanned`, `manual`)

2.  **Store Item**:
    - **Option A (From Scanned List)**:
      - User views the "Recently Scanned" list.
      - Selects an item to store.
      - The app might prompt to confirm the item (e.g., by showing its barcode).
    - **Option B (Direct Store with Re-scan)**:
      - User intends to store an item they have physically.
      - Scans the item's barcode again to identify it.
    - **Assigning Location**:
      - After identifying the item, the user is presented with a list of existing storage locations.
      - They can select an existing location.
      - OR, they can choose to "Create New Location".
        - If creating new: User is taken to the "Add New Storage Location" page/modal. They upload an image, add a description. The new location is saved.
        - The item is then associated with this newly created (or selected) location.
    - **Data Update**: The item is marked as "stored" and linked to the chosen storage location ID. The "Recently Scanned" list is updated (item removed or status changed).

## 6. Pages and Components

### Pages (`src/app/(pages)/`)

- **`/` (Home/Dashboard - `src/app/page.tsx`)**:
  - Responsibilities: Overview, quick links to "Check-in" and "Storage Management".
- **`/check-in` (`src/app/(pages)/check-in/page.tsx`)**:
  - Responsibilities: Host the barcode scanning interface, allow manual barcode input via form, display a list of recently scanned/pending items.
  - Components: `BarcodeScanner`, `ScannedItemsList`.
- **`/storage` (`src/app/(pages)/storage/page.tsx`)**:
  - Responsibilities: Display all storage locations, allow navigation to add a new location.
  - Components: `LocationsList`, `Button` (to add new).
- **`/storage/new` (`src/app/(pages)/storage/new/page.tsx`)**:
  - Responsibilities: Form to add a new storage location (image upload, description).
  - Components: `LocationForm`.
- **`/items/[barcode]/store` (`src/app/(pages)/items/[barcode]/store/page.tsx`)**:
  - Responsibilities: Page to assign a scanned item (identified by `barcode`) to a storage location. Shows item details, list of locations, and option to create a new location.
  - Components: `ItemDetails`, `LocationsList`, `Button` (to create new location if needed).

### Core Components (`src/app/components/`)

- **`ui/Button.tsx`**: Reusable button component.
- **`ui/Input.tsx`**: Reusable input field.
- **`ui/Modal.tsx`**: Reusable modal component.
- **`layout/Navbar.tsx`**: Navigation bar for the app.
- **`layout/MobileMenu.tsx`**: Hamburger menu for mobile navigation.
- **`check-in/BarcodeScanner.tsx`**:
  - Responsibilities: Integrate with barcode scanning library, display camera feed, handle scan events.
- **`check-in/ScannedItemsList.tsx`**:
  - Responsibilities: Display items that have been scanned but not yet stored. Allow selection for storage.
- **`storage/LocationForm.tsx`**:
  - Responsibilities: Form for creating/editing a storage location (image upload, description input).
- **`storage/LocationCard.tsx`**:
  - Responsibilities: Display a single storage location's information (image, description).
- **`storage/LocationsList.tsx`**:
  - Responsibilities: Display a list/grid of `LocationCard` components. Allow selection of a location.

## 7. State/Data Flow Plan

- **Global State (React Context / Redux)**:
  - `scannedItems`: Array of items that have been scanned but not yet placed in storage. Each item: `{ barcode: string, scannedAt: Date, source: "scan" | "manual", metadata?: object }`.
  - `storageLocations`: Array of storage locations. Each location: `{ id: string, name: string, description: string, imageUrl?: string }`.
  - `userSession` (if authentication is implemented).
- **Local Component State**:
  - Form inputs, loading states, error messages within specific components.
- **Data Flow**:
  1.  **Scanning**: `BarcodeScanner` or `ManualEntryForm` calls `addScannedItem()` -> updates `scannedItems` in global store.
  2.  **Adding Location**: `LocationForm` submits data, calls a service function (e.g., in `storageService.ts`) to save the location (API call or local storage), then updates `storageLocations` in global store.
  3.  **Storing Item**:
      - User selects an item from `ScannedItemsList` or scans an item.
      - User selects a location from `LocationsList` or creates a new one via `LocationForm`.
      - A service function updates the item's status (associates it with a location ID) and potentially moves it from `scannedItems` to a "stored items" list (if maintained separately) or updates its properties.
- **Backend Interaction**:
  - API calls will be made from service functions (e.g., `src/lib/storageService.ts`) to fetch/send data to the backend.
  - Optimistic updates can be used for a smoother UX (update UI immediately, then sync with backend).

## 8. Barcode Scanning Library

- **Recommendation**: `barcode-detect` and `react-webcam`.
  - `react-zxing`: Provides access to webcam video feed within React components.Flexible and works well with custom frame processing.
  - `barcode-detect`: a modern native web API that allows browsers to detect barcodes directly from images or camera feeds, without needing external libraries.
- **Implementation**:
  - The `BarcodeScanner.tsx` component will initialize the chosen library.
  - Request camera permissions.
  - Display the video stream.
  - On successful scan, a callback function will receive the barcode data.
  - This data will be used to update the application state.
  - Provide user feedback (e.g., vibration, sound, visual confirmation).

## 9. File Upload and Storage Logic

- **Frontend (Client-side)**:
  - In `LocationForm.tsx`, use an `<input type="file" accept="image/*" />`.
  - On file selection, get the `File` object.
  - Optional: Preview the image locally before upload.
- **Backend/Storage Service**:
  - **Option 1 (Using Next.js API Route as a proxy)**:
    1.  Client sends the image file (e.g., as `FormData`) to a Next.js API route (e.g., `/api/upload-image`).
    2.  The API route receives the file and then uploads it to the chosen cloud storage service (AWS S3, Firebase Storage, etc.) using their respective SDKs.
    3.  The cloud service returns a URL for the uploaded image.
    4.  The API route returns this URL to the client.
    5.  The client then saves this URL along with the location description.
  - **Option 2 (Direct Client-to-Cloud Upload - if supported and secure)**:
    1.  Client requests a signed URL from the backend (Next.js API route).
    2.  Backend generates a signed URL (e.g., for S3) that allows temporary, direct upload from the client to the cloud storage.
    3.  Client uploads the file directly to the cloud storage using the signed URL.
    4.  The image URL is then used when saving the location data.
- **Storage**:
  - Store only the URL of the image in your database (PostgreSQL, MongoDB, Firebase Realtime Database/Firestore) associated with the storage location ID.
  - The actual image files reside in the cloud storage.

## 10. Backend (Optional but Recommended)

While some functionality can be mocked with local storage for a PoC, a real backend is crucial for:

- Persistent storage of items and locations.
- User accounts and authentication (if multiple users or data security is needed).
- Centralized business logic.
- Securely handling image uploads and managing storage URLs.
- **Choices**:
  - **Next.js API Routes**: Good for simpler backends integrated within the Next.js app.
  - **Dedicated Backend (Node.js/Express)**: For more complex logic or if separating concerns.
  - **CloudDB (Cloudinary, MongoDB)**: Speeds up development with: Built-in auth, Realtime DB,... For image upload Cloudinary can be used in combination with URL mapping in the database.

## 11. Testing (Optional Notes)

- **Unit Tests (Jest)**:
  - Test individual components (e.g., `Button`, `LocationCard`).
  - Test utility functions (e.g., barcode parsing, data transformation).
  - Mock API calls and service functions.

## 12. Deployment (Optional Notes)

- **Vercel**: Native platform for Next.js apps, offers seamless deployment, CI/CD, serverless functions.

This plan provides a comprehensive starting point. Details will be refined during development.
