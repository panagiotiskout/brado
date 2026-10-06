import { cn } from "@/lib/utils";

export function BradoLogo({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "poster inline-block skew-x-[-12deg] bg-brand px-2.5 py-1 text-white",
          compact ? "text-xl" : "text-2xl sm:text-[1.7rem]",
        )}
      >
        BRADO
      </span>
      {!compact && (
        <span className="micro micro-sm mt-1.5">Training Center</span>
      )}
    </div>
  );
}
