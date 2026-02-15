// Helper utilities
import { QualityType, QualityNumeric } from "../types";
import { QUALITY_MAPPING } from "./constants";

/**
 * Convert quality type string to numeric value
 */
export function getQualityNumeric(qualityType: QualityType): QualityNumeric {
  return QUALITY_MAPPING[qualityType];
}

/**
 * Transform SideIconName by removing "Side_"
 */
export function transformIconName(sideIconName: string): string {
  return sideIconName.replace("_Side_", "_");
}

/**
 * Check if cache entry is still valid
 */
export function isCacheValid(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
}

/**
 * Build asset URL
 */
export function buildAssetUrl(
  baseUrl: string,
  iconName: string,
  format: string = ".png",
): string {
  return `${baseUrl}/${iconName}${format}`;
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Generate cache key
 */
export function generateCacheKey(prefix: string, uid: string | number): string {
  return `${prefix}_${uid}`;
}
