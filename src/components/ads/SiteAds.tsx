"use client";

import { AdsterraUnit } from "./AdsterraUnit";
import { InvokeContainerAd } from "./InvokeContainerAd";
import { PopunderAd } from "./PopunderAd";
import { adsConfig, isNativeActive, isPopunderActive } from "@/lib/ads-config";
import {
  type BannerSlotId,
  getBannerSlotUnit,
  isBannerSlotActive,
} from "@/lib/banner-slots";
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

interface SiteBannerSlotProps {
  slotId: BannerSlotId;
  className?: string;
}

/** Render a registered banner slot by id */
export function SiteBannerSlot({ slotId, className }: SiteBannerSlotProps) {
  if (!isBannerSlotActive(slotId)) return null;

  const unit = getBannerSlotUnit(slotId);
  if (!unit) return null;

  return (
    <AdSlotShell
      className={cn(
        slotId === "global-top" && "border-b border-white/5 bg-surface/40 border-t-0",
        className
      )}
    >
      <AdsterraUnit
        adKey={unit.key}
        width={unit.width}
        height={unit.height}
        cdn={unit.cdn}
        className="max-w-full [&_iframe]:max-w-full"
      />
    </AdSlotShell>
  );
}

export function SiteBannerAd() {
  return <SiteBannerSlot slotId="global-top" />;
}

export function SiteFooterBannerAd() {
  return <SiteBannerSlot slotId="global-footer" />;
}

export function SiteMidBannerAd({ className }: { className?: string }) {
  return <SiteBannerSlot slotId="home-after-top-rated" className={className} />;
}

/** Native unit — invoke.js + container div (not counted as banner) */
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

/** Optional global Adsterra popunder (NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY) */
export function SiteAdsProvider() {
  if (!isPopunderActive()) return null;
  return <PopunderAd />;
}
