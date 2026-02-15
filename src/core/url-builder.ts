import { AssetUrlOptions, EnkaAssetConfig } from "../types";
import {
  ASSET_FORMATS,
  ASSET_SIZES,
  DEFAULT_CONFIG,
  buildAssetUrl,
} from "../utils";

export class EnkaUrlBuilder {
  private config: EnkaAssetConfig;

  constructor(config?: Partial<EnkaAssetConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Build asset URL with options
   */
  buildUrl(iconName: string, options?: AssetUrlOptions): string {
    const format =
      options?.format === "webp" ? ASSET_FORMATS.WEBP : ASSET_FORMATS.PNG;
    const size = options?.size
      ? ASSET_SIZES[options.size.toUpperCase() as keyof typeof ASSET_SIZES]
      : ASSET_SIZES.ORIGINAL;

    // Add size suffix to icon name if needed
    const fullIconName = size ? `${iconName}${size}` : iconName;

    return buildAssetUrl(this.config.baseUrl, fullIconName, format);
  }

  /**
   * Build character avatar icon URL
   */
  buildCharacterIconUrl(iconName: string, options?: AssetUrlOptions): string {
    return this.buildUrl(iconName, options);
  }

  /**
   * Build profile picture URL
   */
  buildProfilePictureUrl(iconPath: string, options?: AssetUrlOptions): string {
    return this.buildUrl(iconPath, options);
  }

  /**
   * Build name card URL
   */
  buildNameCardUrl(iconName: string, options?: AssetUrlOptions): string {
    return this.buildUrl(iconName, options);
  }

  /**
   * Build multiple URLs at once
   */
  buildMultipleUrls(iconNames: string[], options?: AssetUrlOptions): string[] {
    return iconNames.map((iconName) => this.buildUrl(iconName, options));
  }

  /**
   * Validate icon name format
   */
  isValidIconName(iconName: string): boolean {
    // Basic validation - icon names should start with UI_
    return iconName.startsWith("UI_");
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Update base URL
   */
  updateBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl;
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): string[] {
    return Object.values(ASSET_FORMATS);
  }

  /**
   * Get supported sizes
   */
  getSupportedSizes(): string[] {
    return Object.keys(ASSET_SIZES).map((size) => size.toLowerCase());
  }
}
