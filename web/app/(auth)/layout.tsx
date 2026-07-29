import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <DashboardHeader role="candidate" />
      <div>{children}</div>
    </main>
  );
}
