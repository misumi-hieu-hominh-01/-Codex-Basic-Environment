export interface SalesOrder {
  soSlipNumber: string;
  salesOrderDateTime: string;
  soSlipStatus: string;
  customer?: {
    customerName?: string;
    customerId?: string;
  };
  amount?: {
    totalSalesAmountIncludingTax?: string | number;
    subTotal?: string | number;
    totalTaxAmount?: string | number;
  };
  items?: Array<{
    itemId: string;
    itemName?: string;
    quantity?: number;
    price?: string | number;
  }>;
}
