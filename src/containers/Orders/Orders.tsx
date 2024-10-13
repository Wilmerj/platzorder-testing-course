import React, { useState, useEffect } from "react";
import { getOrders } from "../../services/getOrders";
import { Order } from "../../types/Orders";
import { OrderSummary } from "../../components/OrderSummary";
import { StatusBadge } from "../../components/StatusBadge";
import classes from "./Orders.module.scss";

const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={classes.orders__item}>
      <div className={classes.orders__header}>
        <h3 className={classes.orders__id}>Order #{order.id.slice(0, 8)}</h3>
        <p className={classes.orders__date}>{formatDate(order.orderDate)}</p>
        <StatusBadge status={order.status} />
      </div>
      <div className={classes.orders__customer}>
        <p className={classes.orders__customerName}>{order.customer.name}</p>
        <p className={classes.orders__customerEmail}>{order.customer.email}</p>
      </div>
      <div className={classes.orders__products}>
        <h4 className={classes.orders__productsTitle}>Order Items:</h4>
        <ul className={classes.orders__productsList}>
          {order.products.map((product) => (
            <li key={product.id} className={classes.orders__productsItem}>
              <span>
                {product.name} x{product.quantity}
              </span>
              <span>${(product.price * product.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={classes.orders__footer}>
        <div className={classes.orders__payment}>
          <p className={classes.orders__paymentLabel}>Payment Method</p>
          <p className={classes.orders__paymentMethod}>
            {order.paymentMethod.replace("_", " ")}
          </p>
        </div>
        <div className={classes.orders__total}>
          <p className={classes.orders__totalLabel}>Total Amount</p>
          <p className={classes.orders__totalAmount}>
            ${order.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className={classes.orders__loading}>Loading orders...</div>;
  }

  if (error) {
    return <div className={classes.orders__error}>{error}</div>;
  }

  return (
    <section className={classes.orders}>
      <div className={classes.orders__container}>
        <h2 className={classes.orders__title}>Order History</h2>
        <OrderSummary orders={orders} />
        <div className={classes.orders__list}>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
};
