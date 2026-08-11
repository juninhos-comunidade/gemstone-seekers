import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";
import { SideMenu } from "@/components/SideMenu/SideMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    {
      label: "Dashboard",
      href: "/candidate/dashboard",
      icon: "home" as const,
    },
    {
      label: "Vagas",
      href: "/candidate/dashboard/jobs",
      icon: "briefcase" as const,
    },
    {
      label: "Testes",
      href: "/candidate/dashboard/tests",
      icon: "code" as const,
    },
    {
      label: "Radar",
      href: "/candidate/dashboard/radar",
      icon: "LuRadar" as const,
    },
    {
      label: "Badges",
      href: "/candidate/dashboard/badges",
      icon: "award" as const,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <DashboardHeader role="candidate" menuItems={menuItems} />
      <div className="flex flex-1">
        <SideMenu items={menuItems} />

        <section className="mt-16 w-full p-4 md:ml-72 md:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
