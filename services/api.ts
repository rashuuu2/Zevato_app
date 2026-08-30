export const mockApiDelay = (ms = 400): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const api = {
  get: async <T>(data: T, delayMs = 300): Promise<T> => {
    await mockApiDelay(delayMs);
    return data;
  },
  post: async <T>(data: T, delayMs = 400): Promise<T> => {
    await mockApiDelay(delayMs);
    return data;
  },
};

export default api;
