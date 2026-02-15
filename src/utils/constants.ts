// Constants untuk library
export const DEFAULT_CONFIG = {
  baseUrl: "https://enka.network/ui",
  apiUrl: "https://enka.network/api",
  cacheDuration: 60 * 60 * 1000, // 1 hour
  enableCache: true,
  userAgent: "enka-asset-wrapper/1.0.0",
} as const;

// Quality mapping constants
export const QUALITY_MAPPING = {
  QUALITY_ORANGE: 5,
  QUALITY_PURPLE: 4,
} as const;

// Asset file extensions
export const ASSET_FORMATS = {
  PNG: ".png",
  WEBP: ".webp",
} as const;

// Asset size mappings 
export const ASSET_SIZES = {
  ORIGINAL: "",
  SMALL: "_small",
  MEDIUM: "_medium",
} as const;

// Cache keys
export const CACHE_KEYS = {
  PLAYER_DATA: "player_data",
  CHARACTERS: "characters",
  PFPS: "pfps",
  NAMECARDS: "namecards",
} as const;
