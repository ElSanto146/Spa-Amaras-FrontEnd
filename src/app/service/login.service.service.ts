import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from '../models/LoginRequest';
import { IUser } from '../models/userModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  //Los behaviorSubject son observables que emiten el último valor emitido por el observable. Se inicializa en false porque no hay un token en el sessionStorage
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
  //Aquí se recibirá el token con los datos del usuario que se guardará en el sessionStorage
  currentUserDate: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('user')!) : null);

  userRole = new BehaviorSubject<string | null>(sessionStorage.getItem('roles') || null);
  url: string = environment.apiUrlProd;

  constructor(private http: HttpClient) {
    /*Se verifica si hay un token en el sessionStorage
    this.currentUserLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
    //Se verifica si hay un token en el sessionStorage sino devuelve una cadena vacía
    this.currentUserDate = new BehaviorSubject<any>(sessionStorage.getItem("token") || "");*/
  }

  //Se envía la petición al servidor para loguear al usuario
  //Con pipe se puede encadenar operadores de RxJS. En este caso se usa tap para realizar una acción secundaria. Y map para transformar el resultado de la petición. Con catchError se maneja el error.

  //Inicia sesión y actualiza el estado del usuario
  login(credentials: LoginRequest): Observable<IUser> {
    return this.http.post<any>(this.url + "auth/login", credentials).pipe(
      //el operator tap permite realizar una acción secundaria sin modificar el flujo de datos. En este caso se guarda el token en el sessionStorage y se emite el valor del token en el observable currentUserDate
      tap((userData) => {
        sessionStorage.setItem("token", userData.token);// Guarda el token en el sessionStorage
        sessionStorage.setItem('user', JSON.stringify(userData)); // Guarda los datos del usuario
        this.currentUserDate.next(userData);// Emite los datos del usuario
        this.currentUserLoginOn.next(true);// Emite el estado de login
        this.userRole.next(userData.roles[0]);// Emite el rol del usuario
      }),
      map((userData) => userData),// Esta línea es opcional, puedes omitir el map si no cambias el objeto.
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');// Elimina el token del sessionStorage
    sessionStorage.removeItem('user');// Elimina los datos del usuario
    this.currentUserLoginOn.next(false);
    this.currentUserDate.next(null);
  }

  //Manejo de errores de las peticiones HTTP No dice nada
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }

  setCurrentUserLoginOn(status: boolean): void {
    this.currentUserLoginOn.next(status);
  }

  setCurrentUserDate(user: IUser | null): void {
    this.currentUserDate.next(user);
  }

  //Obtiene un observable de los datos del usuario
  get userData(): Observable<IUser | null> {
    return this.currentUserDate.asObservable();
  }

  //Obtiene un observable del estado de login del usuario
  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  //Obtiene el token del usuario
  get userToken(): String | null {
    return sessionStorage.getItem("token");//Devuelve solo el token
  }

  //Obtener el rol del usuario
  get userRole$(): Observable<string | null> {
    return this.userRole.asObservable();
  }
}
