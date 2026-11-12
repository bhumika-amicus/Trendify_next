/**
 * Server-only configuration.
 * Used by server-side modules (Server Actions, Route Handlers, Server Services, and proxy)
 * to communicate with the upstream .NET backend.
 */
export const DOTNET_API_BASE_URL =
  process.env.DOTNET_API_BASE_URL ||
  'https://training-ecom1-a9a2cmbsefdvgwha.centralindia-01.azurewebsites.net';
