import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRoles: string[] = route.data['roles'] || [];
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/admin/dashboard'], { queryParams: { returnUrl: state.url } });
    }
    if (expectedRoles.length === 0) return true;
    const user = (this.auth as any).currentUserSubject?.value;
    if (!user) return this.router.createUrlTree(['/admin/dashboard']);
    if (expectedRoles.includes(user.role)) return true;
    // fallback: redirect to their dashboard
    return this.router.createUrlTree([user.role === 'Administrator' ? '/admin/dashboard' : '/customer/dashboard']);
  }
}
