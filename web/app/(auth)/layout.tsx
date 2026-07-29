import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <DashboardHeader role="candidate" />
      <div className="flex flex-1">{children}</div>
    </main>
  );
}
