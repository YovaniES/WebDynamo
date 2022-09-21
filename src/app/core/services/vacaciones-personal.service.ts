import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_DYNAMO } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class VacacionesPersonalService {
  constructor(private http: HttpClient) {}

  cargarOBuscarVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  actualizarPlanificacionVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  agregarPeriodoVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  eliminarPeriodoVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  actualizarPersonalVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getListEstadoVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getListMotivosVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getListSistemaVacaciones(id: any) {
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

  crearVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  actualizarVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getHistoricoCambiosEstado(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  eliminarVacaciones(id: any) {
    return this.http.post(API_DYNAMO, id);
  }
}

