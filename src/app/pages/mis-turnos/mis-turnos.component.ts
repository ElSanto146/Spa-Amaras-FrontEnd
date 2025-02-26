
import { MisTurnosService } from '../../service/mis-turnos.service';
import { ITurno } from '../../models/TurnoModel';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog} from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from './modal-mis-turnos';
import {Component, OnInit} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatIconModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDividerModule],
  providers: [DialogAnimationsExampleDialog],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit {

  //Definir las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['date', 'hour', 'status', 'acciones'];
  turnos: ITurno[] = [];

  resultsLength = this.turnos.length;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(private apiTurnos: MisTurnosService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.apiTurnos.getTurnosById().subscribe((data: ITurno[]) => {
      this.turnos = data;
      console.log('ver datos ', data);
      this.isLoadingResults = false;
    });
  }

  eliminarTurno(id: number): void {
    this.openDialog('225ms', '150ms', true).subscribe((result) =>{
      if(result){
        this.apiTurnos.deleteTurno(id).subscribe(() => {
          this.turnos = this.turnos.filter((turno) => turno.id !== id)
        });
      }
    });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, isConfirmed: boolean): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { isConfirmed }
    });

    return dialogRef.afterClosed();
  }

  home() {
    this.router.navigate(['/home']);
}
  
}