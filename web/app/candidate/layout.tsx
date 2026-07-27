import SideMenu from "@/components/SideMenu/SideMenu";
import DashboardHeader from "@/components/DashboardHeader/DashboardHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col">
      <DashboardHeader role="candidate" />
      <div className="flex flex-1">
        <SideMenu
          items={[
            {
              label: "Dashboard",
              href: "/candidate/dashboard",
              icon: "home",
            },
            { label: "Vagas", href: "/candidate/jobs", icon: "briefcase" },
            {
              label: "Testes",
              href: "/candidate/tests",
              icon: "code",
            },
          ]}
        />

        <section className="mt-16 ml-72 p-6">{children}</section>
      </div>
    </main>
  );
}
