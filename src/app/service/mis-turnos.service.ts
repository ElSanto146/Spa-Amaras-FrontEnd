import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';
import { ITurno } from '../models/TurnoModel';
import { IUserTurno } from '../models/IUserTurnoModel';
import { ITurnoUserModel } from '../models/ITurnoUserModel';
import { IUserDetail } from '../models/UserDetail';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MisTurnosService {
  private turnosSubject = new BehaviorSubject<ITurno[]>([]);
  turnos$ = this.turnosSubject.asObservable();

  private _http = inject(HttpClient);
  private urlBase: string = environment.apiUrlProd + "api/v1/user";

  cantidadTurnos: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  findUserById(id: number): Observable<IUserDetail> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.get<IUserDetail>(`${this.urlBase}/${id}`, { headers });
  }

  getAllTurns(): Observable<ITurnoUserModel[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    //Retorna un observable con la lista de turnos
    return this._http.get<ITurnoUserModel[]>(`${this.urlBase}/turns`, { headers }).pipe(
      tap(response => {
        this.turnosSubject.next(response);
      })
    );
  }

  getTurnosById(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');

    if (!userData) {
      console.error("Error: No hay datos de usuario en sessionStorage.");
      return throwError(() => new Error("No se encontró el usuario en sessionStorage"));
    }

    const user = JSON.parse(userData); // Convierte el string en un objeto JSON
    const id = user.id; // Extrae el ID

    if (!id) {
      console.error("Error: El ID del usuario es null o undefined.");
      return throwError(() => new Error("El ID del usuario no está disponible"));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.get<IUserTurno>(`${this.urlBase}/${id}`, { headers }).pipe(
      tap(response => this.cantidadTurnos.next(response.turns.length), // Actualiza la cantidad de turnos
        turnos => this.turnosSubject.next(turnos)),
      map(response => response.turns || []) // Extrae solo los turnos del objeto JSON
    );

    /*return this._http.get<ITurno>(`${this.urlBase}/${id}`, { headers }).pipe(
      tap(turnos => this.turnosSubject.next(turnos))
    );*/
  }

  deleteTurno(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.delete<any>(`${this.urlBase}/turn/${id}`, { headers }).pipe(
      tap(() => {
        const currentTurnos = this.turnosSubject.value;
        this.turnosSubject.next(currentTurnos.filter(turno => turno.id !== id));
      })
    );
  }

  editTurno(id: number, turno: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.put<any>(`${this.urlBase}/turn/${id}`, turno, { headers }).pipe(
      tap(() => {
        const currentTurnos = this.turnosSubject.value;
        const updatedTurnos = currentTurnos.map(t => t.id === id ? { ...t, ...turno } : t);
        this.turnosSubject.next(updatedTurnos);
      })
    );
  }
}
