import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col">
      <DashboardHeader role="recruiter" />
      <div className="flex-1">{children}</div>
    </main>
  );
}
