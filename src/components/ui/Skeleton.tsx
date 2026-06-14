import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Shimmer placeholder — prevents layout shift while data loads */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-surface-light bg-gradient-to-r from-surface-light via-surface-lighter to-surface-light bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[180px]">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[60vh] min-h-[420px] w-full">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>
  );
}

export function CarouselSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden px-4 md:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-[50vh] w-full rounded-none" />
      <div className="mx-auto max-w-7xl px-4 py-8 -mt-32 relative z-10 flex gap-8">
        <Skeleton className="hidden md:block w-64 aspect-[2/3] rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
