# Trendify Next.js E-Commerce Application

An e-commerce web application built with Next.js App Router, TypeScript, and Tailwind CSS, featuring a dynamic navigation system and a custom REST API wrapper on top of an upstream .NET backend.

---

## Getting Started

First, install dependencies and run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## Assignment 4: Product Catalog REST API (Wrapper)

This project provides Route Handlers in Next.js serving as a Backend-For-Frontend (BFF) wrapper on top of the .NET Azure API:

### 1. Route Handlers Overview

| Method | Endpoint | Access | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Paginated product search & filtering. Returns `{ products, page, pageSize, totalRecords, totalPages, totalCount }`. | `200`, `502` |
| `POST` | `/api/products` | Admin | 2-step creation: creates product shell in `/api/v1/Products` and price in `/api/ProductPrices`. Includes rollback if price fails. | `201`, `400`, `401`, `403`, `502` |
| `GET` | `/api/products/[id]` | Public | Fetches a single product by numeric ID and converts to client shape. | `200`, `400`, `404`, `502` |
| `PUT` | `/api/products/[id]` | Admin | Updates product details (`name`, `description`, `categoryId`, `brandId`, `rating`). | `204`, `400`, `401`, `403`, `404`, `502` |
| `DELETE` | `/api/products/[id]` | Admin | Deletes product by ID from database. | `204`, `400`, `401`, `403`, `404`, `502` |

---

### 2. Upstream Configuration & Environment Variables

The upstream .NET API base URL is configured in `.env.local` without the `NEXT_PUBLIC_` prefix so it stays private to server-side Route Handlers only:

```env
DOTNET_API_BASE_URL=https://training-ecom1-a9a2cmbsefdvgwha.centralindia-01.azurewebsites.net
```

---

### 3. Notes on How Each Endpoint Was Tested

Testing was conducted using both the live Next.js application and the automated test runner in `scripts/test-crud.mjs`:

#### Running the Verification Script:
```bash
node scripts/test-crud.mjs
```

#### Test Execution & Verification Results:

```text
--- 1. Authenticating as Admin ---
Authenticated: bhumika (Admin), Status: 200

--- 2. Testing POST Product Shell ---
POST Product Status: 201, Created ID: 58

--- 3. Testing POST ProductPrice ---
POST ProductPrice Status: 201

--- 4. Testing GET Product by ID ---
GET Product Status: 200, Name: "Automated CRUD Test Mouse", Price: 1299

--- 5. Testing PUT Product Update ---
PUT Product Status: 204 (Expected: 204)

--- 6. Testing DELETE Product ---
DELETE Product Status: 204 (Expected: 204)

--- 7. Testing GET Deleted Product (Expected: 404) ---
GET Deleted Product Status: 404 (Expected: 404)

=== ALL 5 CRUD OPERATIONS FULLY VERIFIED! ===
```

#### Status Code Coverage:
- **`200 OK`**: Verified on `GET /api/products` (returns paginated results with `totalCount`) and `GET /api/products/[id]`.
- **`201 Created`**: Verified on `POST /api/products` (creates product shell and price).
- **`204 No Content`**: Verified on `PUT /api/products/[id]` and `DELETE /api/products/[id]`.
- **`400 Bad Request`**: Tested when passing non-numeric IDs (e.g. `/api/products/abc`) or missing required fields (`name`, `price <= 0`, `categoryId`).
- **`401 Unauthorized`**: Tested when attempting `POST`, `PUT`, or `DELETE` without providing the Bearer token in the `Authorization` header.
- **`404 Not Found`**: Verified when querying or deleting a non-existent product ID.
- **`502 Bad Gateway`**: Tested when the upstream .NET server is unreachable.
