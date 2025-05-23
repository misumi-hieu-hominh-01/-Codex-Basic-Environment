"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSession } from "../../store/sessionStore";
import { salesOrderApiRequest } from "../../lib/salesOrderApi";
import type { SalesOrder } from "../../types";
import styles from "./page.module.css";

// Helper function to get date in YYYY-MM-DD format
interface FormatDateToYYYYMMDD {
  (date: Date): string;
}

const statuses = [
  "全て",
  "入金待ち",
  "出荷準備中",
  "出荷済み",
  "着荷済み",
  "キャンセル済み",
];

export default function SalesOrdersPage() {
  const formatDateToYYYYMMDD: FormatDateToYYYYMMDD = (date) => {
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
  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);
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

  // Helper functions for formatting
  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "/");
  };

  const formatPrice = (price: string | number | undefined): string => {
    if (price === undefined || price === null) return "-";
    try {
      // Handle both string and number types
      const numValue = typeof price === "number" ? price : parseFloat(price);
      if (isNaN(numValue)) return "-";
      return numValue.toLocaleString("ja-JP");
    } catch (error) {
      console.error("Error formatting price:", error);
      return "-";
    }
  };

  const getStatusName = (statusCode: string | undefined): string => {
    if (!statusCode) return "Unknown";

    const statusMap: Record<string, string> = {
      "01": "処理済",
      "02": "準備中",
      "03": "準備完了",
      "04": "出荷中",
      "05": "出荷済",
      "06": "着荷済",
      "07": "部分出荷中",
      "08": "部分出荷済",
      "09": "部分着荷済",
      "11": "入金待ち",
      "12": "一部入金済",
      "16": "キャンセル依頼",
      "17": "部分キャンセル",
      "99": "キャンセル済",
    };

    // Ensure statusCode is a string that exists in the map
    const code = String(statusCode).padStart(2, "0");
    return statusMap[code] || `Status ${statusCode}`;
  };

  if (!session?.sessionId) {
    return null;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Sales Orders</h1>
      <div className={styles.filters}>
        <div className={styles.dates}>
          <div className={styles.dateInputWrapper}>
            <label className={styles.dateLabel}>From:</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.dateInputWrapper}>
            <label className={styles.dateLabel}>To:</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={styles.dateInput}
            />
          </div>
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
      <div style={{ position: "relative" }}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  {loading
                    ? "Loading orders..."
                    : "No orders found matching your criteria"}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.soSlipNumber}>
                  <td>{order.soSlipNumber}</td>
                  <td>{formatDateTime(order.salesOrderDateTime)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[`status${order.soSlipStatus}`] || ""
                      }`}
                    >
                      {getStatusName(order.soSlipStatus)}
                    </span>
                  </td>
                  <td>{order.customer?.customerName}</td>
                  <td className={styles.price}>
                    ￥{formatPrice(order.amount?.totalSalesAmountIncludingTax)}
                  </td>
                  <td className={styles.actionCell}>
                    <Button
                      type="button"
                      variant="secondary"
                      className={styles.viewButton}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
