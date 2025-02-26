import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TurnoServiceService } from '../../service/turno.service.service';
import { ITurno } from '../../models/TurnoModel';
import { LoginServiceService } from '../../service/login.service.service';
import { RegisterService } from '../../service/register.service';
import { IUser } from '../../models/userModel';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { JwtInterceptorService } from '../../service/auth/jwt-interceptor.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }, DatePipe
  /*{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }*/],
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatCardModule, MatDialogModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],

})
export class AppointmentComponent implements OnInit {
  dateForm = this.fb.group({
    inputDate: [{ value: '', disabled: true }, Validators.required],
    inputHour: [{ value: '', disabled: true }, Validators.required],
  });

  minDate: Date = new Date();//Fecha mínima: el día actual
  selected: Date | null = null;
  selectedHour: string | null = null;
  hours: { time: string; disabled: boolean }[] = [];
  isConfirmationModalOpen: boolean = false;
  showDateError: boolean = false;
  showHourError: boolean = false;
  showDateHour: boolean = true;
  showHour: boolean = true;
  user?: IUser;
  msgBack: string = '';
  showmessage: boolean = false;
  // = this.turnoService.messagesBackEnd$; //Se suscribe al error

  constructor(private fb: FormBuilder, private router: Router, private turnoService: TurnoServiceService, private loginService: LoginServiceService, private registerService: RegisterService, private datePipe: DatePipe, public dialog: MatDialog) {
    this.generateHours(); //Genera horarios al inicializar el componente
  }

  ngOnInit(): void {
    //Obtener el usuario logueado desde el sessionStorage
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }

  //Filtro para deshabilitar los días domingo y lunes
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 1
      ;
  };

  // Actualizar la fecha seleccionada en el formulario
  onDateChange(event: Date | null): void {
    if (event) {
      this.selected = event;
      this.dateForm.patchValue({ inputDate: this.formatDate(event.toString()) });
      this.showDateError = false;
      this.showDateHour = false;
      console.log('Fecha seleccionada:', event);
    }
  }

  // Formatear la fecha a un string (dd-MM-yyyy)
  formatDate(date: string): string{
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  } 

  // Manejar la selección de una hora
  selectHour(hour: string): void {
    this.selectedHour = hour;
    this.dateForm.controls['inputHour'].setValue(hour); // Actualiza el valor del inputHour
    this.showHourError = false;
    this.showHour = false;
    console.log('Hora seleccionada:', hour);
  }

  //Generar los horarios entre las 8:00 y las 19:40 con intervalos de 20 minutos
  private generateHours(): void {
    const start = new Date();
    start.setHours(8, 0, 0); //8:00 
    const end = new Date();
    end.setHours(19, 40, 0); //19:40 

    while (start < end) {
      this.hours.push({ time: this.formatTime(start), disabled: false });
      start.setMinutes(start.getMinutes() + 40); //Intervalo 40 minutos
    }
  }

  // Formatear el objeto Date a un string (HH:mm)
  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  // Enviar datos al backend
  onSubmit(): void {
    const { inputDate, inputHour } = this.dateForm.value;

    //verificar si se ha seleccionado una fecha y una hora
    this.showDateError = !inputDate;
    this.showHourError = !inputHour;

    // 🚨 Si falta algún dato, mostramos los errores y detenemos la ejecución
    if (!inputDate || !inputHour) {
      console.warn('Debes seleccionar una fecha y una hora antes de continuar');
      return;
    }

    const turnoRequest: ITurno = {
      date: inputDate,
      hour: inputHour,
      status: 'PENDIENTE',
      user: { id: this.user?.id ?? 0 }  //Toma el id del usuario logueado
    }

    this.turnoService.reservarTurno(turnoRequest).subscribe({
      next: (data) => {
        console.log('Turno reservado con éxito', data);
        this.showDateHour = false;
        this.openConfirmationModal();
      },
      error: (error) => {
        this.msgBack = error.message;
        console.warn('Conflict: ',this.msgBack);
        this.showmessage = true;
      }
     
    }); 
  }

  // Método para cerrar el modal de confirmación
  closeConfirmationModal(): void {
    this.isConfirmationModalOpen = false;
  }

  // Método para abrir el modal de confirmación
  openConfirmationModal(): void {
    this.isConfirmationModalOpen = true;
  }

  // Método para crear una nueva reserva
  newReservation(): void {
    this.dateForm.reset();
    this.selected = null
    this.showDateHour = true;
    this.showHour = true;
    this.isConfirmationModalOpen = false;
  }

  //Método para salir
  exit(): void {
    this.router.navigateByUrl('/home');
  }

  onCancel(): void{
    this.dateForm.reset();
    this.selected = null
    this.showDateHour = true;
    this.showHour = true;
    this.showmessage = false;
  }

}

