---
applyTo: '**'
---
# MediaBazar Gateway - Copilot Instructions

## Architecture Overview

This is a **functional API gateway** built with Nitro framework that routes requests with authentication, rate limiting, and header injection. The codebase follows strict functional programming principles with pure functions and immutable transformations.

### Core Components

- **Gateway Plugin** (`server/plugins/gateway.ts`) - Entry point that initializes route configuration
- **Route Configuration** (`routes.json`) - JSON file defining proxy routes, auth requirements, and rate limits  
- **Functional Utils** (`server/utils/`) - Pure functions organized by domain (auth, proxy, rate limiting, headers)
- **Type Definitions** (`server/types/gateway.ts`) - Centralized TypeScript interfaces

## Key Patterns & Conventions

### 1. Functional Programming Style
All business logic uses pure functions with explicit input/output types:
```typescript
// Pattern: Return Result types instead of throwing exceptions
const authorize = async (event: H3Event, secret: string): Promise<AuthResult> => {
  // Returns { success: boolean, payload?: UserPayload, error?: string }
}

// Pattern: Compose small functions into larger workflows
const createRouteHandler = (route: Route, secret: string) => 
  defineEventHandler(async (event) => {
    // Rate limiting -> Auth -> Proxy (functional pipeline)
  })
```

### 2. Auto-Import System
Uses unimport with custom presets (`imports.ts`). Never import common utilities manually:
- `$fetch`, `safeDestr`, `createHash` are globally available
- H3 utilities: `getCookie`, `getHeader`, `createError`
- JWT functions: `SignJWT`, `jwtVerify`

### 3. Route Configuration Pattern
Routes are defined declaratively in `routes.json`:
```json
{
  "/api/:id": {
    "methods": ["GET", "POST"],
    "authorizationNeeded": true,
    "rateLimit": { "requests": 10, "window": 60 },
    "proxy": { "to": "http://backend:3000/api/:id" }
  }
}
```

### 4. JWT Header Forwarding
Authenticated requests automatically inject user data as headers:
- `X-User-Id`, `X-User-Email`, `X-User-Roles` (comma-separated)
- Use `createProxyHeaders(userPayload)` for custom header logic

### 5. Rate Limiting by IP
Uses in-memory store with client IP from `x-forwarded-for` header:
```typescript
const clientIP = extractClientIP(event) // Handles x-forwarded-for fallback
checkRateLimit(clientIP, { requests: 5, window: 60 })
```

## Development Workflows

### Testing
- `pnpm test:api` - Runs integration tests against live server
- Tests use `$fetch` with `ignoreResponseError: true` and `onResponse` callbacks
- Rate limit tests require unique IPs via `X-Forwarded-For` header
- Long-running tests (window expiry) need custom timeouts: `it("test", () => {}, 10000)`

### Configuration Changes
- Modify `routes.json` for new routes (hot-reloaded)
- Update `server/types/gateway.ts` for new route properties
- Use `loadRoutesConfig()` function for programmatic access

### Adding New Functional Modules
1. Create pure functions in `server/utils/newModule.ts`
2. Export types from `server/types/gateway.ts`
3. Re-export from `server/utils/index.ts`
4. Follow pattern: small pure functions → composition functions → main exported function

## Critical Integration Points

### Runtime Config
- `secret` - JWT signing key (required)
- `routesFile` - Path to routes JSON (defaults to `./routes.json`)

### Error Handling
Gateway uses functional error handling - no try/catch in business logic:
```typescript
// Return errors as values, not exceptions
if (!authResult.success) {
  throw createError({ message: authResult.error, status: 401 })
}
```

### Proxy Behavior
- URL parameters (`:id`) are replaced in proxy targets
- Search params are automatically appended
- User headers are injected only for authenticated routes
- Use `prepareProxyTarget(target, params, search)` for URL building

## File Organization Rules

- **Types**: `server/types/` - All TypeScript interfaces
- **Utils**: `server/utils/` - Pure functions grouped by domain
- **Routes**: `server/routes/` - Direct HTTP handlers (not proxy routes)
- **Plugins**: `server/plugins/` - Nitro plugins for app initialization

## Code Style Guidelines

- **Comments**: All code comments must be written in English
- **Function Size**: Keep functions small (<20 lines), pure (no side effects), and well-typed
- **Architecture**: Use composition over inheritance and immutable data transformations