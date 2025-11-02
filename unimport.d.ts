export {}
declare global {
  const $fetch: typeof import('ofetch').$fetch
  const SignJWT: typeof import('jose').SignJWT
  const appendCorsHeaders: typeof import('h3').appendCorsHeaders
  const appendCorsPreflightHeaders: typeof import('h3').appendCorsPreflightHeaders
  const appendHeader: typeof import('h3').appendHeader
  const appendHeaders: typeof import('h3').appendHeaders
  const appendResponseHeader: typeof import('h3').appendResponseHeader
  const appendResponseHeaders: typeof import('h3').appendResponseHeaders
  const assertMethod: typeof import('h3').assertMethod
  const authorize: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').authorize
  const cachedEventHandler: typeof import('nitropack/runtime/internal/cache').cachedEventHandler
  const cachedFunction: typeof import('nitropack/runtime/internal/cache').cachedFunction
  const callNodeListener: typeof import('h3').callNodeListener
  const checkRateLimit: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/rateLimit').checkRateLimit
  const cleanupExpiredEntries: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/rateLimit').cleanupExpiredEntries
  const clearResponseHeaders: typeof import('h3').clearResponseHeaders
  const clearSession: typeof import('h3').clearSession
  const createApp: typeof import('h3').createApp
  const createAppEventHandler: typeof import('h3').createAppEventHandler
  const createAuthMiddleware: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').createAuthMiddleware
  const createError: typeof import('h3').createError
  const createEvent: typeof import('h3').createEvent
  const createEventStream: typeof import('h3').createEventStream
  const createHash: typeof import('crypto').createHash
  const createProxyHeaders: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').createProxyHeaders
  const createProxyMiddleware: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/proxy').createProxyMiddleware
  const createProxyOptions: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').createProxyOptions
  const createProxyOptionsFromPayload: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').createProxyOptionsFromPayload
  const createRouter: typeof import('h3').createRouter
  const defaultContentType: typeof import('h3').defaultContentType
  const defineCachedEventHandler: typeof import('nitropack/runtime/internal/cache').defineCachedEventHandler
  const defineCachedFunction: typeof import('nitropack/runtime/internal/cache').defineCachedFunction
  const defineEventHandler: typeof import('h3').defineEventHandler
  const defineLazyEventHandler: typeof import('h3').defineLazyEventHandler
  const defineNitroErrorHandler: typeof import('nitropack/runtime/internal/error/utils').defineNitroErrorHandler
  const defineNitroPlugin: typeof import('nitropack/runtime/internal/plugin').defineNitroPlugin
  const defineNodeListener: typeof import('h3').defineNodeListener
  const defineNodeMiddleware: typeof import('h3').defineNodeMiddleware
  const defineRenderHandler: typeof import('nitropack/runtime/internal/renderer').defineRenderHandler
  const defineRequestMiddleware: typeof import('h3').defineRequestMiddleware
  const defineResponseMiddleware: typeof import('h3').defineResponseMiddleware
  const defineRouteMeta: typeof import('nitropack/runtime/internal/meta').defineRouteMeta
  const defineTask: typeof import('nitropack/runtime/internal/task').defineTask
  const defineWebSocket: typeof import('h3').defineWebSocket
  const defineWebSocketHandler: typeof import('h3').defineWebSocketHandler
  const deleteCookie: typeof import('h3').deleteCookie
  const dynamicEventHandler: typeof import('h3').dynamicEventHandler
  const eventHandler: typeof import('h3').eventHandler
  const extractClientIP: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/proxy').extractClientIP
  const extractSetCookie: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/extractSetCookie').default
  const fetchWithEvent: typeof import('h3').fetchWithEvent
  const fromNodeMiddleware: typeof import('h3').fromNodeMiddleware
  const fromPlainHandler: typeof import('h3').fromPlainHandler
  const fromWebHandler: typeof import('h3').fromWebHandler
  const getCookie: typeof import('h3').getCookie
  const getHeader: typeof import('h3').getHeader
  const getHeaders: typeof import('h3').getHeaders
  const getHeadersInfo: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').getHeadersInfo
  const getMethod: typeof import('h3').getMethod
  const getProxyRequestHeaders: typeof import('h3').getProxyRequestHeaders
  const getQuery: typeof import('h3').getQuery
  const getRateLimitStats: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/rateLimit').getRateLimitStats
  const getRequestFingerprint: typeof import('h3').getRequestFingerprint
  const getRequestHeader: typeof import('h3').getRequestHeader
  const getRequestHeaders: typeof import('h3').getRequestHeaders
  const getRequestHost: typeof import('h3').getRequestHost
  const getRequestIP: typeof import('h3').getRequestIP
  const getRequestPath: typeof import('h3').getRequestPath
  const getRequestProtocol: typeof import('h3').getRequestProtocol
  const getRequestURL: typeof import('h3').getRequestURL
  const getRequestWebStream: typeof import('h3').getRequestWebStream
  const getResponseHeader: typeof import('h3').getResponseHeader
  const getResponseHeaders: typeof import('h3').getResponseHeaders
  const getResponseStatus: typeof import('h3').getResponseStatus
  const getResponseStatusText: typeof import('h3').getResponseStatusText
  const getRouteRules: typeof import('nitropack/runtime/internal/route-rules').getRouteRules
  const getRouterParam: typeof import('h3').getRouterParam
  const getRouterParams: typeof import('h3').getRouterParams
  const getSession: typeof import('h3').getSession
  const getUserId: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/getUserId').default
  const getValidatedQuery: typeof import('h3').getValidatedQuery
  const getValidatedRouterParams: typeof import('h3').getValidatedRouterParams
  const handleCacheHeaders: typeof import('h3').handleCacheHeaders
  const handleCors: typeof import('h3').handleCors
  const handleProxyRequest: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/proxy').handleProxyRequest
  const hasHeaders: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').hasHeaders
  const initializeGateway: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').initializeGateway
  const isAuthRequired: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').isAuthRequired
  const isCorsOriginAllowed: typeof import('h3').isCorsOriginAllowed
  const isError: typeof import('h3').isError
  const isEvent: typeof import('h3').isEvent
  const isEventHandler: typeof import('h3').isEventHandler
  const isMethod: typeof import('h3').isMethod
  const isPreflightRequest: typeof import('h3').isPreflightRequest
  const isStream: typeof import('h3').isStream
  const isValidProxyConfig: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/proxy').isValidProxyConfig
  const isWebResponse: typeof import('h3').isWebResponse
  const issueAccessToken: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/issueAccessToken').default
  const issueRefreshToken: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/issueRefreshToken').default
  const jwtVerify: typeof import('jose').jwtVerify
  const lazyEventHandler: typeof import('h3').lazyEventHandler
  const loadRoutesConfig: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').loadRoutesConfig
  const nitroPlugin: typeof import('nitropack/runtime/internal/plugin').nitroPlugin
  const parse: typeof import('set-cookie-parser').parse
  const parseCookies: typeof import('h3').parseCookies
  const passwordHash: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/passwordHash').default
  const prepareProxyTarget: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/proxy').prepareProxyTarget
  const promisifyNodeListener: typeof import('h3').promisifyNodeListener
  const proxyRequest: typeof import('h3').proxyRequest
  const readBody: typeof import('h3').readBody
  const readFileSync: typeof import('node:fs').readFileSync
  const readFormData: typeof import('h3').readFormData
  const readMultipartFormData: typeof import('h3').readMultipartFormData
  const readRawBody: typeof import('h3').readRawBody
  const readValidatedBody: typeof import('h3').readValidatedBody
  const registerRoutes: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/index').registerRoutes
  const removeResponseHeader: typeof import('h3').removeResponseHeader
  const runTask: typeof import('nitropack/runtime/internal/task').runTask
  const safeDestr: typeof import('destr').safeDestr
  const sanitizeStatusCode: typeof import('h3').sanitizeStatusCode
  const sanitizeStatusMessage: typeof import('h3').sanitizeStatusMessage
  const sealSession: typeof import('h3').sealSession
  const send: typeof import('h3').send
  const sendError: typeof import('h3').sendError
  const sendIterable: typeof import('h3').sendIterable
  const sendNoContent: typeof import('h3').sendNoContent
  const sendProxy: typeof import('h3').sendProxy
  const sendRedirect: typeof import('h3').sendRedirect
  const sendStream: typeof import('h3').sendStream
  const sendWebResponse: typeof import('h3').sendWebResponse
  const serveStatic: typeof import('h3').serveStatic
  const setCookie: typeof import('h3').setCookie
  const setHeader: typeof import('h3').setHeader
  const setHeaders: typeof import('h3').setHeaders
  const setResponseHeader: typeof import('h3').setResponseHeader
  const setResponseHeaders: typeof import('h3').setResponseHeaders
  const setResponseStatus: typeof import('h3').setResponseStatus
  const splitCookiesString: typeof import('h3').splitCookiesString
  const toEventHandler: typeof import('h3').toEventHandler
  const toNodeListener: typeof import('h3').toNodeListener
  const toPlainHandler: typeof import('h3').toPlainHandler
  const toWebHandler: typeof import('h3').toWebHandler
  const toWebRequest: typeof import('h3').toWebRequest
  const unsealSession: typeof import('h3').unsealSession
  const updateSession: typeof import('h3').updateSession
  const useAppConfig: typeof import('nitropack/runtime/internal/config').useAppConfig
  const useBase: typeof import('h3').useBase
  const useEvent: typeof import('nitropack/runtime/internal/context').useEvent
  const useNitroApp: typeof import('nitropack/runtime/internal/app').useNitroApp
  const useRuntimeConfig: typeof import('nitropack/runtime/internal/config').useRuntimeConfig
  const useSession: typeof import('h3').useSession
  const useStorage: typeof import('nitropack/runtime/internal/storage').useStorage
  const uuidv4: typeof import('uuid').v4
  const verifyAccessToken: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/verifyAccessToken').default
  const writeEarlyHints: typeof import('h3').writeEarlyHints
  const z: typeof import('zod').z
  const zodValidateBody: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/zodValidateBody').default
  const zodValidateData: typeof import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/zodValidateData').default
}
// for type re-export
declare global {
  // @ts-ignore
  export type { EventHandlerRequest, InferEventInput, ValidateFunction, RouterMethod, H3Event } from 'h3'
  import('h3')
  // @ts-ignore
  export type { StringValue } from 'ms'
  import('ms')
  // @ts-ignore
  export type { JWTPayload } from 'jose'
  import('jose')
  // @ts-ignore
  export type { Cookie } from 'set-cookie-parser'
  import('set-cookie-parser')
  // @ts-ignore
  export type { NitroRouteConfig } from 'nitropack'
  import('nitropack')
  // @ts-ignore
  export type { FetchResponse } from 'ofetch'
  import('ofetch')
  // @ts-ignore
  export type { AuthResult } from '/Users/gurieveugen/work/mediabazar-gateway/server/utils/auth'
  import('/Users/gurieveugen/work/mediabazar-gateway/server/utils/auth')
}