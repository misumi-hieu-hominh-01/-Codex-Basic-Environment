"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSession } from "../../store/sessionStore";
import { salesOrderApiRequest } from "../../lib/salesOrderApi";
import type { SalesOrder } from "../../types";
import styles from "./page.module.css";

const statuses = ["全て", "出荷準備中", "出荷済み", "キャンセル"];

export default function SalesOrdersPage() {
  // Helper function to get date in YYYY-MM-DD format
  const formatDateToYYYYMMDD = (date) => {
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  // Calculate default dates (3 months ago to today)
  const getDefaultDates = () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    return {
      from: formatDateToYYYYMMDD(threeMonthsAgo),
      to: formatDateToYYYYMMDD(today),
    };
  };

  const defaultDates = getDefaultDates();

  // Helper function to convert UI status to API status codes
  const mapStatusToCode = (status: string): string => {
    switch (status) {
      case "入金待ち":
        return "11,12";
      case "出荷準備中":
        return "02,03";
      case "出荷済み":
        return "01,04,05,07,08";
      case "着荷済み":
        return "06,09";
      case "キャンセル済み":
        return "99,16,17";
      default:
        return "01,02,03,04,05,06,07,08,09,11,12,16,17,99";
    }
  };

  const router = useRouter();
  const { session } = useSession();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [status, setStatus] = useState("全て");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    salesOrderDateFrom: defaultDates.from,
    salesOrderDateTo: defaultDates.to,
    soSlipStatus: "01,02,03,04,05,06,07,08,09,11,12,16,17,99", // All statuses by default
    sortby: "-registerDateTimeHeader,soLineNumber",
    limit: "500", // Changed to string to match API expectations
    offset: "1", // Changed to string to match API expectations
  });

  useEffect(() => {
    if (!session?.sessionId) {
      router.replace("/login");
    } else {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleSearch = async () => {
    if (!session?.sessionId) return;
    setLoading(true);
    setError(null);
    try {
      // Create updated params with current filter values
      const updatedParams = {
        ...searchParams,
        salesOrderDateFrom: dateFrom || defaultDates.from,
        salesOrderDateTo: dateTo || defaultDates.to,
        // Update status codes based on selection if needed
        soSlipStatus:
          status !== "全て"
            ? mapStatusToCode(status)
            : "01,02,03,04,05,06,07,08,09,11,12,16,17,99",
      };

      // Update the state
      setSearchParams(updatedParams);

      // Send the updated params to the API (use the updatedParams object directly)
      const data = await salesOrderApiRequest(updatedParams);
      setOrders(data.soSlipList as SalesOrder[]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.sessionId) {
    return null;
  }

  return (
    <div className={styles.page}>
      <h1>Sales Orders</h1>
      <div className={styles.filters}>
        <div className={styles.dates}>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className={styles.statusTabs}>
          {statuses.map((s) => (
            <button
              key={s}
              className={`${styles.tab} ${
                status === s ? styles.activeTab : ""
              }`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ORDER #</th>
            <th>DATE</th>
            <th>STATUS</th>
            <th>CUSTOMER</th>
            <th>TOTAL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.soSlipNumber}>
              <td>{order.soSlipNumber}</td>
              <td>{order.salesOrderDateTime}</td>
              <td>{order.soSlipStatus}</td>
              <td>{order.customer?.customerName}</td>
              <td>{order.amount?.totalSalesAmountIncludingTax}</td>
              <td>
                <Button type="button" variant="secondary">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
