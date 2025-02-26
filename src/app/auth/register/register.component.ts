import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../models/userModel';
import { RegisterService } from '../../service/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  userLogin?: IUser;
  RegisterError: string = '';
  infoMessage: string = '';
  registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {
  }

  register(): void { 
    if (this.registerForm.valid) {
      this.RegisterError = '';
      this.registerService.register(this.registerForm.value as IUser).subscribe({
        next: (userDate: IUser) => {
          this.userLogin = userDate;
          this.infoMessage = 'Usuario registrado con éxito';
          setTimeout(() => {
          console.log('Usuario registrado', userDate);
          this.router.navigateByUrl('/appointment');
          this.registerForm.reset();
        }, 1500);
      },
        error: (errorData) => {
          console.error('Error al registar el usuario', errorData);
          this.RegisterError = errorData ;
        },
        complete: () => {
          console.info('Registro completado');
        }
      })

    } else {
      this.registerForm.markAllAsTouched();
      alert('Por favor complete los campos requeridos');
    }
  }

  get username() {
    return this.registerForm.controls.username;
  }

  get name() {
    return this.registerForm.controls.name;
  }

  get phone() {
    return this.registerForm.controls.phone;
  }

  get password() {
    return this.registerForm.controls.password;
  }

}
