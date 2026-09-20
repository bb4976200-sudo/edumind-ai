import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  loginError?: Error;
  principal: string | null;
  login: () => void;
  logout: () => void;
}

/** Shorten a principal for display in the user menu. */
export function shortPrincipal(principal: string): string {
  if (principal.length <= 14) return principal;
  return `${principal.slice(0, 6)}…${principal.slice(-4)}`;
}

/** Auth/session state around Internet Identity. */
export function useAuth(): AuthState {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginError,
  } = useInternetIdentity();

  const handleLogin = useCallback(() => {
    login();
  }, [login]);

  const handleLogout = useCallback(() => {
    clear();
  }, [clear]);

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginError,
    principal: identity ? identity.getPrincipal().toText() : null,
    login: handleLogin,
    logout: handleLogout,
  };
}

/**
 * Route guard for protected pages. Redirects unauthenticated visitors to the
 * landing page once the identity provider has finished initializing.
 * Returns `true` while the page should render its content.
 */
export function useRequireAuth(): boolean {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      void navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  return isAuthenticated;
}
