import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ITurno } from '../../models/TurnoModel';
import { MisTurnosService } from '../../service/mis-turnos.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogAnimationsExampleDialog } from '../mis-turnos/modal-mis-turnos';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ITurnoUserModel } from '../../models/ITurnoUserModel';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule, MatSortModule, MatPaginatorModule, MatDividerModule, MatFormFieldModule, MatInputModule],
  providers: [DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, AfterViewInit {
  
  displayedColumns: string[] = ['date', 'status', 'actions', 'details'];
  isLoadingResults = true;
  dataSource: MatTableDataSource<ITurno> = new MatTableDataSource();
  turnos: ITurno[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private apiTurnos: MisTurnosService, public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
      this.loadTurnos();
  }

  loadTurnos(): ITurno[] {
    this.apiTurnos.getAllTurns().subscribe({
      next: (data) => {
        this.turnos = data;
        this.dataSource.data = this.turnos; // Asigna los datos a dataSource. Carga los datos en la tabla
        console.log('ver datos ', data);
        this.isLoadingResults = false;
      },
      error: (error) => {
        console.error('Error al cargar los turnos', error);
      }
    });
      return this.turnos;    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editTurnoStatus(turno: ITurnoUserModel): void {
    this.openDialog('225ms', '150ms', false).subscribe((result) => {
      if (result) {
        const updateTurno = { ...turno, status: 'CONFIRMADO' };
        this.apiTurnos.editTurno(turno.id, updateTurno).subscribe(() => {
          this.turnos = this.turnos.map((t) => (t.id === turno.id ? updateTurno : t));
          this.dataSource.data = this.turnos; // Actualiza los datos en dataSource
        });
      }
    });
  }

  eliminarTurno(id: number): void {
    this.openDialog('225ms', '150ms', true).subscribe((result) => {
      if (result) {
        this.apiTurnos.deleteTurno(id).subscribe(() => {
          this.turnos = this.turnos.filter((turno) => turno.id !== id);
          this.dataSource.data = this.turnos; // Actualiza los datos en dataSource
        });
      }
    });
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    isConfirmed: boolean
  ): Observable<boolean> {
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

  verDetalles(userId: number) {
    console.log('ver user id ', userId);
    this.router.navigate(['/user-details', userId]);
  }


/*
  //Definir las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['date', 'status', 'actions', 'details'];
  turnos: ITurno[] = [];

  resultsLength = this.turnos.length;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(private apiTurnos: MisTurnosService, public dialog: MatDialog, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadTurnos();
  }

  verDetalles(userId: number) {
    console.log('ver user id ', userId);
    this.router.navigate(['/user-details', userId]);
  }

  loadTurnos(): void {
    this.apiTurnos.getAllTurns().subscribe({
      next: (data) => {
        this.turnos = data;
        console.log('ver datos ', data);
        this.isLoadingResults = false;
      },
      error: (error) => {
        console.error('Error al cargar los turnos', error);
      }
    });
  }

  editTurnoStatus(turno: ITurno): void {
    this.openDialog('225ms', '150ms', false).subscribe((result) => {
      if (result) {
        const updateTurno = { ...turno, status: 'CONFIRMADO' };
        this.apiTurnos.editTurno(turno.id!, updateTurno).subscribe(() => {
          //this.loadTurnos();
          this.turnos = this.turnos.map((t) => t.id === turno.id ? updateTurno : t);
        });
      }
    });
  }

  eliminarTurno(id: number): void {
    this.openDialog('225ms', '150ms', true).subscribe((result) => {
      if (result) {
        this.apiTurnos.deleteTurno(id).subscribe(() => {
          this.turnos = this.turnos.filter((turno) => turno.id !== id)// Elimina el turno de la lista y actualiza la tabla
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
  }*/

}
