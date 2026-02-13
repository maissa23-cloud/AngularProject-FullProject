import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  loading = true;

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.user.getProfile().subscribe({ next: (p) => { this.profile = p; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
