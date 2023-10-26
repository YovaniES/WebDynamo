import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import {
//   API_ASSIGN_ROL,
//   API_GET_MODULES,
//   API_MENU,
//   API_MODULE,
//   API_MODULES,
//   API_USERS,
//   API_USERS_SEARCH,
// } from '../core/constants/url.constants';


@Injectable({
  providedIn: 'root',
})
export class PermissionsService {


  constructor(private http: HttpClient) {}

  getModules() {
    // return this.http.get(API_GET_MODULES);


  }

  postModule(data: any) {
    // return this.http.post(API_MODULE, data);
  }

  postMenu(data: any) {
    // return this.http.post(API_MENU, data);
  }

  getAllModules() {
    // return this.http.get(API_MODULES);
  }

  //USERS
  // getAllUsers(
  //   page: number,
  //   size: number,
  //   filter?: string,
  //   location?: string,
  //   status?: number
  // ): Observable<Object> {
  //   let params = '?page=' + page + '&size=' + size;
  //   params = params + (filter ? '&filter=' + filter : '');
  //   /* params = params + (location ? "&location=" + location : "");
  //   params = params + (status ? "&status=" + status : ""); */
  //   return this.http.get(API_USERS + params);
  //   // return this.http.get(API_USERS + params).pipe(map(p => p['content']));;
  // }

  // searchUsers(filter: string): Observable<Object> {
  //   return this.http.get(API_USERS_SEARCH + '?filter' + filter);
  // }

  // addPermissions(data: any): Observable<Object> {
  //   return this.http.post(API_ASSIGN_ROL, data);
  // }


}
