import {
  EnkaApiResponse,
  FetchPlayerParams,
  EnkaApiError,
  EnkaAssetConfig,
} from "../types";
import { DEFAULT_CONFIG } from "../utils";

export class EnkaApiClient {
  private config: EnkaAssetConfig;

  constructor(config?: Partial<EnkaAssetConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  /**
   * Fetch player data from Enka Network API
   */
  async fetchPlayerData(params: FetchPlayerParams): Promise<EnkaApiResponse> {
    const { uid, info = true } = params;

    // Build URL
    const url = `${this.config.apiUrl}/uid/${uid}${info ? "?info" : ""}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.config.userAgent || DEFAULT_CONFIG.userAgent,
        },
        // Note: timeout handling can be done with AbortController if needed
      });

      if (!response.ok) {
        throw new EnkaApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      const data = (await response.json()) as EnkaApiResponse;

      // Validate response structure
      if (!data.playerInfo) {
        throw new EnkaApiError("Invalid API response: missing playerInfo");
      }

      return data;
    } catch (error) {
      if (error instanceof EnkaApiError) {
        throw error;
      }

      // Network atau parsing errors
      if (error instanceof Error) {
        throw new EnkaApiError(`Network error: ${error.message}`);
      }

      throw new EnkaApiError("Unknown API error");
    }
  }

  /**
   * Get player data with rate limiting awareness
   */
  async getPlayerData(uid: string | number): Promise<EnkaApiResponse> {
    try {
      return await this.fetchPlayerData({ uid, info: true });
    } catch (error) {
      if (error instanceof EnkaApiError && error.statusCode === 429) {
        // Rate limited, bisa implement retry atau throw dengan pesan yang lebih friendly
        throw new EnkaApiError(
          "Rate limited by Enka API. Please try again later.",
          429,
        );
      }
      throw error;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<EnkaAssetConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): EnkaAssetConfig {
    return { ...this.config };
  }
}
