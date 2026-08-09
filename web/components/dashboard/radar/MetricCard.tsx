type MetricCardProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
};

export function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <div className="bg-card rounded-2xl border p-4 shadow-sm sm:p-5">
      <div className="bg-primary/10 text-primary mb-3 flex h-9 w-9 items-center justify-center rounded-xl sm:mb-4 sm:h-10 sm:w-10">
        {icon}
      </div>
      <p className="text-foreground mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {value}
      </p>
      <p className="text-muted-foreground text-xs font-medium sm:text-sm">
        {label}
      </p>
    </div>
  );
}
