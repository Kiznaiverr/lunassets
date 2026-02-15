import {
  EnkaAssetConfig,
  ProcessedPlayerAssets,
  EnkaApiError,
  EnkaMappingError,
  AssetUrlOptions,
} from "./types";
import {
  EnkaApiClient,
  EnkaAssetMapper,
  EnkaCacheManager,
  EnkaUrlBuilder,
} from "./core";
import { DEFAULT_CONFIG } from "./utils";

/**
 * Main EnkaAssetWrapper class
 * Provides easy-to-use interface for Enka Network asset management
 */
export class EnkaAssetWrapper {
  private apiClient: EnkaApiClient;
  private cacheManager: EnkaCacheManager;
  private urlBuilder: EnkaUrlBuilder;
  private assetMapper: EnkaAssetMapper;

  constructor(config?: Partial<EnkaAssetConfig>) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // Initialize components
    this.apiClient = new EnkaApiClient(finalConfig);
    this.cacheManager = new EnkaCacheManager(finalConfig);
    this.urlBuilder = new EnkaUrlBuilder(finalConfig);
    this.assetMapper = new EnkaAssetMapper(this.urlBuilder);
  }

  /**
   * Get player assets with caching
   */
  async getPlayerAssets(uid: string | number): Promise<ProcessedPlayerAssets> {
    try {
      // Check cache first
      const cached =
        this.cacheManager.getCachedPlayerData<ProcessedPlayerAssets>(uid);
      if (cached) {
        return cached;
      }

      // Fetch from API
      const apiResponse = await this.apiClient.getPlayerData(uid);

      // Map to processed assets
      const processedAssets = await this.assetMapper.mapPlayerAssets(
        apiResponse,
        uid,
      );

      // Cache the result
      this.cacheManager.cachePlayerData(uid, processedAssets);

      return processedAssets;
    } catch (error) {
      if (error instanceof EnkaApiError || error instanceof EnkaMappingError) {
        throw error;
      }

      throw new Error(`Failed to get player assets: ${error}`);
    }
  }

  /**
   * Get player assets without caching (always fetch fresh)
   */
  async getPlayerAssetsUncached(
    uid: string | number,
  ): Promise<ProcessedPlayerAssets> {
    try {
      const apiResponse = await this.apiClient.getPlayerData(uid);
      return await this.assetMapper.mapPlayerAssets(apiResponse, uid);
    } catch (error) {
      if (error instanceof EnkaApiError || error instanceof EnkaMappingError) {
        throw error;
      }

      throw new Error(`Failed to get player assets: ${error}`);
    }
  }

  /**
   * Build asset URL directly
   */
  buildAssetUrl(iconName: string, options?: AssetUrlOptions): string {
    return this.urlBuilder.buildUrl(iconName, options);
  }

  /**
   * Check if player data is cached
   */
  isPlayerCached(uid: string | number): boolean {
    return this.cacheManager.hasValidPlayerCache(uid);
  }

  /**
   * Get cache info for player
   */
  getPlayerCacheInfo(uid: string | number) {
    const key = this.cacheManager.getPlayerCacheKey(uid);
    return this.cacheManager.getCacheInfo(key);
  }

  /**
   * Clear player cache
   */
  clearPlayerCache(uid: string | number): boolean {
    return this.cacheManager.invalidatePlayer(uid);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cacheManager.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheManager.getStats();
  }

  /**
   * Cleanup expired cache entries
   */
  cleanupCache(): number {
    return this.cacheManager.cleanup();
  }

  /**
   * Get data statistics
   */
  async getDataStats() {
    return await this.assetMapper.getDataStats();
  }

  /**
   * Check if character exists in data
   */
  async hasCharacter(avatarId: number): Promise<boolean> {
    return await this.assetMapper.hasCharacter(avatarId);
  }

  /**
   * Check if profile picture exists in data
   */
  async hasProfilePicture(pfpId: number): Promise<boolean> {
    return await this.assetMapper.hasProfilePicture(pfpId);
  }

  /**
   * Check if name card exists in data
   */
  async hasNameCard(nameCardId: number): Promise<boolean> {
    return await this.assetMapper.hasNameCard(nameCardId);
  }

  /**
   * Get current configuration
   */
  getConfig(): EnkaAssetConfig {
    return this.apiClient.getConfig();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<EnkaAssetConfig>): void {
    this.apiClient.updateConfig(newConfig);
    // Note: Cache dan URL builder perlu diupdate juga jika diperlukan
  }
}

// Export default instance for convenience
export default EnkaAssetWrapper;
