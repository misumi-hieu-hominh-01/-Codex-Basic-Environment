# Warehouse Backend

This directory contains a minimal Express backend for the Warehouse Check-in & Storage Management App.

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file (you can copy from `.env.example`) to configure runtime
settings:

```
cp .env.example .env
```

The placeholders for Cloudinary credentials prepare the app for future cloud
image storage integration.

The server listens on `http://localhost:4000` by default and exposes basic routes for items and locations.

## Testing Item Location Assignment

You can manually verify that an item's location can be assigned or changed using the `PUT /items/:id` endpoint:

1. **Create an item without a location**
   ```bash
   curl -X POST http://localhost:4000/items \
        -H "Content-Type: application/json" \
        -d '{"barcode":"123","metadata":{}}'
   ```
   Note the returned item `id`.

2. **Assign a location**
   ```bash
   curl -X PUT http://localhost:4000/items/<id> \
        -H "Content-Type: application/json" \
        -d '{"location":"<locationId>"}'
   ```

3. **Fetch the updated item**
   ```bash
   curl http://localhost:4000/items/<id>
   ```

The response should include the populated `location` object.

## Environment Variables

The backend reads configuration from a `.env` file. An example file is
provided as `.env.example`. At minimum, you can copy it and adjust the values:

```bash
cp .env.example .env
```

The Cloudinary variables are placeholders for an upcoming switch to cloud
image storage:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

These are unused in local development but included for future compatibility.
