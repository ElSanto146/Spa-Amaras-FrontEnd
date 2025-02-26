import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ITurno } from '../models/TurnoModel';

@Injectable({
  providedIn: 'root'
})
export class TurnoServiceService {

  constructor(private http: HttpClient) { } 

  reservarTurno(turno: ITurno): Observable<ITurno> {
    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ITurno>('http://localhost:8080/api/v1/user/turn/create', turno, {headers}).pipe(catchError(this.handleError));
  }

  public handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocorrido un error inespedado';

    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error);
    } else if (error.status === 403) {
      errorMessage = 'Tienes que estar registrado para poder reservar un turno';
    }
      else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
      errorMessage = error.error?.message;
    }
    return throwError(() => new Error( errorMessage));
  }



}
