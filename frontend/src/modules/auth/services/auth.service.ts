import { api, withSkipErrorToast } from "@/modules/shared";
import type {
  LoginCredentials,
  RegisterData,
  BuyerRegisterData,
  AuthResponse,
  User,
  ApiResponse,
} from "@/modules/shared";

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/login",
      credentials,
    );
    return data.data;
  },

  /**
   * Login buyer
   */
  async loginBuyer(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/buyer/login",
      credentials,
    );
    return data.data;
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/register",
      userData,
    );
    return data.data;
  },

  /**
   * Register new buyer
   */
  async registerBuyer(userData: BuyerRegisterData): Promise<AuthResponse> {
    const payload = {
      ...userData,
      account_type: "buyer",
    };
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/buyer/register",
      payload,
    );
    return data.data;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await api.post("/logout");
  },

  /**
   * Get current authenticated user
   */
  async getUser(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(
      "/user",
      withSkipErrorToast(),
    );
    return data.data;
  },
};
