import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginServiceService } from '../../service/login.service.service';
import { IUser } from '../../models/userModel';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../service/register.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { ITurno } from '../../models/TurnoModel';
import { MisTurnosService } from '../../service/mis-turnos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  userLoginOn: boolean = false;
  user?: IUser;
  errorMessage: String = "";
  turnos: ITurno[] = [];
  //turnosLength: number = 0;
  userRole?: string | null | undefined;

  isLogoutModalOpen = false; // Control del estado del modal 

  constructor(private loginService: LoginServiceService, private router: Router, private registerService: RegisterService, private apiTurnos: MisTurnosService) { }

  // Abre el modal de logout
  openLogoutModal(): void {
    this.isLogoutModalOpen = true;
  }

  // Cierra el modal de logout
  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  // Inicializar user con los datos del sessionStorage al cargar el componente
  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de login del usuario
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });

    // Suscribirse a los cambios en los datos del usuario
    this.loginService.currentUserDate.subscribe({
      next: (userData) => {
        this.user = userData ?? undefined;
      }
    });

    // Suscribirse a los cambios en el estado de login del usuario
    this.registerService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });

    // Suscribirse a los cambios en los datos del usuario
    this.registerService.currentUserDate.subscribe({
      next: (userData) => {
        this.user = userData ?? undefined;
      }
    });

    /* Obtener los turnos del usuario logueado
    this.apiTurnos.cantidadTurnos.subscribe({      
      next: (cantidad) => {
        this.apiTurnos.getTurnosById().subscribe
        this.turnosLength = cantidad;
      }
    }); */

    //Suscribe a los cambios en el rol del usuario
    this.loginService.userRole$.subscribe({
      next: (role) => {
        this.userRole = this.loginService.currentUserDate.value?.roles[0];
        console.log('userRole', this.userRole);
      }
    });

    this.registerService.userRole$.subscribe({
      next: (role) => {
        this.userRole = this.registerService.currentUserDate.value?.roles[0];
        console.log('userRole', this.userRole);
      }
    });
  }

  logout(): void {
    this.loginService.logout();
    this.closeLogoutModal();
    this.router.navigateByUrl('/home');
  }

}
