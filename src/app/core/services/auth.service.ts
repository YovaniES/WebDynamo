import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/auth.interface';
import { AUTH_SESSION_B2B } from '../constants/url.constants';
import { of } from 'rxjs';
import { ROL_GESTOR, ROL_USUARIO } from '../constants/rol.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toggleUserPanel = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  // login(loginData: Usuario) {
  //   return this.http.post<any>(API_AUTH_SESSION, loginData).pipe(
  //     tap((resp: any) => {
  //       localStorage.setItem('token', resp.user.token);
  //       localStorage.setItem('currentUser', JSON.stringify(resp));
  //     })
  //   );
  // }

  login_b2b(loginData: any) {
    return this.http.post<any>(AUTH_SESSION_B2B, loginData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.user.token);
        localStorage.setItem('currentUser', JSON.stringify(resp));
      })
    );
  }


  getRolID(){
    const decodedToken: any = this.decodeToken();
    // console.log('TOKEN', decodedToken);
    return decodedToken ? decodedToken.ROL_ID : '';
  }

  getUserNameByRol(){
    const usuarioLogeado: any = this.decodeToken();
    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_USUARIO.rolID ) {
      return null
    } else {
      // return usuarioLogeado.name
      return usuarioLogeado.unique_name
    }
  }

  getRolId(){
    const usuarioLogeado: any = this.decodeToken();
    // console.log('ROL_ID', usuarioLogeado);

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_USUARIO.rolID ) {
      return null
    } else {
      return usuarioLogeado.ROL_ID
    }
  }

  esUsuarioGestor(): boolean{
    const usuarioLogeado:any = this.decodeToken();
    // console.log('ROL_ID', usuarioLogeado);

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_GESTOR.rolID ) {
      return false
    } else {
      return true
    }
  }

  // userName:"fjdioses"
  getUsername() {
    const decodedToken: any = this.decodeToken();
    // console.log('USER-TOKEN', decodedToken);
    // return decodedToken ? decodedToken.name : '';
    return decodedToken ? decodedToken.unique_name : '';
  }

  getCurrentUser() {
    const currentUser: any = localStorage.getItem('currentUser');
    // console.log('USER-LOGUEADO',JSON.parse(currentUser));
    return of(currentUser ? JSON.parse(currentUser) : '');
  }


  decodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return jwt_decode(token);
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let validSession = false;
    let decodedToken: any = null;

    try {
      if (token) {
        decodedToken = jwt_decode(token);
      }

      if (decodedToken && decodedToken.exp) {
        validSession = true;
      }
      return validSession;
    } catch (err) {
      return false;
    }
  }

  logout() {
    this.router.navigateByUrl('auth');
    localStorage.clear();
  }
}
