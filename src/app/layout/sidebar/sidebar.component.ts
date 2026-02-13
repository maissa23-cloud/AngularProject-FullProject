import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isCollapsed = false;
  currentUser$: Observable<User | null>;

  constructor(private auth: AuthService, private router: Router) {
    this.currentUser$ = this.auth.currentUser$;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.auth.logout();
  }

  adminNav(): NavItem[] {
    return [
      { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
      { label: 'Sales', icon: 'point_of_sale', route: '/admin/sales' },
      { label: 'Customers', icon: 'people', route: '/admin/customers' },
      { label: 'Products', icon: 'inventory_2', route: '/admin/products' },
      { label: 'Reports', icon: 'assessment', route: '/admin/reports' },
      { label: 'Settings', icon: 'settings', route: '/admin/settings' }
    ];
  }

  customerNav(): NavItem[] {
    return [
      { label: 'Dashboard', icon: 'dashboard', route: '/customer/dashboard' },
      { label: 'Orders', icon: 'receipt_long', route: '/customer/orders' },
      { label: 'Profile', icon: 'person', route: '/customer/profile' }
    ];
  }
}
