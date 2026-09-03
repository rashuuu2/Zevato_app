import { Platform } from 'react-native';
import Constants from 'expo-constants';

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
  }

  // Auto-detect host IP when running in Expo Go or dev client on device/emulator
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5001/api`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.1.2.116:5001/api';
  }

  return 'http://localhost:5001/api';
}

export const API_BASE_URL = getApiBaseUrl();

let authTokenGetter: (() => Promise<string | null>) | null = null;
let activeUserMetadata: { name?: string; email?: string; phone?: string } | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  authTokenGetter = getter;
};

export const setUserMetadataHeader = (meta: { name?: string; email?: string; phone?: string }) => {
  activeUserMetadata = meta;
};

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  let token: string | null = null;
  if (authTokenGetter) {
    try {
      token = await authTokenGetter();
    } catch (e) {
      console.warn('Failed to resolve auth token:', e);
    }
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (activeUserMetadata) {
    if (activeUserMetadata.name) reqHeaders['x-user-name'] = activeUserMetadata.name;
    if (activeUserMetadata.email) reqHeaders['x-user-email'] = activeUserMetadata.email;
    if (activeUserMetadata.phone) reqHeaders['x-user-phone'] = activeUserMetadata.phone;
  }

  const currentBase = getApiBaseUrl();
  const cleanBase = currentBase.endsWith('/') ? currentBase.slice(0, -1) : currentBase;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.warn(`API Error [${method} ${endpoint}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    console.warn(`API Network/Server Failure [${method} ${endpoint}]: ${error.message} (Target: ${url})`);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'GET', headers }),
  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'POST', body, headers }),
  patch: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body, headers }),
  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};

export default api;
