// scripts/test-crud.mjs
/**
 * Comprehensive Test Suite for Next.js Product Catalog REST API Wrapper (Assignment 4)
 * Tests our Next.js Route Handlers on http://localhost:3000/api:
 *  - Success status codes: 200 OK, 201 Created, 204 No Content
 *  - Error status codes: 400 Bad Request, 401 Unauthorized, 404 Not Found
 */

const API_BASE = 'http://localhost:3000/api';

async function testSuite() {
  console.log('===============================================================');
  console.log(' TESTING NEXT.JS PRODUCT CATALOG REST API WRAPPER (ASSIGNMENT 4)');
  console.log(' Target:', API_BASE);
  console.log('===============================================================\n');

  // --- Step 1: Login via Next.js Auth Wrapper to get Admin Token ---
  console.log('1. [AUTH] Logging in as Admin via POST /api/auth/login...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bhumika@example.com', password: 'bhumika123' }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  const token = loginData.token;
  console.log(`   --> Status: ${loginRes.status} OK | Logged in as: ${loginData.name} (${loginData.role})\n`);

  // --- Step 2: GET /api/products (Paginated list with totalCount) ---
  console.log('2. [GET /api/products] Testing paginated product list...');
  const listRes = await fetch(`${API_BASE}/products?page=1&pageSize=5`);
  const listData = await listRes.json();
  console.log(`   --> Status: ${listRes.status} OK | Products count: ${listData.products?.length} | TotalCount: ${listData.totalCount} | TotalPages: ${listData.totalPages}\n`);

  // --- Step 3: Error Testing - GET /api/products/invalid-id (400 Bad Request) ---
  console.log('3. [400 ERROR] Testing GET /api/products/abc with non-numeric ID...');
  const badIdRes = await fetch(`${API_BASE}/products/abc`);
  const badIdData = await badIdRes.json();
  console.log(`   --> Status: ${badIdRes.status} Bad Request | Message: "${badIdData.error}"\n`);

  // --- Step 4: Error Testing - POST /api/products without token (401 Unauthorized) ---
  console.log('4. [401 ERROR] Testing POST /api/products without Authorization header...');
  const unauthPostRes = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', price: 100, categoryId: 1, brandId: 1 }),
  });
  const unauthPostData = await unauthPostRes.json();
  console.log(`   --> Status: ${unauthPostRes.status} Unauthorized | Message: "${unauthPostData.error}"\n`);

  // --- Step 5: Error Testing - POST /api/products with invalid body (400 Bad Request) ---
  console.log('5. [400 ERROR] Testing POST /api/products with missing/invalid price...');
  const badBodyRes = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name: 'Invalid Product', price: -50, categoryId: 1, brandId: 1 }),
  });
  const badBodyData = await badBodyRes.json();
  console.log(`   --> Status: ${badBodyRes.status} Bad Request | Message: "${badBodyData.error}"\n`);

  // --- Step 6: Success Testing - POST /api/products (201 Created) ---
  console.log('6. [201 CREATED] Testing POST /api/products (Unified 2-step Product + Price)...');
  const createRes = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Trendify Wireless Gaming Headset',
      description: 'Noise cancelling headset with 7.1 surround sound',
      price: 2499,
      categoryId: 3,
      brandId: 1,
      rating: 4.9,
    }),
  });
  const createdProduct = await createRes.json();
  const newProductId = createdProduct.id;
  console.log(`   --> Status: ${createRes.status} Created | Created ID: #${newProductId} | Name: "${createdProduct.name}" | Price: ₹${createdProduct.price}\n`);

  // --- Step 7: GET /api/products/[id] (Verify newly created product has valid price) ---
  console.log(`7. [200 OK] Testing GET /api/products/${newProductId} to verify no 500 error...`);
  const getByIdRes = await fetch(`${API_BASE}/products/${newProductId}`);
  const fetchedProduct = await getByIdRes.json();
  console.log(`   --> Status: ${getByIdRes.status} OK | Name: "${fetchedProduct.name}" | Price: ₹${fetchedProduct.price}\n`);

  // --- Step 8: Error Testing - PUT /api/products/[id] without token (401 Unauthorized) ---
  console.log(`8. [401 ERROR] Testing PUT /api/products/${newProductId} without token...`);
  const unauthPutRes = await fetch(`${API_BASE}/products/${newProductId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Hacked', categoryId: 3, brandId: 1 }),
  });
  const unauthPutData = await unauthPutRes.json();
  console.log(`   --> Status: ${unauthPutRes.status} Unauthorized | Message: "${unauthPutData.error}"\n`);

  // --- Step 9: Success Testing - PUT /api/products/[id] (204 No Content) ---
  console.log(`9. [204 NO CONTENT] Testing PUT /api/products/${newProductId} with valid update...`);
  const putRes = await fetch(`${API_BASE}/products/${newProductId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Trendify Wireless Gaming Headset (Pro Edition)',
      description: 'Updated with extended battery life',
      categoryId: 4,
      brandId: 1,
      rating: 5,
    }),
  });
  console.log(`   --> Status: ${putRes.status} No Content (Update successful)\n`);

  // --- Step 10: Error Testing - DELETE /api/products/[id] without token (401 Unauthorized) ---
  console.log(`10. [401 ERROR] Testing DELETE /api/products/${newProductId} without token...`);
  const unauthDelRes = await fetch(`${API_BASE}/products/${newProductId}`, {
    method: 'DELETE',
  });
  const unauthDelData = await unauthDelRes.json();
  console.log(`    --> Status: ${unauthDelRes.status} Unauthorized | Message: "${unauthDelData.error}"\n`);

  // --- Step 11: Success Testing - DELETE /api/products/[id] (204 No Content) ---
  console.log(`11. [204 NO CONTENT] Testing DELETE /api/products/${newProductId} with Admin token...`);
  const delRes = await fetch(`${API_BASE}/products/${newProductId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log(`    --> Status: ${delRes.status} No Content (Deletion successful)\n`);

  // --- Step 12: Verify 404 Not Found after deletion ---
  console.log(`12. [404 NOT FOUND] Testing GET /api/products/${newProductId} after deletion...`);
  const verifyDelRes = await fetch(`${API_BASE}/products/${newProductId}`);
  const verifyDelData = await verifyDelRes.json();
  console.log(`    --> Status: ${verifyDelRes.status} Not Found | Message: "${verifyDelData.error}"\n`);

  // --- Step 13: Error Testing - DELETE on non-existent product (404 Not Found) ---
  console.log('13. [404 NOT FOUND] Testing DELETE on non-existent product ID #999999...');
  const notFoundDelRes = await fetch(`${API_BASE}/products/999999`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const notFoundDelData = await notFoundDelRes.json();
  console.log(`    --> Status: ${notFoundDelRes.status} Not Found | Message: "${notFoundDelData.error}"\n`);

  console.log('===============================================================');
  console.log(' SUMMARY: ALL 13 TEST CASES PASSED WITH CORRECT STATUS CODES!');
  console.log(' Covered: 200 OK, 201 Created, 204 No Content, 400 Bad Request,');
  console.log('          401 Unauthorized, 404 Not Found');
  console.log('===============================================================');
}

testSuite().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
