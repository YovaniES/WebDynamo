import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AUTH_SESSION_B2B } from '../constants/url.constants';
import { of } from 'rxjs';
import { ROLES_ENUM, ROL_GESTOR, ROL_USUARIO } from '../constants/rol.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toggleUserPanel = new EventEmitter<boolean>();
  currentUser: any;

  constructor(private http: HttpClient, private router: Router) {}

  login_b2b(loginData: any) {
    return this.http.post<any>(AUTH_SESSION_B2B, loginData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.user.token);
        localStorage.setItem('currentUser', JSON.stringify(resp));
      })
    );
  }

  //Obtenemos el ROL_ID, desde el TOKEN: ROL_ID=101,102,103,..106 (ROL_ID=106 : SUPER_ADMIN)
  getRolID(){
    const decodedToken: any = this.decodeToken();
    console.log('TOKEN-ROL_ID', decodedToken);
    return decodedToken ? decodedToken.ROL_ID : '';
  }

  // Obtenemos desde el TOKEN: unique_name:"jysantiago"; También el ID_ROL=101,102,...106
  getUsername() {
      const decodedToken: any = this.decodeToken();
      console.log('ROL_ID', decodedToken, decodedToken.ROL_ID);
      return decodedToken ? decodedToken.unique_name : '';
  }

  hasAccessToModule(roles: ROLES_ENUM[]){
    const decodedToken_RolId: any = this.decodeToken()
    return roles.includes(decodedToken_RolId.ROL_ID)
  }

  getUserNameByRol(){
    const usuarioLogeado: any = this.decodeToken();
    console.log('ROL_ID_USUARIO', usuarioLogeado.ROL_ID);

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_USUARIO.rolID ) {
      return null
    } else {
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

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_GESTOR.rolID ) {
      return false
    } else {
      return true
    }
  }

  getCurrentUser() {
    const currentUser: any = localStorage.getItem('currentUser');
    console.log('CURRENT_USER',JSON.parse(currentUser));
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

  // IApiUserAuthenticated
  get getUser(): any {
    console.log('USS', this.currentUser);

    return this.currentUser;
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
