/** Figma: 28px row, 70px label column, 16px gap. */
export function PropertyRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-7 items-center gap-4">
      <span className="text-muted-foreground w-[70px] shrink-0 py-1.5 text-sm font-medium">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
