import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";
import { SideMenu } from "@/components/SideMenu/SideMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader role="recruiter" />

      <SideMenu
        items={[
          { label: "Dashboard", href: "/recruiter/dashboard", icon: "home" },
          { label: "Vagas", href: "/recruiter/jobs", icon: "briefcase" },
          {
            label: "Candidatos",
            href: "/recruiter/candidates",
            icon: "users",
          },
        ]}
      />

      <div className="ml-72 pt-16">
        <div className="p-6">{children}</div>
      </div>
    </main>
  );
}
