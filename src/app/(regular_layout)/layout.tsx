import DefaultPage from "./_components/default-page";

export default function TransfersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DefaultPage>{children}</DefaultPage>
    </>
  );
}
