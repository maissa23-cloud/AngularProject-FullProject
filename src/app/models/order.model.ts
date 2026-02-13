export interface Order {
  orderId: number;
  customerId: number;
  customerName: string;
  salespersonName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: OrderStatus;
  orderLines: OrderLine[];
}

export interface OrderLine {
  orderLineId: number;
  stockItemId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalAmount: number;
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}
