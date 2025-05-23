# PLAN.MD: Warehouse Check-in & Storage Management App

## 1. Introduction

This document outlines the plan for building a mobile-first web application designed for warehouse check-in and item storage management. The application will allow users to scan item barcodes, manage scanned items, and organize them into storage locations, including the ability to add new locations with images and descriptions.

## 2. Technology Stack

- **Frontend**: Next.js (React + TypeScript)
- **Styling**: CSS Modules
- **State Management**: React Context API / Zustand
- **Barcode Scanning**: `barcode-detect` and `react-webcam`
- **Data Persistence**:
  - **Local**: LocalStorage or IndexedDB
  - **Backend**: Node.js/Express with MongoDB
- **File Storage**: Cloudinary (or local storage for development)

## 3. Project Structure

### `codex-build-app/` (Frontend - Next.js)

```
codex-build-app/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── check-in/
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx      # Barcode scanning and item check-in
│   │   │   ├── history/
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx      # View item history
│   │   │   └── storage/
│   │   │       ├── page.module.css
│   │   │       └── page.tsx      # View/manage storage locations
│   │   ├── api/
│   │   │   ├── items/
│   │   │   │   └── route.ts      # API for item management
│   │   │   └── locations/
│   │   │       └── route.ts      # API for location management
│   │   ├── components/
│   │   │   ├── check-in/
│   │   │   │   ├── BarcodeConfirmModal.module.css
│   │   │   │   ├── BarcodeConfirmModal.tsx
│   │   │   │   ├── BarcodeScanner.module.css
│   │   │   │   ├── BarcodeScanner.tsx
│   │   │   │   ├── ManualBarcodeEntry.module.css
│   │   │   │   ├── ManualBarcodeEntry.tsx
│   │   │   │   └── ScannedItemsList.tsx
│   │   │   ├── history/
│   │   │   │   ├── CheckInItemModal.module.css
│   │   │   │   ├── CheckInItemModal.tsx
│   │   │   │   ├── DeleteConfirmModal.module.css
│   │   │   │   ├── DeleteConfirmModal.tsx
│   │   │   │   ├── HistoryItemCard.module.css
│   │   │   │   └── HistoryItemCard.tsx
│   │   │   ├── layout/
│   │   │   │   ├── MobileMenu.module.css
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   ├── Navbar.module.css
│   │   │   │   └── Navbar.tsx
│   │   │   ├── storage/
│   │   │   │   ├── DeleteLocationModal.module.css
│   │   │   │   ├── DeleteLocationModal.tsx
│   │   │   │   ├── LocationCard.module.css
│   │   │   │   ├── LocationCard.tsx
│   │   │   │   ├── LocationForm.module.css
│   │   │   │   ├── LocationForm.tsx
│   │   │   │   ├── LocationsList.module.css
│   │   │   │   └── LocationsList.tsx
│   │   │   └── ui/
│   │   │       ├── Button.module.css
│   │   │       ├── Button.tsx
│   │   │       ├── Input.module.css
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.module.css
│   │   │       ├── Modal.tsx
│   │   │       ├── ToggleSwitch.module.css
│   │   │       └── ToggleSwitch.tsx
│   │   ├── hooks/
│   │   │   └── useCamera.ts
│   │   ├── lib/
│   │   │   ├── barcodeUtils.ts
│   │   │   └── storageService.ts
│   │   ├── store/
│   │   │   ├── itemStore.tsx
│   │   │   ├── locationStore.tsx
│   │   │   └── StoreProvider.tsx
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── item.ts
│   │   │   └── location.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.module.css
│   │   └── page.tsx
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
```

### `backend/` (Backend - Node.js/Express)

```
backend/
├── public/
│   └── uploads/
│       └── locations/  # Local storage for location images (dev)
├── src/
│   ├── index.js        # Main server entry point
│   ├── models/
│   │   ├── item.js     # Mongoose model for items
│   │   └── location.js # Mongoose model for locations
│   ├── routes/
│   │   ├── items.js    # API routes for items
│   │   └── locations.js # API routes for locations
│   └── utils/
│       └── imageStorage.js # Utility for saving/deleting images
├── .env.example
├── package.json
└── README.md
```

## 4. Key Features

### 4.1. Barcode Check-in

- Scan item barcodes via camera (`BarcodeScanner.tsx`).
- Manual barcode entry (`ManualBarcodeEntry.tsx`).
- Confirmation of scanned/entered barcode (`BarcodeConfirmModal.tsx`).
- Display list of scanned items (`ScannedItemsList.tsx`).

### 4.2. Storage Management

- Add new / edit storage locations with image and description (on `LocationForm.tsx`).
- View/manage storage locations (`LocationsList.tsx`, `LocationCard.tsx` on `/storage`).
- Delete storage locations (`DeleteLocationModal.tsx`).

### 4.3. Item Management & History

- View details of an item (`ItemDetails.tsx`).
- View history of item check-ins and storage (`HistoryItemCard.tsx` on `/history`).
- Assign scanned items to storage locations (`CheckInItemModal.tsx`).
- Confirm deletion of history items (`DeleteConfirmModal.tsx`).

## 5. Pages and Components (Frontend)

### 5.1. Pages (`src/app/(pages)/`)

- **`/` (`page.tsx`)**: Home/Dashboard.
- **`/check-in` (`check-in/page.tsx`)**: Barcode scanning, manual entry, list of scanned items.
  - Components: `BarcodeScanner`, `ManualBarcodeEntry`, `BarcodeConfirmModal`, `ScannedItemsList`.
- **`/storage` (`storage/page.tsx`)**: Display storage locations.
  - Components: `LocationsList`, `LocationCard`, `DeleteLocationModal`.
- **`/storage/new` (`storage/new/page.tsx`)**: Form to add a new storage location.
  - Components: `LocationForm`.- **`/items/[barcode]/store` (`items/[barcode]/store/page.tsx`)**: Assign item to a storage location.
  - Components: `LocationsList`, `LocationForm`, `Modal`, `Button`.
- **`/history` (`history/page.tsx`)**: View history of item movements.
  - Components: `HistoryItemCard`, `CheckInItemModal`, `DeleteConfirmModal`, `ToggleSwitch`.

### 5.2. Core Components (`src/app/components/`)

- **UI Components (`ui/`)**:
  - `Button.tsx`
  - `Input.tsx`
  - `Modal.tsx`
  - `ToggleSwitch.tsx`
- **Layout Components (`layout/`)**:
  - `Navbar.tsx`
  - `MobileMenu.tsx`
- **Check-in Components (`check-in/`)**:
  - `BarcodeScanner.tsx`
  - `ManualBarcodeEntry.tsx`
  - `ScannedItemsList.tsx`
  - `BarcodeConfirmModal.tsx`
- **Storage Components (`storage/`)**:
  - `LocationForm.tsx`
  - `LocationCard.tsx`
  - `LocationsList.tsx`
  - `DeleteLocationModal.tsx`
- **History Components (`history/`)**:
  - `HistoryItemCard.tsx`
  - `CheckInItemModal.tsx`
  - `DeleteConfirmModal.tsx`

### 5.3. Hooks (`src/app/hooks/`)

- `useCamera.ts`: Custom hook for camera access.

### 5.4. Lib (`src/app/lib/`)

- `barcodeUtils.ts`: Utilities for barcode processing.
- `storageService.ts`: Service for interacting with backend or local storage.

### 5.5. Store (`src/app/store/`)

- `itemStore.tsx`: State management for items.
- `locationStore.tsx`: State management for locations.
- `StoreProvider.tsx`: Provider for the global state.

### 5.6. Types (`src/app/types/`)

- `item.ts`: TypeScript type definitions for items.
- `location.ts`: TypeScript type definitions for locations.
- `index.ts`: Barrel file for types.

## 6. Backend API Endpoints (`backend/src/routes/`)

### 6.1. Items (`/api/items`)

- **`GET /`**: List all items.
  - Query params: `status=pending` or `unassigned=true` to filter for items not yet in a location.
- **`GET /:id`**: Get a single item by ID.
- **`POST /`**: Create a new item.
  - Body: `{ barcode: string, name?: string, quantity?: number, metadata?: object, locationId?: string, checkInTime?: Date }`
- **`PUT /:id`**: Update an item.
  - Body: `{ barcode?: string, name?: string, quantity?: number, metadata?: object, locationId?: string, checkInTime?: Date }`
  - If `locationId` is provided and `checkInTime` is not, `checkInTime` is set to current time.
- **`DELETE /:id`**: Delete an item.

### 6.2. Locations (`/api/locations`)

- **`GET /`**: List all locations.
- **`GET /:id`**: Get a single location by ID.
- **`POST /`**: Create a new location.
  - Expects `multipart/form-data`.
  - Fields: `name: string`, `description?: string`, `image?: File`
  - Saves image to `public/uploads/locations/` (dev) or cloud.
- **`PUT /:id`**: Update a location.
  - Expects `multipart/form-data`.
  - Fields: `name?: string`, `description?: string`, `image?: File`
  - If new image is uploaded, old one is deleted.
- **`DELETE /:id`**: Delete a location (and its associated image).

## 7. Data Models (Backend - Mongoose)

### 7.1. `Item` (`backend/src/models/item.js`)

```javascript
{
  name: { type: String, default: 'Item [barcode]' },
  quantity: { type: Number, default: 1 },
  barcode: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now },
  checkInTime: { type: Date, default: null }, // Time item was placed into a location
  metadata: { type: mongoose.Schema.Types.Mixed },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null }
}
```

### 7.2. `Location` (`backend/src/models/location.js`)

```javascript
{
  name: { type: String, required: true },
  description: String,
  imageUrl: String // URL of the uploaded image
}
```

## 8. State/Data Flow Plan (Frontend)

- **Global State (Zustand/Context - `src/app/store/`)**:
  - `scannedItems`: Array of items scanned but not yet placed.
  - `storageLocations`: Array of storage locations.
  - `itemHistory`: Array of items that have been checked in and stored.
- **Local Component State**: Form inputs, loading/error states.
- **Data Flow**:
  1.  **Scanning/Manual Entry**: `BarcodeScanner.tsx` / `ManualBarcodeEntry.tsx` -> `itemStore` (updates `scannedItems`).
  2.  **Adding Location**: `LocationForm.tsx` -> `storageService.ts` (API call) -> `locationStore` (updates `storageLocations`).
  3.  **Storing Item**: User selects item from `ScannedItemsList.tsx` & location from `LocationsList.tsx` (on `CheckInItemModal.tsx`) -> `storageService.ts` (API call) -> `itemStore` (updates item status, potentially moves from `scannedItems` to `itemHistory`).
- **Backend Interaction**:
  - API calls via `fetch` or a library (e.g., Axios) in `storageService.ts`.
  - Optimistic UI updates where appropriate.

## 9. Barcode Scanning

- Library: `barcode-detect` and `react-webcam`.
- Implementation: `BarcodeScanner.tsx` initializes library, requests camera permissions, displays video feed, handles scan events.

## 10. File Upload and Storage (Locations)

- **Frontend**: `LocationForm.tsx` uses `<input type="file">`.
- **Backend**:
  - `backend/src/routes/locations.js` uses `multer` for handling `multipart/form-data`.
  - `backend/src/utils/imageStorage.js` handles saving files locally (e.g., to `public/uploads/locations/`) and deleting them.
  - Stores image path/URL in `Location` model.

## 11. Future Considerations / Enhancements

- User authentication.
- Advanced search and filtering for items and locations.
- Editing existing items and locations.
- Offline support.
- Reporting and analytics.
- Cloud deployment for backend and image storage (e.g., Vercel for Next.js, Heroku/AWS for backend, Cloudinary/S3 for images).

This plan provides a comprehensive overview based on the current project structure.
