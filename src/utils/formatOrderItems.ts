interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  product_price: number;
  quantity: number;
  line_total: number;
}

export const formatOrderItems = (orderItems: OrderItem[]) => {
  const items = orderItems.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_image_url: item.product_image_url,
    product_price: Number(item.product_price),
    quantity: item.quantity,
    line_total: Number(item.line_total),
  }));

  const total = items.reduce((sum, item) => sum + item.line_total, 0);

  return {
    items,
    total,
  };
};
