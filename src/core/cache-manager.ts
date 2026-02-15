import { CacheEntry, EnkaCacheError, EnkaAssetConfig } from "../types";
import {
  isCacheValid,
  generateCacheKey,
  safeJsonParse,
  DEFAULT_CONFIG,
} from "../utils";

export class EnkaCacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: EnkaAssetConfig;

  constructor(config?: Partial<EnkaAssetConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Get data from cache if valid
   */
  get<T>(key: string): T | null {
    if (!this.config.enableCache) {
      return null;
    }

    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if cache is still valid
    if (isCacheValid(entry.timestamp, entry.ttl)) {
      return entry.data as T;
    }

    // Cache expired, remove it
    this.cache.delete(key);
    return null;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.enableCache) {
      return;
    }

    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.cacheDuration,
    };

    this.cache.set(key, cacheEntry);
  }

  /**
   * Get player data cache key
   */
  getPlayerCacheKey(uid: string | number): string {
    return generateCacheKey("player", uid);
  }

  /**
   * Check if player data is cached and valid
   */
  hasValidPlayerCache(uid: string | number): boolean {
    const key = this.getPlayerCacheKey(uid);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    return isCacheValid(entry.timestamp, entry.ttl);
  }

  /**
   * Get cached player data
   */
  getCachedPlayerData<T>(uid: string | number): T | null {
    const key = this.getPlayerCacheKey(uid);
    return this.get<T>(key);
  }

  /**
   * Cache player data
   */
  cachePlayerData<T>(uid: string | number, data: T): void {
    const key = this.getPlayerCacheKey(uid);
    this.set(key, data);
  }

  /**
   * Clear specific cache entry
   */
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear player cache
   */
  invalidatePlayer(uid: string | number): boolean {
    const key = this.getPlayerCacheKey(uid);
    return this.invalidate(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const validEntries = entries.filter((entry) =>
      isCacheValid(entry.timestamp, entry.ttl),
    );

    return {
      total: this.cache.size,
      valid: validEntries.length,
      expired: this.cache.size - validEntries.length,
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (!isCacheValid(entry.timestamp, entry.ttl)) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get cache entry info
   */
  getCacheInfo(key: string): {
    exists: boolean;
    valid?: boolean;
    age?: number;
    ttl?: number;
  } {
    const entry = this.cache.get(key);

    if (!entry) {
      return { exists: false };
    }

    const age = Date.now() - entry.timestamp;
    const valid = isCacheValid(entry.timestamp, entry.ttl);

    return {
      exists: true,
      valid,
      age,
      ttl: entry.ttl,
    };
  }
}
