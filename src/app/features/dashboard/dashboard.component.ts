import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  DashboardStats,
  MonthlySales,
  TopProduct,
  SalesByCategory,
  RecentOrder
} from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    revenueGrowth: 0
  };

  recentOrders: RecentOrder[] = [];
  isLoading = true;

  // ---------- KPI Cards ----------
  kpiCards: KpiCard[] = [];

  // ---------- Sales Per Month (Bar Chart) ----------
  salesChartType = 'bar' as const;
  salesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  salesChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2d',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a1a5b7', font: { size: 12 } }
      },
      y: {
        grid: { color: '#f5f8fa' },
        ticks: {
          color: '#a1a5b7',
          font: { size: 12 },
          callback: (value) => '$' + Number(value).toLocaleString()
        }
      }
    }
  };

  // ---------- Top Products (Horizontal Bar) ----------
  topProductsChartType = 'bar' as const;
  topProductsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  topProductsChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2d',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: '#f5f8fa' },
        ticks: {
          color: '#a1a5b7',
          font: { size: 12 },
          callback: (value) => '$' + Number(value).toLocaleString()
        }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#a1a5b7', font: { size: 12 } }
      }
    }
  };

  // ---------- Sales By Category (Doughnut) ----------
  categoryChartType = 'doughnut' as const;
  categoryChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  categoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1e1e2d',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Load stats
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.buildKpiCards();
      },
      error: () => this.loadMockData()
    });

    // Load monthly sales
    this.dashboardService.getMonthlySales().subscribe({
      next: (data) => this.buildSalesChart(data),
      error: () => this.buildSalesChart(this.getMockMonthlySales())
    });

    // Load top products
    this.dashboardService.getTopProducts(7).subscribe({
      next: (data) => this.buildTopProductsChart(data),
      error: () => this.buildTopProductsChart(this.getMockTopProducts())
    });

    // Load sales by category
    this.dashboardService.getSalesByCategory().subscribe({
      next: (data) => this.buildCategoryChart(data),
      error: () => this.buildCategoryChart(this.getMockSalesByCategory())
    });

    // Load recent orders
    this.dashboardService.getRecentOrders(5).subscribe({
      next: (data) => {
        this.recentOrders = data;
        this.isLoading = false;
      },
      error: () => {
        this.recentOrders = this.getMockRecentOrders();
        this.isLoading = false;
      }
    });
  }

  private buildKpiCards(): void {
    this.kpiCards = [
      {
        title: 'Total Sales',
        value: this.stats.totalSales,
        format: 'currency',
        growth: this.stats.salesGrowth,
        icon: 'trending_up',
        color: '#3699ff'
      },
      {
        title: 'Total Orders',
        value: this.stats.totalOrders,
        format: 'number',
        growth: this.stats.ordersGrowth,
        icon: 'shopping_cart',
        color: '#1bc5bd'
      },
      {
        title: 'Total Customers',
        value: this.stats.totalCustomers,
        format: 'number',
        growth: this.stats.customersGrowth,
        icon: 'people',
        color: '#8950fc'
      },
      {
        title: 'Total Revenue',
        value: this.stats.totalRevenue,
        format: 'currency',
        growth: this.stats.revenueGrowth,
        icon: 'account_balance_wallet',
        color: '#ffa800'
      }
    ];
  }

  private buildSalesChart(data: MonthlySales[]): void {
    this.salesChartData = {
      labels: data.map((d) => d.month),
      datasets: [
        {
          data: data.map((d) => d.totalSales),
          backgroundColor: 'rgba(54, 153, 255, 0.8)',
          hoverBackgroundColor: '#3699ff',
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6
        }
      ]
    };
  }

  private buildTopProductsChart(data: TopProduct[]): void {
    const colors = [
      '#3699ff', '#1bc5bd', '#8950fc', '#ffa800',
      '#f1416c', '#7239ea', '#00d2ff'
    ];
    this.topProductsChartData = {
      labels: data.map((d) => this.truncateLabel(d.stockItemName, 25)),
      datasets: [
        {
          data: data.map((d) => d.totalSales),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6
        }
      ]
    };
  }

  private buildCategoryChart(data: SalesByCategory[]): void {
    const colors = [
      '#3699ff', '#1bc5bd', '#8950fc', '#ffa800',
      '#f1416c', '#7239ea', '#00d2ff', '#50cd89'
    ];
    this.categoryChartData = {
      labels: data.map((d) => d.categoryName),
      datasets: [
        {
          data: data.map((d) => d.totalSales),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          hoverOffset: 8,
          borderWidth: 0
        }
      ]
    };
  }

  private truncateLabel(label: string, maxLength: number): string {
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Delivered: 'status-delivered',
      Shipped: 'status-shipped',
      Processing: 'status-processing',
      Pending: 'status-pending',
      Cancelled: 'status-cancelled'
    };
    return map[status] || 'status-pending';
  }

  // ========== Mock Data (used when API unavailable) ==========

  private loadMockData(): void {
    this.stats = {
      totalSales: 3_845_250,
      totalOrders: 12_458,
      totalCustomers: 3_672,
      totalRevenue: 2_945_830,
      salesGrowth: 12.5,
      ordersGrowth: 8.3,
      customersGrowth: 5.7,
      revenueGrowth: 15.2
    };
    this.buildKpiCards();
  }

  private getMockMonthlySales(): MonthlySales[] {
    return [
      { month: 'Jan', year: 2025, totalSales: 285000, totalOrders: 980 },
      { month: 'Feb', year: 2025, totalSales: 310000, totalOrders: 1050 },
      { month: 'Mar', year: 2025, totalSales: 345000, totalOrders: 1120 },
      { month: 'Apr', year: 2025, totalSales: 298000, totalOrders: 1010 },
      { month: 'May', year: 2025, totalSales: 372000, totalOrders: 1200 },
      { month: 'Jun', year: 2025, totalSales: 415000, totalOrders: 1380 },
      { month: 'Jul', year: 2025, totalSales: 390000, totalOrders: 1290 },
      { month: 'Aug', year: 2025, totalSales: 425000, totalOrders: 1420 },
      { month: 'Sep', year: 2025, totalSales: 360000, totalOrders: 1180 },
      { month: 'Oct', year: 2025, totalSales: 398000, totalOrders: 1310 },
      { month: 'Nov', year: 2025, totalSales: 445000, totalOrders: 1480 },
      { month: 'Dec', year: 2025, totalSales: 480000, totalOrders: 1590 }
    ];
  }

  private getMockTopProducts(): TopProduct[] {
    return [
      { stockItemId: 1, stockItemName: 'USB Missile Launcher (Green)', totalQuantity: 4500, totalSales: 125000 },
      { stockItemId: 2, stockItemName: 'Air Cushion Machine (Blue)', totalQuantity: 3800, totalSales: 98000 },
      { stockItemId: 3, stockItemName: 'Chocolate Frogs 250g', totalQuantity: 5200, totalSales: 87000 },
      { stockItemId: 4, stockItemName: 'RC Stock Car (Red)', totalQuantity: 2900, totalSales: 76000 },
      { stockItemId: 5, stockItemName: 'Ride on Toy Car (Black)', totalQuantity: 2100, totalSales: 68000 },
      { stockItemId: 6, stockItemName: 'Halloween Mask (Witch)', totalQuantity: 3400, totalSales: 54000 },
      { stockItemId: 7, stockItemName: 'Developer Joke Mug', totalQuantity: 4100, totalSales: 45000 }
    ];
  }

  private getMockSalesByCategory(): SalesByCategory[] {
    return [
      { categoryName: 'Novelty Items', totalSales: 845000, percentage: 28 },
      { categoryName: 'Clothing', totalSales: 620000, percentage: 21 },
      { categoryName: 'Mugs', totalSales: 480000, percentage: 16 },
      { categoryName: 'T-Shirts', totalSales: 390000, percentage: 13 },
      { categoryName: 'Toys', totalSales: 340000, percentage: 11 },
      { categoryName: 'Packaging', totalSales: 330000, percentage: 11 }
    ];
  }

  private getMockRecentOrders(): RecentOrder[] {
    return [
      { orderId: 73595, customerName: 'Tailspin Toys (Head)', orderDate: '2025-12-15', totalAmount: 2450.00, status: 'Delivered' },
      { orderId: 73594, customerName: 'Wingtip Toys (Sylva)', orderDate: '2025-12-14', totalAmount: 1890.00, status: 'Shipped' },
      { orderId: 73593, customerName: 'Contoso Ltd', orderDate: '2025-12-14', totalAmount: 3210.00, status: 'Processing' },
      { orderId: 73592, customerName: 'Adventure Works', orderDate: '2025-12-13', totalAmount: 985.00, status: 'Pending' },
      { orderId: 73591, customerName: 'Fabrikam Inc', orderDate: '2025-12-12', totalAmount: 1560.00, status: 'Delivered' }
    ];
  }
}

interface KpiCard {
  title: string;
  value: number;
  format: 'currency' | 'number';
  growth: number;
  icon: string;
  color: string;
}
