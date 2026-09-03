import * as SecureStore from 'expo-secure-store';
import type { TokenCache } from '@clerk/expo';

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      console.log(`>>> [TOKEN_CACHE] getToken("${key}") =>`, item ? `Present (length: ${item.length})` : 'null');
      return item;
    } catch (error) {
      console.error(`>>> [TOKEN_CACHE] getItemAsync error for "${key}":`, error);
      await SecureStore.deleteItemAsync(key).catch(() => null);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      console.log(`>>> [TOKEN_CACHE] saveToken("${key}", length: ${value.length})`);
      await SecureStore.setItemAsync(key, value);
      console.log(`>>> [TOKEN_CACHE] saveToken("${key}") SUCCESS`);
    } catch (err) {
      console.error(`>>> [TOKEN_CACHE] setItemAsync ERROR for "${key}":`, err);
    }
  },
  async clearToken(key: string) {
    try {
      console.log(`>>> [TOKEN_CACHE] clearToken("${key}")`);
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error(`>>> [TOKEN_CACHE] deleteItemAsync ERROR for "${key}":`, err);
    }
  },
};

export default tokenCache;
