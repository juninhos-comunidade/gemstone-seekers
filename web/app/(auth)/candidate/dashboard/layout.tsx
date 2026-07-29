import { SideMenu } from "@/components/SideMenu/SideMenu";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <SideMenu
          items={[
            {
              label: "Dashboard",
              href: "/candidate/dashboard",
              icon: "home",
            },
            {
              label: "Vagas",
              href: "/candidate/dashboard/jobs",
              icon: "briefcase",
            },
            {
              label: "Testes",
              href: "/candidate/dashboard/tests",
              icon: "code",
            },
          ]}
        />

        <section className="mt-16 ml-72 p-6">{children}</section>
      </div>
    </main>
  );
}
