interface PageProps {
  params: { barcode: string };
}

export default function StoreItemPage({ params }: PageProps) {
  return <div>Store item with barcode: {params.barcode}</div>;
}
