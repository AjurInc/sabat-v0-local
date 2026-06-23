export function CardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-foreground/10 bg-background/50 space-y-4">
      <div className="h-4 bg-foreground/5 rounded w-1/3 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-3 bg-foreground/5 rounded animate-pulse"></div>
        <div className="h-3 bg-foreground/5 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-foreground/10 bg-background/50">
      <div className="flex items-start justify-between mb-4">
        <div className="w-5 h-5 bg-foreground/10 rounded animate-pulse"></div>
        <div className="w-8 h-4 bg-foreground/5 rounded animate-pulse"></div>
      </div>
      <div className="h-3 bg-foreground/5 rounded w-1/2 mb-2 animate-pulse"></div>
      <div className="h-6 bg-foreground/10 rounded w-2/3 animate-pulse"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-foreground/5 rounded animate-pulse"></div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 bg-foreground/5 rounded-lg animate-pulse"></div>
      <div className="h-32 bg-foreground/5 rounded-lg animate-pulse"></div>
    </div>
  );
}
