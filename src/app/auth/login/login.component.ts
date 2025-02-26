import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { LoginServiceService } from '../../service/login.service.service';
import { LoginRequest } from '../../models/LoginRequest';
import { IUser } from '../../models/userModel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  userLogin?: IUser; 
  loginError: string = '';
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginServiceService) { }

  ngOnInit(): void { 
  }

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loginError = '';
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userDate: IUser) => {
          this.userLogin = userDate;
          console.log('Usuario logueado', userDate);
          this.loginForm.reset();
          if (userDate.roles[0] === 'ROLE_ADMIN') {
            this.router.navigateByUrl('/admin');
          } else {
          this.router.navigateByUrl('/appointment');
          }
        },
        error: (errorData) => {
          console.error('Error al loguear usuario', errorData);
          this.loginError = errorData || 'Error al iniciar sesión';
        },
        complete: () => {
          console.info('Login completado');                   
        }
      })

    } else {
      this.loginForm.markAllAsTouched();
      alert('Por favor complete los campos requeridos');
    }
  }
}
