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

The upstream .NET API base URL is configured in `.env.local` (or Vercel Environment Variables) without the `NEXT_PUBLIC_` prefix so it stays private to server-side modules only (see [.env.example](.env.example)):

```env
DOTNET_API_BASE_URL=https://training-ecom1-a9a2cmbsefdvgwha.centralindia-01.azurewebsites.net
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

---

## Assignment 5: Product Listing, Search and Product Page

This assignment implements the complete catalog browsing experience: search, filtering, sorting, pagination, and a detailed product view.

### 1. Key Features

- **Server-Rendered Catalog (`/products`)**: Product data, categories, and brands are fetched directly on the server for fast initial loading and strong SEO.
- **Debounced Live Search**: The search input waits 300ms after you stop typing before updating results, preventing jitter and wasted requests.
- **URL as the Single Source of Truth**: All active filters, search keywords, sorting choices, and page numbers are stored in the URL query string (e.g., `/products?categoryId=1&minPrice=10000&sortBy=price&page=2`). If you refresh the page or share the link with someone else, the exact same filtered view opens.
- **Server-Side Filtering & Sorting**: Filtering and sorting are handled by the backend API, not by filtering arrays in the browser.
- **Pagination**: Includes Previous, Next, and direct page numbers, automatically resetting to page 1 whenever search or filters change.
- **Product Details (`/products/[id]`)**: Shows complete product details (category, brand, rating, price, description) and generates dynamic SEO metadata.
- **Interactive Islands**: Quantity selector and Add-to-Cart controls provide immediate feedback without needing the whole page to be client-side.

---

### 2. Server Components vs. Client Components (In Simple Terms)

Next.js App Router lets us divide our code into two main types of components: **Server Components** and **Client Components**. Here is which parts we used for each, and why:

#### A. Server Components (Run on the Server)
Think of Server Components as code that runs **behind the scenes on the server** before sending the finished HTML to the user's browser.

**Why we use Server Components:**
1. **Speed & First Load**: The browser receives ready-to-view HTML with the data already inside it. Users don't see blank screens or multiple loading spinners.
2. **Security**: We can talk directly to private backend APIs and databases without exposing internal API URLs or tokens to the browser.
3. **Smaller Download**: Server Component code stays on the server, so the user downloads much less JavaScript on their phone or laptop.
4. **Great for Search Engines (SEO)**: Google and other crawlers see the full page content immediately.

**Which parts are Server Components in our app:**
- **Product Listing Page (`src/app/products/(store)/page.tsx`)**: Reads URL search parameters, queries the backend API for products, and renders the responsive catalog grid and pagination (while `FilterSidebarSection` inside `src/app/products/(store)/layout.tsx` streams categories and brands independently via `<Suspense>`).
- **Product Details Page (`src/app/products/[id]/page.tsx`)**: Fetches the single product by ID, handles 404 Not Found if the product does not exist, and creates the SEO page title and description.
- **Product Grid (`src/components/product/ProductGrid.tsx`)**: Organizes products into a responsive 4-column layout on the server.

---

#### B. Client Components (Run in the Browser)
Think of Client Components as parts of the page that need to **listen and respond to the user** (clicks, typing, animations) using `'use client'`.

**Why we use Client Components:**
1. **Interactivity**: Browsers need JavaScript running on the user's device to listen to keyboard typing (`onChange`) or button clicks (`onClick`).
2. **React Hooks**: Features like `useState`, `useEffect`, and `useRef` only work inside the browser.

**Which parts are Client Components in our app:**
- **Search Bar (`ProductSearch.tsx`)**: Listens to keystrokes, manages the 300ms debounce timer, and smoothly updates the URL.
- **Filter Sidebar (`FilterSidebar.tsx` & `useProductFilters.ts`)**: Handles clicking filter checkboxes (categories, brands, price ranges, star ratings) and radio buttons for sorting. Receives pre-fetched categories and brands directly as props from the Server Layout (`layout.tsx`), completely eliminating client-side `useFetch` waterfalls and loading skeletons.
- **Pagination (`Pagination.tsx`)**: Listens to clicks on page numbers and Prev/Next buttons to change the active page.
- **Add to Cart & Quantity Selector (`ProductAddToCart.tsx`, `QuantitySelector.tsx`, `ProductCard.tsx`)**: Manages the `+` and `-` quantity buttons, and shows the "Added to Cart!" confirmation message.

---

### 3. Architecture: Internal Route Grouping (Recommended Next.js Pattern)

All product-related routes live cohesively inside `src/app/products/`:

```text
src/app/
└── products/
    ├── (store)/             <-- Route group for catalog listing (ignored in URL)
    │   ├── layout.tsx         <-- Injects FilterSidebar + 2-column layout ONLY for /products
    │   ├── page.tsx           <-- Serves URL: /products
    │   └── loading.tsx        <-- Catalog loading skeleton
    └── [id]/                  <-- Sibling to (store)
        ├── page.tsx           <-- Serves URL: /products/[id] (Full-width clean detail view)
        └── loading.tsx        <-- Detail page loading skeleton
```

- **How it works**: By wrapping the catalog listing in an internal route group `(store)`, the sidebar layout applies strictly to `/products`.
- **Clean Detail Pages**: Because `[id]` is a sibling to `(store)` and not a child of it, the product details page (`/products/[id]`) does not inherit the catalog sidebar and displays as a clean, full-width product view.
- **Zero URL Impact**: Route groups with parentheses `(store)` do not affect the public URLs (`/products` and `/products/123`).

---

## Assignment 6: Product Catalog with SSG and ISR

This assignment implements Static Site Generation (SSG) and Incremental Static Regeneration (ISR) across the product catalog, eliminates client-side data fetching waterfalls, and demonstrates how Next.js pre-renders pages at build time with time-based revalidation.

---

### 1. Architectural Highlights & Implementation

#### A. Server-Side Data Fetching for Featured Products on Home Page (`/`)
- Converted `src/app/page.tsx` into an `async` Server Component.
- Eliminated client-side `useFetch` state and spinners on the landing page.
- `src/app/page.tsx` streams `FeaturedProductsSection` and `ShopByCategorySection` concurrently inside `<Suspense>` boundaries (`FeaturedProductsSkeleton`, `ShopByCategorySkeleton`) with graceful inline fallbacks.
- Configured with `export const revalidate = 60` for 60-second ISR caching.

#### B. Static Site Generation (SSG) for Product Listing (`/products`)
- Uses dynamic URL `searchParams` rendering in `src/app/products/(store)/page.tsx` paired with 60s/300s tagged server `fetch` caches (`'products'`, `'categories'`, `'brands'`) and `<Suspense>` sidebar streaming in `layout.tsx` (originally prototyped as SSG with `force-static` for Assignment 6).
- Wrapped dynamic content in React `<Suspense fallback={<CatalogLoading />}>` so the page shell and initial catalog are pre-rendered into static HTML at build time (`○ /products 1m`).
- Served directly from cache on first request with instant Time to First Byte (TTFB).

#### C. Incremental Static Regeneration (ISR) with 60s Revalidation on Product Details (`/products/[id]`)
- Implemented `generateStaticParams()` in `src/app/products/[id]/page.tsx` to pre-render up to 50 products into static HTML at build time (`● /products/[id]`).
- Configured `export const revalidate = 60` on the route segment and `next: { revalidate: 60 }` on the upstream fetch call.
- Memoized product fetches with `React.cache()` to share upstream responses between `generateMetadata()` and the page component, preventing duplicate HTTP requests during page generation.

---

### 2. Production Build Output

Running `npm run build` generates the following route rendering table:

```text
▲ Next.js 16.4.2 (Turbopack)

Route (app)             Revalidate  Expire
┌ ○ /                           1m      1y
├ ○ /_not-found
├ ○ /about
├ ƒ /api/auth/login
├ ƒ /api/auth/refresh
├ ƒ /api/brands
├ ƒ /api/categories
├ ƒ /api/products
├ ƒ /api/products/[id]
├ ○ /login
├ ○ /products                   1m      1y
└   /products/[id]
  ├ ● /products/1               1m      1y
  ├ ● /products/2               1m      1y
  ├ ● /products/3               1m      1y
  └ ● [+27 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

#### Route Legend:
- **`○ / (Static, Revalidate 1m)`**: Pre-rendered at build time with server-fetched products and revalidated every 60 seconds.
- **`○ /products (Static, Revalidate 1m)`**: The catalog listing shell is pre-rendered at build time with SSG.
- **`● /products/[id] (SSG, Revalidate 1m)`**: Statically generated for 30 product pages ahead of time, with stale-while-revalidate background refresh every 60 seconds.
- **`ƒ /api/* (Dynamic)`**: Route handlers executing live on demand.

---

### 3. Demonstrating Revalidation by Changing Data

ISR utilizes the **Stale-While-Revalidate** caching pattern:

| Time | Action | Next.js Response | Header (`x-nextjs-cache`) | Upstream Backend Activity |
| :--- | :--- | :--- | :--- | :--- |
| **T = 0s** | First visitor requests `/products/1` | Returns pre-built static HTML (e.g. Price: ₹999) | `HIT` | None (served directly from cache) |
| **T = 15s** | Admin updates product price to ₹1,199 via PUT `/api/products/1` | Product updated in database | N/A | Database modified |
| **T = 30s** | Visitor refreshes `/products/1` (within 60s window) | Returns cached HTML showing ₹999 | `HIT` | None (cache is fresh) |
| **T = 65s** | Visitor refreshes `/products/1` (window expired) | **Instantly returns stale HTML** showing ₹999 | `STALE` | **Triggers background regeneration** |
| **T = 66s** | Subsequent visitors request `/products/1` | Returns updated HTML showing ₹1,199 | `HIT` | Served from newly generated cache |

#### Steps to Verify Live:
1. Start production server: `npm run build && npm start`
2. Run curl or test script:
   ```bash
   node -e "fetch('http://localhost:3000/products/1').then(r => console.log('Cache:', r.headers.get('x-nextjs-cache')))"
   ```
3. Observe header progression: `STALE` -> `HIT`.

---

### 4. Comparison: React SPA (`frontend_ecommerce`) vs. Next.js (`Trendify_next`)

| Metric / Dimension | React SPA (`frontend_ecommerce`) | Next.js SSG + ISR (`Trendify_next`) |
| :--- | :--- | :--- |
| **Initial HTML Response** | **Empty HTML shell**: `<div id="root"></div>`. No product text, headings, or images exist in the document source. | **Rich, complete HTML**: Pre-rendered product titles, prices, descriptions, images, and breadcrumbs are in the initial payload. |
| **Loading Experience** | **Double Waterfall**: Browser downloads JS bundle -> executes React -> triggers `useEffect` -> shows spinner -> renders data. | **Instant Visuals**: Users see finished HTML immediately upon connection. No blank screen, no flashing content. |
| **SEO & Social Indexing** | **Poor**: Web crawlers that do not execute complex JS see an empty page without meta tags or structured data. | **Optimal**: Crawlers inspect pre-rendered semantic HTML, dynamic OpenGraph metadata, and canonical links. |
| **Performance (TTFB / LCP)** | High Largest Contentful Paint (LCP) because images/text cannot load until client-side JS executes. | Very low Time to First Byte (TTFB) and fast LCP because static HTML is served directly from edge/CDN cache. |
| **Upstream Server Load** | **High**: Every page view and filter click triggers an upstream API call directly from every client. | **Minimal**: Requests are absorbed by the Next.js static cache; upstream API is contacted only once every 60 seconds. |
| **Data Freshness** | Always live (at the cost of latency and spinners). | Near real-time via 60-second ISR background revalidation. |



---

## Assignment 15: Automated Testing (Jest + React Testing Library)

This project features an automated testing suite built with **Jest**, **React Testing Library (RTL)**, and **TypeScript**, covering Client Components, Server Actions (`'use server'`), Route Handlers (`app/api`), and calculation utilities.

### 1. Test Suite Architecture

Testing in Next.js App Router requires different testing strategies depending on the architectural layer:

| Layer | Target Files | Environment | Testing Tool | Strategy & Key Assertions |
| :--- | :--- | :--- | :--- | :--- |
| **Client UI** | `ProductCard.tsx`, `CartView.tsx` | `jsdom` | React Testing Library + `userEvent` | Accessible queries (`getByRole`, `getByText`), quantity steppers, Add to Cart interaction, and auth redirection. |
| **Server Actions** | `actions/cart.ts` | `node`/`jsdom` | Jest (async function testing) | Zod schema validation (parameterized with `test.each`), session cookie checks, backend service sync, and `revalidatePath('/cart')`. |
| **Route Handlers** | `api/categories/route.ts`, `api/products/route.ts` | `node` (`@jest-environment node`) | Pure Node.js Web API testing | Direct invocation of `GET`/`POST`, HTTP status codes (`200`, `401`, `400`, `502`, `500`), and search/pagination query parameter extraction. |
| **Business Logic** | `utils/cartCalculations.ts` | `node` | Unit assertions | Subtotal, 18% GST tax precision, ₹100 standard shipping boundary, and defensive array fallback. |

---

### 2. Running Tests & Generating Coverage

```bash
# Run all 33 unit and component tests:
npm test

# Run tests in watch mode during development:
npm run test:watch

# Generate the full Istanbul code coverage report:
npm run test:coverage
```

---

### 3. Test Execution Results (33 Passing Tests)

```text
PASS  __tests__/api/categories.test.ts
PASS  __tests__/api/products.test.ts
PASS  __tests__/utils/cartCalculations.test.ts
PASS  __tests__/actions/cart.test.ts
PASS  __tests__/components/ProductCard.test.tsx
PASS  __tests__/components/CartView.test.tsx

Test Suites: 6 passed, 6 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        5.082 s
Ran all test suites.
```

---

### 4. Code Coverage Report

Running `npm run test:coverage` yields the following verified coverage metrics:

```text
------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                
------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------
All files               |   73.46 |     54.8 |   66.66 |   73.46 |                                                                                  
 src                    |     100 |      100 |     100 |     100 |                                                                                  
  config.ts             |     100 |      100 |     100 |     100 |                                                                                  
 src/actions            |   75.63 |    65.71 |     100 |   75.63 |                                                                                  
  cart.ts               |   75.63 |    65.71 |     100 |   75.63 | 24-26,55-59,71-76,96-100,109-110,114-115,124-129,149-153,161-162,170-175,191-196 
 src/app/api/categories |     100 |      100 |     100 |     100 |                                                                                  
  route.ts              |     100 |      100 |     100 |     100 |                                                                                  
 src/app/api/products   |   26.79 |    22.22 |     100 |   26.79 |                                                                                  
  route.ts              |   26.79 |    22.22 |     100 |   26.79 | 22-30,58-59,62-67,69-74,76-81,83-128,131-208                                     
 src/components/cart    |   86.11 |    64.44 |   66.66 |   86.11 |                                                                                  
  CartItemRow.tsx       |   99.09 |    72.72 |     100 |   99.09 | 27                                                                               
  CartOrderSummary.tsx  |     100 |       50 |     100 |     100 | 30-40                                                                            
  CartView.tsx          |    93.2 |    68.18 |     100 |    93.2 | 44,67,84-91,102                                                                  
  QuantitySelector.tsx  |   60.54 |       50 |    37.5 |   60.54 | 24-44,47-74,77-80,87-91                                                          
 src/components/common  |   99.31 |    66.66 |     100 |   99.31 |                                                                                  
  Button.tsx            |     100 |      100 |     100 |     100 |                                                                                  
  Card.tsx              |   97.67 |       50 |     100 |   97.67 | 33                                                                               
  RatingStars.tsx       |   98.24 |       40 |     100 |   98.24 | 51                                                                               
  StateMessage.tsx      |     100 |    33.33 |     100 |     100 | 48-78                                                                            
 src/components/product |    92.3 |    33.33 |     100 |    92.3 |                                                                                  
  ProductCard.tsx       |    92.3 |    33.33 |     100 |    92.3 | 32-35,38-41,52,56                                                                
 src/schemas            |     100 |      100 |     100 |     100 |                                                                                  
  cart.ts               |     100 |      100 |     100 |     100 |                                                                                  
 src/services           |   27.27 |      100 |       0 |   27.27 |                                                                                  
  serverApi.ts          |   27.27 |      100 |       0 |   27.27 | 36-39,42-44,46-48,55-66,73-86,92-104,107-209                                     
 src/utils              |   74.49 |    46.93 |   66.66 |   74.49 |                                                                                  
  cartCalculations.ts   |     100 |    55.55 |     100 |     100 | 9-13,33-42                                                                       
  formatters.ts         |   56.66 |      100 |      50 |   56.66 | 18-30                                                                            
  productAdapter.ts     |      50 |      100 |       0 |      50 | 25-37,44-55,61-70                                                                
  productParams.ts      |   87.28 |    14.28 |     100 |   87.28 | 29-30,32-39,61-63,69,75                                                          
  shimmer.ts            |   95.65 |       75 |     100 |   95.65 | 18                                                                               
  urlHelpers.ts         |   52.94 |    58.33 |   66.66 |   52.94 | 14-15,25-26,28-31,36-51                                                          
------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------
```

---

### 5. Key Highlights & Architectural Decisions

1. **Accessible Screen Queries (`getByRole`, `getByText`)**:
   - Tests assert on semantic HTML elements (`heading`, `button`, `spinbutton`, `link`) and accessible names rather than implementation details or CSS selectors.
2. **Real Schema Validation with `test.each`**:
   - Validation testing uses real Zod schemas (`AddToCartSchema.safeParse`) to verify invalid quantities (`0`, `150`) and negative product IDs (`-5`) without mocking business logic.
3. **Server Action & Guard Testing**:
   - Simulates Next.js 15/16 asynchronous `cookies()` (`await cookies()`) and verifies that unauthenticated access is immediately halted (`requireAuth: true`) without calling upstream services.
   - Tests that cache invalidation triggers (`revalidatePath('/cart')`) are fired upon mutation.
4. **Node Environment for Route Handlers**:
   - Route Handlers run under `/** @jest-environment node */` to utilize native Web API `Request` and `Response` objects without JSDOM browser emulation overhead.
5. **Code Fixes & Polish**:
   - Rectified an 8% vs 18% tax discrepancy in `CartOrderSummary.tsx`.
   - Added defensive array guards in `cartCalculations.ts` to prevent runtime crashes when items are uninitialized.
   - Resolved all ESLint warnings in test setup files for clean `npm run lint` execution.

---

## Architecture Refactor & Vercel Deployment Guide

### 1. Project Organization & Production Error Handling
- **Routing-Only `src/app/` + Domain-Grouped `src/components/`**: App Router segments under `src/app/` stay strictly routing-focused, while UI modules are grouped by domain (`about/`, `auth/`, `cart/`, `checkout/`, `common/`, `dashboard/`, `home/`, `layout/`, `orders/`, `product/`).
- **Shared Route Error Recovery (`src/components/common/RouteErrorFallback.tsx`)**: All route `error.tsx` boundaries delegate to a single fallback component that runs `router.refresh()` + `reset()` inside `startTransition`, ensuring retrying a failed Server Component re-executes the server fetch instead of replaying a cached client error.
- **Root Crash Fallback (`src/app/global-error.tsx`)**: Imports `./globals.css` directly (since `RootLayout` is replaced on root crashes) and uses a native `<a href="/">` hard reload to recover cleanly.
- **Session Refresh Proxy (`src/proxy.ts`)**: Protects `/cart`, `/checkout`, `/orders`, and `/dashboard` and silently exchanges expired short-lived `session` tokens using the `httpOnly` `refreshToken` cookie.

### 2. Deploying to Vercel via GitHub
1. **Import Repository**: Connect `Trendify_next` in Vercel (**Framework Preset**: `Next.js`, **Root Directory**: `./`, default `npm install` & `next build`). Every push to `main` triggers an automatic Production deployment, and branches/PRs generate Preview deployments.
2. **Environment Variables** (Vercel **Project Settings → Environment Variables**):
   - `DOTNET_API_BASE_URL` — Server-only upstream `.NET` backend URL (never prefix with `NEXT_PUBLIC_`).
   - `NEXT_PUBLIC_APP_URL` — Your live Vercel production URL (e.g., `https://<project>.vercel.app`) for `metadataBase` OpenGraph/canonical tags. Redeploy after adding/updating `NEXT_PUBLIC_*` variables.
   - Do **not** manually set `NODE_ENV=production` during the Vercel build step so `devDependencies` (`@tailwindcss/turbopack`, `typescript`) install cleanly.
3. **Function Region**: Set **Settings → Functions → Function Regions** to **Mumbai (`bom1`)** to minimize latency to the Azure backend in `centralindia-01`.
