/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/products/route';
import { NextRequest } from 'next/server';
import * as productService from '@/services/serverProductService';

jest.mock('@/services/serverProductService', () => ({
  getProductsServer: jest.fn(),
}));

describe('/api/products Route Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/products', () => {
    it('parses search and pagination query parameters and returns 200 with product list', async () => {
      const mockResult = {
        products: [
          { id: 1, name: 'Headphones', price: 2999 },
        ],
        pagination: { page: 2, limit: 12, total: 25, totalPages: 3 },
      };

      (productService.getProductsServer as jest.Mock).mockResolvedValueOnce(mockResult);

      // Create a real NextRequest with search parameters
      const req = new NextRequest('http://localhost:3000/api/products?search=headphones&page=2');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResult);
      expect(productService.getProductsServer).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'headphones',
          page: 2,
        })
      );
    });
  });

  describe('POST /api/products (Admin Protection)', () => {
    it('returns 401 Unauthorized when authorization header is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Laptop' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toMatch(/Admin authentication token is required/i);
    });

    it('returns 400 Bad Request when request body is malformed JSON', async () => {
      const req = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          authorization: 'Bearer admin-token',
        },
        body: 'invalid-non-json-string{',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Invalid JSON request body/i);
    });
  });
});

