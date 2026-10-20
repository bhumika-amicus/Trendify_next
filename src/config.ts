/**
 * Server-only configuration.
 * Used exclusively by Next.js Route Handlers (app/api/...) to contact the .NET backend.
 */
export const DOTNET_API_BASE_URL =
  process.env.DOTNET_API_BASE_URL ||
  'https://training-ecom1-a9a2cmbsefdvgwha.centralindia-01.azurewebsites.net';
