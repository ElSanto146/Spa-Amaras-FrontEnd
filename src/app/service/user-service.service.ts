import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../models/userModel';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor() { }

  private _http = inject(HttpClient);

  private _url = 'http://localhost:8080/api/v1/';

  //Método para obtener un usuario por su id
  getUser(id: number): Observable<IUser> {
    return this._http.get<IUser>(`${this._url}user/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));    
  }


}
