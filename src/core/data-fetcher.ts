import { CharacterData, PfpData, NameCardData, EnkaApiError } from "../types";

// Raw GitHub URLs untuk fetch data
const DATA_URLS = {
  CHARACTERS:
    "https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json",
  PFPS: "https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/gi/pfps.json",
  NAMECARDS:
    "https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/gi/namecards.json",
} as const;

// Cache duration for reference data (24 hours)
const REFERENCE_DATA_CACHE_DURATION = 24 * 60 * 60 * 1000;

export class EnkaDataFetcher {
  private charactersCache: { data: CharacterData | null; timestamp: number } = {
    data: null,
    timestamp: 0,
  };

  private pfpsCache: { data: PfpData | null; timestamp: number } = {
    data: null,
    timestamp: 0,
  };

  private namecardsCache: { data: NameCardData | null; timestamp: number } = {
    data: null,
    timestamp: 0,
  };

  /**
   * Check if cache is expired
   */
  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > REFERENCE_DATA_CACHE_DURATION;
  }

  /**
   * Fetch JSON data from URL
   */
  private async fetchJson<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "enka-asset-wrapper/1.0.0",
        },
      });

      if (!response.ok) {
        throw new EnkaApiError(
          `Failed to fetch reference data: ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof EnkaApiError) {
        throw error;
      }

      throw new EnkaApiError(
        `Network error while fetching reference data: ${error}`,
      );
    }
  }

  /**
   * Get characters data with caching
   */
  async getCharactersData(): Promise<CharacterData> {
    if (
      this.charactersCache.data &&
      !this.isCacheExpired(this.charactersCache.timestamp)
    ) {
      return this.charactersCache.data;
    }

    const data = await this.fetchJson<CharacterData>(DATA_URLS.CHARACTERS);
    this.charactersCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  }

  /**
   * Get profile pictures data with caching
   */
  async getPfpsData(): Promise<PfpData> {
    if (this.pfpsCache.data && !this.isCacheExpired(this.pfpsCache.timestamp)) {
      return this.pfpsCache.data;
    }

    const data = await this.fetchJson<PfpData>(DATA_URLS.PFPS);
    this.pfpsCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  }

  /**
   * Get namecards data with caching
   */
  async getNamecardsData(): Promise<NameCardData> {
    if (
      this.namecardsCache.data &&
      !this.isCacheExpired(this.namecardsCache.timestamp)
    ) {
      return this.namecardsCache.data;
    }

    const data = await this.fetchJson<NameCardData>(DATA_URLS.NAMECARDS);
    this.namecardsCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  }

  /**
   * Preload all reference data
   */
  async preloadAll(): Promise<{
    characters: CharacterData;
    pfps: PfpData;
    namecards: NameCardData;
  }> {
    const [characters, pfps, namecards] = await Promise.all([
      this.getCharactersData(),
      this.getPfpsData(),
      this.getNamecardsData(),
    ]);

    return { characters, pfps, namecards };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.charactersCache = { data: null, timestamp: 0 };
    this.pfpsCache = { data: null, timestamp: 0 };
    this.namecardsCache = { data: null, timestamp: 0 };
  }

  /**
   * Get cache info
   */
  getCacheInfo() {
    return {
      characters: {
        cached: !!this.charactersCache.data,
        age: this.charactersCache.timestamp
          ? Date.now() - this.charactersCache.timestamp
          : 0,
        expired: this.isCacheExpired(this.charactersCache.timestamp),
      },
      pfps: {
        cached: !!this.pfpsCache.data,
        age: this.pfpsCache.timestamp
          ? Date.now() - this.pfpsCache.timestamp
          : 0,
        expired: this.isCacheExpired(this.pfpsCache.timestamp),
      },
      namecards: {
        cached: !!this.namecardsCache.data,
        age: this.namecardsCache.timestamp
          ? Date.now() - this.namecardsCache.timestamp
          : 0,
        expired: this.isCacheExpired(this.namecardsCache.timestamp),
      },
    };
  }
}
