import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;

  ngOnInit(): void {
    // customer-level dashboard
    // DashboardService already has getMonthlySales etc. But backend exposes /dashboard/customer
  }
}
