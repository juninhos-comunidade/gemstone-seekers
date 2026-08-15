import { UserHeader } from "@/components/userHeader/UserHeader";

export default function CandidateRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background min-h-screen">
      <UserHeader role="candidate" />
      <div>{children}</div>
    </div>
  );
}
