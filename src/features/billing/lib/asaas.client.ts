import "server-only";

export class AsaasClient {
  private static getApiKey(): string {
    const apiKey = process.env.ASAAS_API_KEY;
    if (!apiKey) {
      throw new Error("ASAAS_API_KEY environment variable is not configured.");
    }
    return apiKey.trim();
  }

  private static getBaseUrl(): string {
    const baseUrl = process.env.ASAAS_BASE_URL;
    if (!baseUrl) {
      // Default to sandbox environment if not specified
      return "https://api-sandbox.asaas.com/v3";
    }
    return baseUrl.trim().replace(/\/+$/, "");
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const isFormDataBody =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      headers: {
        access_token: apiKey,
        ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[Asaas API Error] Endpoint: ${endpoint}, Status: ${response.status}, Response: ${errorBody}`,
      );
      throw new Error(`Asaas API Error [${response.status}]: ${errorBody}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  static async get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static async post<T>(endpoint: string, body: unknown, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  static async put<T>(endpoint: string, body: unknown, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  static async delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
