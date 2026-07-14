# pharma-barcode-api

Standalone NestJS microservice for pharmaceutical barcode and label recognition.
Exposes expiry/batch/serial recognition as an HTTP service so backend, mobile,
and web apps can share one deployable recognition system.

> **Prerequisite:** publish `@pharma-barcode/recognition` to npm first, or
> install it from git until it is available on the registry.

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