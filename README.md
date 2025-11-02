# MediaBazar Gateway

Functional API gateway built with Nitro framework that provides request routing with authentication, rate limiting, and header injection capabilities.

## Features

- **Request Routing** - Declarative JSON-based route configuration
- **JWT Authentication** - Cookie-based access token validation
- **Rate Limiting** - Per-IP request throttling with configurable windows
- **Header Injection** - Automatic user data forwarding to downstream services
- **Proxy Support** - Dynamic URL parameter replacement and query forwarding
- **Functional Architecture** - Pure functions with immutable transformations

## Architecture

The gateway follows functional programming principles with clear separation of concerns:

- **Gateway Core** (`server/plugins/gateway.ts`) - Main initialization entry point
- **Route Config** (`routes.json`) - Declarative route definitions with auth and rate limit rules
- **Functional Utils** (`server/utils/`) - Domain-specific pure functions (auth, proxy, rate limiting, headers)
- **Type Definitions** (`server/types/gateway.ts`) - Centralized TypeScript interfaces

## Configuration

Routes are configured declaratively in `routes.json`:

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

### Runtime Configuration

- `NITRO_SECRET` - JWT signing/verification key (required)
- `NITRO_ROUTES_FILE` - Path to routes configuration file (defaults to `./routes.json`)

## Development

Look at the [Nitro quick start](https://nitro.build/guide#quick-start) to learn more about the framework.

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test:api` - Run integration tests
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome

### Testing

Integration tests verify:
- Basic proxy functionality
- JWT authentication flows
- Header forwarding from user payload
- Rate limiting with IP-based tracking
- Route parameter replacement

### Code Style

- All comments must be in English
- Functions should be small (<20 lines) and pure
- Use functional composition over inheritance
- Prefer immutable data transformations
