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
# Ensure dev server is running (npm run dev), then:
node scripts/test-crud.mjs
```

#### Test Execution & Verification Results:

```text
===============================================================
 TESTING NEXT.JS PRODUCT CATALOG REST API WRAPPER (ASSIGNMENT 4)
 Target: http://localhost:3000/api
===============================================================

1. [AUTH] Logging in as Admin via POST /api/auth/login...
   --> Status: 200 OK | Logged in as: bhumika (Admin)

2. [GET /api/products] Testing paginated product list...
   --> Status: 200 OK | Products count: 5 | TotalCount: 30 | TotalPages: 6

3. [400 ERROR] Testing GET /api/products/abc with non-numeric ID...
   --> Status: 400 Bad Request | Message: "Invalid product ID. Must be a numeric value."

4. [401 ERROR] Testing POST /api/products without Authorization header...
   --> Status: 401 Unauthorized | Message: "Unauthorized: Admin authentication token is required."

5. [400 ERROR] Testing POST /api/products with missing/invalid price...
   --> Status: 400 Bad Request | Message: "A valid positive price is required."

6. [201 CREATED] Testing POST /api/products (Unified 2-step Product + Price)...
   --> Status: 201 Created | Created ID: #62 | Name: "Trendify Wireless Gaming Headset" | Price: ₹2499

7. [200 OK] Testing GET /api/products/62 to verify no 500 error...
   --> Status: 200 OK | Name: "Trendify Wireless Gaming Headset" | Price: ₹2499

8. [401 ERROR] Testing PUT /api/products/62 without token...
   --> Status: 401 Unauthorized | Message: "Unauthorized: Admin authentication token is required."

9. [204 NO CONTENT] Testing PUT /api/products/62 with valid update...
   --> Status: 204 No Content (Update successful)

10. [401 ERROR] Testing DELETE /api/products/62 without token...
    --> Status: 401 Unauthorized | Message: "Unauthorized: Admin authentication token is required."

11. [204 NO CONTENT] Testing DELETE /api/products/62 with Admin token...
    --> Status: 204 No Content (Deletion successful)

12. [404 NOT FOUND] Testing GET /api/products/62 after deletion...
    --> Status: 404 Not Found | Message: "Product with ID 62 was not found."

13. [404 NOT FOUND] Testing DELETE on non-existent product ID #999999...
    --> Status: 404 Not Found | Message: "Product with ID 999999 was not found."

===============================================================
 SUMMARY: ALL 13 TEST CASES PASSED WITH CORRECT STATUS CODES!
 Covered: 200 OK, 201 Created, 204 No Content, 400 Bad Request,
          401 Unauthorized, 404 Not Found
===============================================================
```

#### Status Code Coverage:
- **`200 OK`**: Verified on `GET /api/products` (returns paginated results with `totalCount`) and `GET /api/products/[id]`.
- **`201 Created`**: Verified on `POST /api/products` (creates product shell and price atomically).
- **`204 No Content`**: Verified on `PUT /api/products/[id]` and `DELETE /api/products/[id]`.
- **`400 Bad Request`**: Tested with non-numeric IDs (e.g. `/api/products/abc`) and invalid request bodies (missing price or invalid price).
- **`401 Unauthorized`**: Tested when attempting `POST`, `PUT`, or `DELETE` without providing the Bearer token in the `Authorization` header.
- **`404 Not Found`**: Verified when querying or deleting a non-existent or previously deleted product ID.
- **`502 Bad Gateway`**: Handled when upstream .NET server is unreachable or fails to create price.

