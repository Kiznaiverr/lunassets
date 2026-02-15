// Configuration and utility types
export interface EnkaAssetConfig {
  baseUrl: string;
  apiUrl: string;
  cacheDuration: number; // in milliseconds
  enableCache: boolean;
  userAgent?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface AssetUrlOptions {
  format?: "png" | "webp";
  size?: "original" | "small" | "medium";
}

// Error types
export class EnkaAssetError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "EnkaAssetError";
  }
}

export class EnkaApiError extends EnkaAssetError {
  constructor(message: string, statusCode?: number) {
    super(message, "API_ERROR", statusCode);
  }
}

export class EnkaCacheError extends EnkaAssetError {
  constructor(message: string) {
    super(message, "CACHE_ERROR");
  }
}

export class EnkaMappingError extends EnkaAssetError {
  constructor(
    message: string,
    public missingId?: string | number,
  ) {
    super(message, "MAPPING_ERROR");
  }
}
