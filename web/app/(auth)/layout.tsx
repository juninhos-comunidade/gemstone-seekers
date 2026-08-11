export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </main>
  );
}
