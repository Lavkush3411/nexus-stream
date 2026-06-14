/**
 * Site monetization config — paste keys from Adsterra dashboard.
 * Set NEXT_PUBLIC_ADS_ENABLED=true once you have at least one key.
 */

export interface InvokeAdSlot {
  key: string;
  cdn: string;
}

export const adsConfig = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",

  /** Top banner 728×90 — atOptions + invoke.js (highperformanceformat.com) */
  bannerKey: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY ?? "",

  /** Legacy native key (atOptions format) — prefer nativeAd below */
  nativeKey: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY ?? "",

  /** Native banner — invoke.js + container-{key} */
  nativeAd: {
    key: process.env.NEXT_PUBLIC_NATIVE_AD_KEY ?? "",
    cdn: process.env.NEXT_PUBLIC_NATIVE_AD_CDN ?? "",
  } satisfies InvokeAdSlot,

  /** Mid-page banner (browse, movie detail, home) */
  midBanner: {
    key: process.env.NEXT_PUBLIC_MID_BANNER_KEY ?? "",
    cdn: process.env.NEXT_PUBLIC_MID_BANNER_CDN ?? "",
  } satisfies InvokeAdSlot,

  /** Footer banner on all pages */
  footerBanner: {
    key: process.env.NEXT_PUBLIC_FOOTER_BANNER_KEY ?? "",
    cdn: process.env.NEXT_PUBLIC_FOOTER_BANNER_CDN ?? "",
  } satisfies InvokeAdSlot,

  popunderKey: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY ?? "",
  moviePopunderScript: process.env.NEXT_PUBLIC_MOVIE_POPUNDER_SCRIPT ?? "",
};

export const ADSTERRA_CDN =
  process.env.NEXT_PUBLIC_ADSTERRA_CDN ??
  "https://www.highperformanceformat.com";

export function isInvokeAdActive(slot: InvokeAdSlot): boolean {
  return adsConfig.enabled && !!slot.key && !!slot.cdn;
}

export function isAdsActive(): boolean {
  return (
    adsConfig.enabled &&
    !!(
      adsConfig.bannerKey ||
      adsConfig.nativeKey ||
      isInvokeAdActive(adsConfig.nativeAd) ||
      isInvokeAdActive(adsConfig.midBanner) ||
      isInvokeAdActive(adsConfig.footerBanner) ||
      adsConfig.popunderKey ||
      adsConfig.moviePopunderScript
    )
  );
}

export function isBannerActive(): boolean {
  return adsConfig.enabled && !!adsConfig.bannerKey;
}

export function isNativeActive(): boolean {
  return (
    adsConfig.enabled &&
    (isInvokeAdActive(adsConfig.nativeAd) || !!adsConfig.nativeKey)
  );
}

export function isMidBannerActive(): boolean {
  return isInvokeAdActive(adsConfig.midBanner);
}

export function isFooterBannerActive(): boolean {
  return isInvokeAdActive(adsConfig.footerBanner);
}

export function isPopunderActive(): boolean {
  return adsConfig.enabled && !!adsConfig.popunderKey;
}
