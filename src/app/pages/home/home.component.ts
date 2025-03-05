import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LoginServiceService } from '../../service/login.service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private loginService: LoginServiceService, private router: Router) { }

  check(): void {
    if (this.loginService.currentUserLoginOn.value) {
      this.router.navigateByUrl('/appointment');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
