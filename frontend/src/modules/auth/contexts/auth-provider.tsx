import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import { authService } from "@/modules/auth/services/auth.service";
import { authEvents, authStorage } from "@/modules/shared";
import type { User } from "@/modules/shared";

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    authStorage.getToken(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const initAuth = async () => {
      setIsLoading(true);

      if (!token || authStorage.isExpired()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getUser();
        if (!ignore) setUser(userData);
      } catch {
        if (!ignore) {
          authStorage.clearToken();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      ignore = true;
    };
  }, [token]);

  useEffect(() => {
    const unsubscribe = authEvents.onUnauthorized(() => {
      authStorage.clearToken();
      setToken(null);
      setUser(null);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    authStorage.setToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const loginBuyer = useCallback(async (email: string, password: string) => {
    const response = await authService.loginBuyer({ email, password });
    authStorage.setToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
    ) => {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation,
      });
      if (response.token) {
        authStorage.setToken(response.token);
        setToken(response.token);
      }
      setUser(response.user);
    },
    [],
  );

  const registerBuyer = useCallback(
    async (
      name: string,
      email: string,
      company_name: string,
      country: string,
      phone: string | null,
      password: string,
      password_confirmation: string,
    ) => {
      const response = await authService.registerBuyer({
        name,
        email,
        company_name,
        country,
        phone,
        password,
        password_confirmation,
      });
      if (response.token) {
        authStorage.setToken(response.token);
        setToken(response.token);
      }
      setUser(response.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      authStorage.clearToken();
      setToken(null);
      setUser(null);
    }
  }, []);

  // Memoize context value to avoid unnecessary rerenders
  const value = useMemo(
    () => ({
      user,
      token,
      login,
      loginBuyer,
      register,
      registerBuyer,
      logout,
      isLoading,
    }),
    [user, token, login, loginBuyer, register, registerBuyer, logout, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
