# Warehouse Backend

This directory contains a minimal Express backend for the Warehouse Check-in & Storage Management App.

## Getting Started

```bash
npm install
npm run dev
```

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
