/**
 * Preset Adsterra atOptions ad units (highperformanceformat.com).
 * Override any unit via NEXT_PUBLIC_AD_UNIT_{NAME}_KEY in .env.local
 */

import { ADSTERRA_CDN, adsConfig } from "./ads-config";

export interface AtOptionsUnit {
  key: string;
  width: number;
  height: number;
  cdn: string;
}

function unit(
  envName: string,
  fallbackKey: string,
  width: number,
  height: number
): AtOptionsUnit | null {
  if (!adsConfig.enabled) return null;
  const key = process.env[`NEXT_PUBLIC_AD_UNIT_${envName}_KEY`] ?? fallbackKey;
  if (!key) return null;
  return { key, width, height, cdn: ADSTERRA_CDN };
}

/** All configured display units */
export const AD_UNITS = {
  banner728: () =>
    unit("BANNER_728", adsConfig.bannerKey || "466eed79a6134d90b04cf99cd446bdef", 728, 90),
  banner320x50: () =>
    unit("BANNER_320x50", "702a44e3bfc26e05cdea417d575c6de0", 320, 50),
  banner468x60: () =>
    unit("BANNER_468x60", "d9b246a1c3960de2d84883af6eb2bfe7", 468, 60),
  rect300x250: () =>
    unit("RECT_300x250", "855dd3734c5af0d5ff37f4c049f6a207", 300, 250),
  sky160x300: () =>
    unit("SKY_160x300", "8ba53ab1a2bfc35e89ab27ecfaf4e666", 160, 300),
  sky160x600: () =>
    unit("SKY_160x600", "15ba75b8c1c6b7eccecdae2b3fb7fd0b", 160, 600),
} as const;

export type AdUnitName = keyof typeof AD_UNITS;
