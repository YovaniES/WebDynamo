import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_DYNAMO } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class VacacionesPersonalService {
  constructor(private http: HttpClient) {}

  eliminarEntidad(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  crearEntidadLista(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  actualizarTablaEntidad(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  agregarEntidadTabla(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListEntidades(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  actualizarVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  agregarPeriodoVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  eliminarVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  actualizarPersonalVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getLstEstadoVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getLstMotivosVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getLstSistemaVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }


  getListAdminVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  cargarVacacionesAsignado(id: any) {
    return this.http.post(API_DYNAMO, id);
  }


  cargarOBuscarPersonalActivo(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  asignarPersonal(id: any) {
    return this.http.post(API_DYNAMO, id);
  }
}

