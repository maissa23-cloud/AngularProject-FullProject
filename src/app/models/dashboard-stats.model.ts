export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  revenueGrowth: number;
}

export interface MonthlySales {
  month: string;
  year: number;
  totalSales: number;
  totalOrders: number;
}

export interface TopProduct {
  stockItemId: number;
  stockItemName: string;
  totalQuantity: number;
  totalSales: number;
}

export interface SalesByCategory {
  categoryName: string;
  totalSales: number;
  percentage: number;
}

export interface RecentOrder {
  orderId: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}
