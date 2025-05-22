interface StoreItemPageProps {
  params: {
    barcode: string;
  };
}

export default function StoreItemPage({ params }: StoreItemPageProps) {
  return (
    <div>
      <h1>Store Item Page</h1>
      <p>Barcode: {params.barcode}</p>
    </div>
  );
}
