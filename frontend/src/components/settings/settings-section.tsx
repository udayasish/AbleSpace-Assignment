/** Figma: 640px card, rounded-lg, 1px border; rows are min 60px with px-6. */
export function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      {title && <h2 className="text-base leading-none font-medium">{title}</h2>}
      <div className="divide-y rounded-lg border">{children}</div>
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[60px] flex-wrap items-center justify-between gap-3 px-6 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-muted-foreground text-xs">{description}</span>
        )}
      </div>
      {children}
    </div>
  );
}
