import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shortPrincipal, useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, User } from "lucide-react";

/** Signed-in profile menu, or a sign-in button when unauthenticated. */
export function UserMenu() {
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    principal,
    login,
    logout,
  } = useAuth();

  if (isInitializing) {
    return (
      <div
        className="size-9 animate-pulse-soft rounded-full bg-muted"
        aria-hidden="true"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        type="button"
        size="sm"
        onClick={login}
        disabled={isLoggingIn}
        data-ocid="auth.login_button"
        className="rounded-full"
      >
        <LogIn className="size-4" aria-hidden="true" />
        {isLoggingIn ? "Signing in…" : "Sign in"}
      </Button>
    );
  }

  const label = principal ? shortPrincipal(principal) : "Account";
  const initials = principal ? principal.slice(0, 2).toUpperCase() : "EM";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open account menu"
          data-ocid="user.menu_button"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 font-display text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <User className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            {label}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={logout}
          data-ocid="auth.logout_button"
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
