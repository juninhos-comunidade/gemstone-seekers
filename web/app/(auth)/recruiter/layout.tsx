import { UserHeader } from "@/components/userHeader/UserHeader";

export default function RecruiterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background min-h-screen">
      <UserHeader role="recruiter" />
      <div>{children}</div>
    </div>
  );
}
