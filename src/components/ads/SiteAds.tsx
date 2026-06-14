"use client";

import { AdsterraUnit } from "./AdsterraUnit";
import { InvokeContainerAd } from "./InvokeContainerAd";
import { PopunderAd } from "./PopunderAd";
import {
  adsConfig,
  isBannerActive,
  isFooterBannerActive,
  isMidBannerActive,
  isNativeActive,
  isPopunderActive,
} from "@/lib/ads-config";
import { cn } from "@/lib/utils";

function AdSlotShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-y border-white/5 bg-surface/30", className)}>
      <div className="mx-auto max-w-7xl px-4 py-3 flex justify-center">
        {children}
      </div>
    </div>
  );
}

/** Leaderboard below the navbar — visible on all pages */
export function SiteBannerAd() {
  if (!isBannerActive()) return null;

  return (
    <AdSlotShell className="border-b border-white/5 bg-surface/40 border-t-0">
      <AdsterraUnit
        adKey={adsConfig.bannerKey}
        height={90}
        width={728}
        className="max-w-full [&_iframe]:max-w-full"
      />
    </AdSlotShell>
  );
}

/** Native unit — invoke.js + container div */
export function SiteNativeAd({ className }: { className?: string }) {
  if (!isNativeActive()) return null;

  const { nativeAd, nativeKey } = adsConfig;

  return (
    <div className={cn("mx-auto max-w-7xl px-4 md:px-8 py-4", className)}>
      {nativeAd.key && nativeAd.cdn ? (
        <InvokeContainerAd
          adKey={nativeAd.key}
          cdn={nativeAd.cdn}
          minHeight={250}
          className="mx-auto max-w-full"
        />
      ) : nativeKey ? (
        <AdsterraUnit
          adKey={nativeKey}
          height={250}
          width={300}
          className="mx-auto"
        />
      ) : null}
    </div>
  );
}

/** Mid-page banner — browse, detail pages, home */
export function SiteMidBannerAd({ className }: { className?: string }) {
  if (!isMidBannerActive()) return null;

  const { midBanner } = adsConfig;

  return (
    <AdSlotShell className={className}>
      <InvokeContainerAd
        adKey={midBanner.key}
        cdn={midBanner.cdn}
        minHeight={90}
        className="max-w-full [&_iframe]:max-w-full"
      />
    </AdSlotShell>
  );
}

/** Footer banner — all pages */
export function SiteFooterBannerAd() {
  if (!isFooterBannerActive()) return null;

  const { footerBanner } = adsConfig;

  return (
    <AdSlotShell>
      <InvokeContainerAd
        adKey={footerBanner.key}
        cdn={footerBanner.cdn}
        minHeight={90}
        className="max-w-full [&_iframe]:max-w-full"
      />
    </AdSlotShell>
  );
}

/** Mount once in root layout — optional Adsterra popunder invoke.js */
export function SiteAdsProvider() {
  if (!isPopunderActive()) return null;
  return <PopunderAd />;
}
