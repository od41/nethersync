import TransferPage from "./_components/transfers-page";

export default function TransfersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TransferPage>{children}</TransferPage>
    </>
  );
}
