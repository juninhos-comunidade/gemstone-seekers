import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";

export default function CandidateRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background min-h-screen">
      <DashboardHeader role="recruiter" />
      <div>{children}</div>
    </div>
  );
}
