import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../models/ITurnoUserModel';
import { IUserDetail } from '../../models/UserDetail';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MisTurnosService } from '../../service/mis-turnos.service';
import { ITurno } from '../../models/TurnoModel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detalles-usuario',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './detalles-usuario.component.html',
  styleUrl: './detalles-usuario.component.css'
})
export class DetallesUsuarioComponent implements OnInit {

  isLoading = true;
  UserDetail?: IUserDetail;
  turnList: ITurno[] = [];

  private _route = inject(ActivatedRoute);
  private _apiService = inject(MisTurnosService);
  private _router = inject(Router);

  ngOnInit(): void {
    //Capturar el valor del parámetro
    this._route.params.subscribe(params => {
      this._apiService.findUserById(params['id']).subscribe((data: IUserDetail) => {
        this.UserDetail = data;
        this.turnList = data.turns.map(turn => ({
          ...turn,
          user: turn.user ?? { id: 0 } // Asegúrate de que user no sea null
        }));
        console.log('ver data ', data);
        this.isLoading = false;
        
      });
    })
  }

  volver() {
    this._router.navigate(['/admin']);
  }


}
