'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSession } from '../../store/sessionStore';
import type { SalesOrder } from '../../types';
import styles from './page.module.css';

const mockOrders: SalesOrder[] = [
  {
    orderNumber: 'AB23G23G8C',
    date: '2025-05-19',
    status: '出荷準備中',
    customer: 'エコエナジー研究所',
    total: '1,089円',
  },
  {
    orderNumber: 'CD34H56I7J',
    date: '2025-05-20',
    status: '出荷済み',
    customer: 'スマートホーム株式会社',
    total: '2,500円',
  },
  {
    orderNumber: 'EF45I78K9L',
    date: '2025-05-18',
    status: 'キャンセル',
    customer: 'グリーンエネルギー社',
    total: '980円',
  },
  {
    orderNumber: 'GH56J89L0M',
    date: '2025-05-17',
    status: '出荷準備中',
    customer: '太陽光ソリューション',
    total: '4,200円',
  },
  {
    orderNumber: 'IJ67K90M1N',
    date: '2025-05-19',
    status: '出荷済み',
    customer: 'クリーンパワーサービス',
    total: '3,300円',
  },
];

const statuses = ['全て', '出荷準備中', '出荷済み', 'キャンセル'];

export default function SalesOrdersPage() {
  const router = useRouter();
  const { session } = useSession();
  const [orders] = useState<SalesOrder[]>(mockOrders);
  const [filtered, setFiltered] = useState<SalesOrder[]>(mockOrders);
  const [status, setStatus] = useState('全て');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!session?.sessionId) {
      router.replace('/login');
    }
  }, [session, router]);

  const handleSearch = () => {
    let result = orders;
    if (status !== '全て') {
      result = result.filter((o) => o.status === status);
    }
    if (dateFrom) {
      result = result.filter((o) => o.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((o) => o.date <= dateTo);
    }
    setFiltered(result);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
        <Button type="button" onClick={handleSearch}>
          Search
        </Button>
      </div>
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
          {filtered.map((order) => (
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
