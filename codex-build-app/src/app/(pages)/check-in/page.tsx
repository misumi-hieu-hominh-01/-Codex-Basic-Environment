import { ManualBarcodeEntry } from "../../components/check-in/ManualBarcodeEntry";

export default function CheckInPage() {
  const handleManualSubmit = (barcode: string) => {
    console.log("Manual barcode submitted", barcode);
  };

  return (
    <div>
      <h1>Check-In Page</h1>
      <ManualBarcodeEntry onSubmit={handleManualSubmit} />
    </div>
  );
}
