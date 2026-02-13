import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },

      // Admin area
      {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Administrator'] },
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
          { path: 'sales', loadComponent: () => import('./features/sales/sales.component').then(m => m.SalesComponent) },
          { path: 'products', loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
          { path: 'customers', loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent) },
          { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
          { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) }
        ]
      },

      // Customer area
      {
        path: 'customer',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Customer'] },
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
          { path: 'orders', loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) },
          { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'admin/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
