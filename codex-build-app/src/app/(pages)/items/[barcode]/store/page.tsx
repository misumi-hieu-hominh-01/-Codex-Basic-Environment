interface StoreItemPageProps {
  params: Promise<{
    barcode: string;
  }>;
}

export default async function StoreItemPage({ params }: StoreItemPageProps) {
  const { barcode } = await params;
  return (
    <div>
      <h1>Store Item Page</h1>
      <p>Barcode: {barcode}</p>
    </div>
  );
}
