import { SideMenu } from "@/components/SideMenu/SideMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    {
      label: "Dashboard",
      href: "/recruiter/dashboard",
      icon: "home" as const,
    },
    {
      label: "Vagas",
      href: "/recruiter/dashboard/jobs",
      icon: "briefcase" as const,
    },
  ];

  return (
    <main className="bg-background min-h-screen">
      <SideMenu items={menuItems} />

      <div className="pt-16 md:ml-72">
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</div>
      </div>
    </main>
  );
}
