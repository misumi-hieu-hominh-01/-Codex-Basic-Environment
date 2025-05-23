'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSession } from '../../store/sessionStore';
import { salesOrderApiRequest } from '../../lib/salesOrderApi';
import type { SalesOrder } from '../../types';
import styles from './page.module.css';

const statuses = ['全て', '出荷準備中', '出荷済み', 'キャンセル'];

export default function SalesOrdersPage() {
  const router = useRouter();
  const { session } = useSession();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [status, setStatus] = useState('全て');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.sessionId) {
      router.replace('/login');
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
      const params: Record<string, string> = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (status !== '全て') params.status = status;
      const data = await salesOrderApiRequest('sales-orders', params);
      setOrders(data as SalesOrder[]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Fetch failed');
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
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div className={styles.statusTabs}>
          {statuses.map((s) => (
            <button
              key={s}
              className={`${styles.tab} ${status === s ? styles.activeTab : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
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
            <tr key={order.orderNumber}>
              <td>{order.orderNumber}</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
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
