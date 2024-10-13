import React, { useMemo } from "react";
import { Order } from "../../types/Orders";
import { StatusBadge } from "../StatusBadge";
import styles from "./OrderSummary.module.scss";

export const OrderSummary: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalValue / totalOrders;
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalOrders, totalValue, averageOrderValue, ordersByStatus };
  }, [orders]);

  return (
    <div className={styles.OrdersSummary}>
      <h3 className={styles.OrdersSummary__title}>Orders Summary</h3>
      <div className={styles.OrdersSummary__grid}>
        <div className={styles.OrdersSummary__item}>
          <p className={styles.OrdersSummary__label}>Total Orders</p>
          <p className={styles.OrdersSummary__value}>{summary.totalOrders}</p>
        </div>
        <div className={styles.OrdersSummary__item}>
          <p className={styles.OrdersSummary__label}>Total Value</p>
          <p className={styles.OrdersSummary__value}>
            ${summary.totalValue.toFixed(2)}
          </p>
        </div>
        <div className={styles.OrdersSummary__item}>
          <p className={styles.OrdersSummary__label}>Average Order Value</p>
          <p className={styles.OrdersSummary__value}>
            ${summary.averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>
      <div className={styles.OrdersSummary__statusSummary}>
        <h4 className={styles.OrdersSummary__statusSummaryTitle}>
          Orders by Status
        </h4>
        <ul className={styles.OrdersSummary__statusList}>
          {Object.entries(summary.ordersByStatus).map(([status, count]) => (
            <li key={status} className={styles.OrdersSummary__statusItem}>
              <StatusBadge status={status} />
              <span className={styles.OrdersSummary__statusCount}>{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
