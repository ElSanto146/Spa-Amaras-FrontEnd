import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { AdminComponent } from './pages/admin/admin.component';
import { User } from './models/ITurnoUserModel';
import { DetallesUsuarioComponent } from './pages/detalles-usuario/detalles-usuario.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'appointment', component: AppointmentComponent},
    {path: 'mis-turnos', component: MisTurnosComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'user-details/:id', component: DetallesUsuarioComponent},
    {path: '**', redirectTo: '/home', pathMatch: 'full'},
    
]; 
