import {
  mapHttpAuthResponseError,
  mapHttpAuthTransportError,
} from "@core/auth/adapters/http/http-auth-error-mapper";
import {
  decodeHttpAuthContext,
  decodeHttpVoid,
} from "@core/auth/adapters/http/http-auth-response";
import { AuthGateway } from "@core/auth/gateways/auth-gateway";

import type { HttpAuthOperation } from "@core/auth/adapters/http/http-auth-error-mapper";
import type {
  AuthContext,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
} from "@core/auth/apis/types";
import type { AuthResult } from "@core/auth/domain/auth-result";
import type { AuthSessionProvider } from "@core/auth/gateways/auth-session-provider";

const DEFAULT_REQUEST_TIMEOUT_MILLISECONDS = 15_000;

/** Minimal fetch boundary injected into the HTTP auth adapter. */
export type HttpAuthFetch = (
  input: string,
  init: RequestInit,
) => Promise<Response>;

/** Runtime dependencies and configuration for the HTTP auth adapter. */
export interface HttpAuthGatewayOptions {
  /** Backend origin implementing the documented Starter auth contract. */
  baseUrl: string;
  /** Reads the latest Redux-owned session for protected requests. */
  sessionProvider: AuthSessionProvider;
  /** Optional transport implementation used by behavior specs. */
  fetcher?: HttpAuthFetch;
  /** Optional request timeout override. */
  requestTimeoutMilliseconds?: number;
}

/** Successful response decoder for one HTTP auth operation. */
type HttpAuthResponseDecoder<Value> = (value: unknown) => AuthResult<Value>;

/** Request options independent from the selected authentication operation. */
interface HttpAuthRequestOptions {
  /** Whether the request requires the current bearer token. */
  authenticated?: boolean;
  /** Optional JSON request payload. */
  body?: unknown;
  /** HTTP method used by the remote contract. */
  method: "DELETE" | "GET" | "PATCH" | "POST";
}

/** REST implementation of the authentication gateway with typed error mapping. */
export class HttpAuthGateway extends AuthGateway {
  private readonly baseUrl: string;

  private readonly fetcher: HttpAuthFetch;

  private readonly requestTimeoutMilliseconds: number;

  /** Binds the remote origin, runtime session provider, and transport. */
  constructor(private readonly options: HttpAuthGatewayOptions) {
    super();
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.fetcher = options.fetcher ?? fetch;
    this.requestTimeoutMilliseconds =
      options.requestTimeoutMilliseconds ??
      DEFAULT_REQUEST_TIMEOUT_MILLISECONDS;
  }

  /** Creates an account and session through the public HTTP endpoint. */
  register(payload: RegisterPayload): Promise<AuthResult<AuthContext>> {
    return this.request(
      "register",
      "/auth/register",
      { body: payload, method: "POST" },
      decodeHttpAuthContext,
    );
  }

  /** Authenticates email credentials through the public HTTP endpoint. */
  login(payload: LoginPayload): Promise<AuthResult<AuthContext>> {
    return this.request(
      "login",
      "/auth/login",
      { body: payload, method: "POST" },
      decodeHttpAuthContext,
    );
  }

  /** Starts Google authentication through the public HTTP endpoint. */
  loginWithGoogle(): Promise<AuthResult<AuthContext>> {
    return this.request(
      "login-with-google",
      "/auth/login/google",
      { method: "POST" },
      decodeHttpAuthContext,
    );
  }

  /** Starts Apple authentication through the public HTTP endpoint. */
  loginWithApple(): Promise<AuthResult<AuthContext>> {
    return this.request(
      "login-with-apple",
      "/auth/login/apple",
      { method: "POST" },
      decodeHttpAuthContext,
    );
  }

  /** Requests a password-reset challenge through the public HTTP endpoint. */
  requestPasswordReset(
    payload: RequestPasswordResetPayload,
  ): Promise<AuthResult<void>> {
    return this.request(
      "request-password-reset",
      "/auth/password/request-reset",
      { body: payload, method: "POST" },
      decodeHttpVoid,
    );
  }

  /** Completes a password reset through the public HTTP endpoint. */
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult<void>> {
    return this.request(
      "reset-password",
      "/auth/password/reset",
      { body: payload, method: "POST" },
      decodeHttpVoid,
    );
  }

  /** Ends the bearer session through the protected HTTP endpoint. */
  logout(): Promise<AuthResult<void>> {
    return this.request(
      "logout",
      "/auth/logout",
      { authenticated: true, method: "POST" },
      decodeHttpVoid,
    );
  }

  /** Permanently deletes the current account through the protected endpoint. */
  deleteAccount(): Promise<AuthResult<void>> {
    return this.request(
      "delete-account",
      "/auth/account",
      { authenticated: true, method: "DELETE" },
      decodeHttpVoid,
    );
  }

  /** Executes one request and converts every failure before the gateway boundary. */
  private async request<Value>(
    operation: HttpAuthOperation,
    path: string,
    requestOptions: HttpAuthRequestOptions,
    decodeResponse: HttpAuthResponseDecoder<Value>,
  ): Promise<AuthResult<Value>> {
    if (!this.baseUrl) {
      return {
        ok: false,
        error: { kind: "unavailable", retryable: false },
      };
    }

    const headersResult = this.createHeaders(requestOptions.authenticated);
    if (!headersResult.ok) return headersResult;

    const abortController = new AbortController();
    const timeout = setTimeout(
      () => abortController.abort(),
      this.requestTimeoutMilliseconds,
    );

    try {
      const response = await this.fetcher(`${this.baseUrl}${path}`, {
        method: requestOptions.method,
        headers: headersResult.value,
        signal: abortController.signal,
        ...(requestOptions.body !== undefined
          ? { body: JSON.stringify(requestOptions.body) }
          : {}),
      });
      const responseBody = await readHttpResponseBody(response);

      if (!response.ok) {
        return {
          ok: false,
          error: mapHttpAuthResponseError(
            operation,
            response.status,
            responseBody,
          ),
        };
      }

      return decodeResponse(responseBody);
    } catch (error) {
      return { ok: false, error: mapHttpAuthTransportError(error) };
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Builds per-request headers from the current Redux-owned session. */
  private createHeaders(
    authenticated = false,
  ): AuthResult<Record<string, string>> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (!authenticated) return { ok: true, value: headers };

    const session = this.options.sessionProvider.getSession();
    if (!session) {
      return {
        ok: false,
        error: { kind: "unauthenticated", retryable: false },
      };
    }

    return {
      ok: true,
      value: {
        ...headers,
        Authorization: `Bearer ${session.accessToken}`,
      },
    };
  }
}

/** Reads JSON when present while keeping malformed bodies inside the adapter. */
async function readHttpResponseBody(response: Response): Promise<unknown> {
  const responseText = await response.text();
  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return null;
  }
}
