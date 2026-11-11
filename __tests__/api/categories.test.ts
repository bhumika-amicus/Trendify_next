/**
 * @jest-environment node
 */
import { GET } from '@/app/api/categories/route';
import * as productService from '@/services/serverProductService';

// Mock the upstream service layer so no network calls are made
jest.mock('@/services/serverProductService', () => ({
  getCategoriesServer: jest.fn(),
}));

describe('GET /api/categories Route Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error during 500 error test
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Valid Case - 200 OK with categories payload
  it('returns HTTP 200 with categories array when service succeeds', async () => {
    const mockCategories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Fashion' },
      { id: 3, name: 'Footwear' },
    ];

    (productService.getCategoriesServer as jest.Mock).mockResolvedValueOnce(mockCategories);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCategories);
  });

  // Test 2: Invalid / Upstream Failure Case - 502 Bad Gateway
  it('returns HTTP 502 when upstream categories service is unavailable (returns null)', async () => {
    (productService.getCategoriesServer as jest.Mock).mockResolvedValueOnce(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data).toEqual({
      error: 'Upstream categories service is unavailable',
    });
  });

  // Test 3: Exception Handling Case - 500 Internal Server Error
  it('returns HTTP 500 when an unhandled server error occurs', async () => {
    (productService.getCategoriesServer as jest.Mock).mockRejectedValueOnce(
      new Error('Connection timeout to upstream database')
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to retrieve categories',
    });
  });
});

