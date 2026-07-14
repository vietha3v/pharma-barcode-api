# @pharma-erp/recognition-service

Standalone NestJS microservice wrapping `@pharma-erp/recognition`.

Exposes expiry/batch/serial recognition as an HTTP service so the backend,
mobile, and web can all share one deployable recognition system (the library is
also published to npm for offline use).

## Endpoints

| Method | Path | Body |
|---|---|---|
| GET | `/api/health` | — |
| POST | `/api/recognize` | JSON `{ barcodeText?, imageUrl?, imageBase64?, imageMimeType?, hint? }` |
| POST | `/api/recognize/upload` | multipart `image` + optional `hint`, `barcodeText` |

Auth: `X-Recognition-Key` header when `RECOGNITION_API_KEY` is set.

## Run

```bash
cp .env.example .env   # fill AI keys
npm install
npm run build
npm start              # listens on RECOGNITION_PORT (default 3003)
```

## Backend integration

Set on the backend:

```
RECOGNITION_SERVICE_URL=http://localhost:3003
RECOGNITION_API_KEY=<same as service>
```

When set, `POST /inventory-counts/:id/extract-expiry` and `POST /recognition/recognize`
proxy to this service. When unset, the backend falls back to its in-process
`ExpiryExtractionService` (image OCR only).