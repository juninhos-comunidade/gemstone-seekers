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
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <SideMenu items={menuItems} />
        <section className="mt-16 w-full md:ml-72">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
