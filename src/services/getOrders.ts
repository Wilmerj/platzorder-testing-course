const host = "http://localhost:3000";
const path = "/orders/";

export const getOrders = async () => {
  try {
    const response = await fetch(`${host}${path}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
