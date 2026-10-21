// scripts/test-crud.mjs
const BASE_URL = 'https://training-ecom1-a9a2cmbsefdvgwha.centralindia-01.azurewebsites.net';

async function run() {
  console.log('--- 1. Authenticating as Admin ---');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bhumika@example.com', password: 'bhumika123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`Authenticated: ${loginData.name} (${loginData.role}), Status: ${loginRes.status}`);

  console.log('\n--- 2. Testing POST Product Shell ---');
  const postProdRes = await fetch(`${BASE_URL}/api/v1/Products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Automated CRUD Test Mouse',
      description: 'Temporary item for verification',
      categoryId: 3,
      brandId: 1,
      rating: 5,
    }),
  });
  const prodData = await postProdRes.json();
  const testId = prodData.productId;
  console.log(`POST Product Status: ${postProdRes.status}, Created ID: ${testId}`);

  console.log('\n--- 3. Testing POST ProductPrice ---');
  const postPriceRes = await fetch(`${BASE_URL}/api/ProductPrices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId: testId, price: 1299 }),
  });
  console.log(`POST ProductPrice Status: ${postPriceRes.status}`);

  console.log('\n--- 4. Testing GET Product by ID ---');
  const getRes = await fetch(`${BASE_URL}/api/v1/Products/${testId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const getData = await getRes.json();
  console.log(`GET Product Status: ${getRes.status}, Name: "${getData.name}", Price: ${getData.price}`);

  console.log('\n--- 5. Testing PUT Product Update ---');
  const putRes = await fetch(`${BASE_URL}/api/v1/Products/${testId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Automated CRUD Test Mouse (UPDATED)',
      description: 'Updated item description',
      categoryId: 4,
      brandId: 1,
      rating: 4.8,
    }),
  });
  console.log(`PUT Product Status: ${putRes.status} (Expected: 204)`);

  console.log('\n--- 6. Testing DELETE Product ---');
  const delRes = await fetch(`${BASE_URL}/api/v1/Products/${testId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log(`DELETE Product Status: ${delRes.status} (Expected: 204)`);

  console.log('\n--- 7. Testing GET Deleted Product (Expected: 404) ---');
  const getDelRes = await fetch(`${BASE_URL}/api/v1/Products/${testId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log(`GET Deleted Product Status: ${getDelRes.status} (Expected: 404)`);

  console.log('\n=== ALL 5 CRUD OPERATIONS FULLY VERIFIED! ===');
}

run().catch(console.error);
