import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_ACTAS,
  API_ACTAS_EXPORT_DECLARADOS,
  API_ACTAS_EXPORT_FILTRO,
  API_ACTAS_FILTRO,
  API_CERTIFICACION,
  API_CONTAR_ACTAS,
  API_DET_ACTA,
  API_DET_CERTIFICACION,
  API_ESTADOS_DET_ACTA,
  API_GESTOR_SUBS,
  API_IMPORT_ACTAS,
  API_VENTA_DECLARADA,
} from '../constants/url.constants';
import { Observable, map } from 'rxjs';

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ActasService {
  constructor(private http: HttpClient) {}

  // SERVICES ACTAS
  getAllActas(listActas: any) {
    return this.http.post(API_ACTAS_FILTRO, listActas).pipe(
      map((resp: any) => {
        // console.log('SERV-ACTAS', resp);

        return resp.result;
      })
    );
  }

  getActaExportableResume(filtro: any){
    return this.http.post<any>(API_ACTAS_EXPORT_FILTRO, filtro).pipe(
      map( resp => {
        return resp.result
      })
    )
  };

  exportarVentasDeclaradas(){
    return this.http.get<any>(API_ACTAS_EXPORT_DECLARADOS).pipe(
      map( resp => {
        return resp.result
      })
    )
  };

  totalActas(filtro: any): Observable<any> {
    return this.http.post(API_CONTAR_ACTAS, filtro).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  crearActa(requesActa: any): Observable<any> {
    return this.http.post(API_ACTAS, requesActa);
  }

  // SERVICE - ACTA
  actualizarActa(idActa: number, requestActa: any) {
    return this.http.put<any>(`${API_ACTAS}/${idActa}`, requestActa);
  }

  // SERVICE - SUB ACTA
  getActaById(idActa: any): Observable<any> {
    return this.http.get(`${API_ACTAS}${idActa}`).pipe(
      map((resp: any) => {
        // console.log('SERV_DATA_ACTA_BY_ID', resp.result);
        return resp.result;
      })
    );
  }

  eliminarActa(idAActa: number): Observable<any> {
    return this.http.delete<any>(`${API_ACTAS}/${idAActa}`);
  }

  // DETALLE ACTA - OJO CAMBIAR POR SUBACTAS, FALTA API
  crearSubActa(requestDet: any): Observable<any> {
    return this.http.post(API_DET_ACTA, requestDet);
  }

  getDetActaById(idDetActa: number) {
    return this.http.get<any>(`${API_DET_ACTA}/${idDetActa}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  actualizarDetActa(idDetActa: number, reqDetActa: any) {
    return this.http.put(`${API_DET_ACTA}/${idDetActa}`, reqDetActa);
  }

  // SERVICIO ESTADOS DETALLE ACTA
  getAllEstadosDetActa() {
    return this.http.get(`${API_ESTADOS_DET_ACTA}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  crearDetalleActa(requestDet: any): Observable<any> {
    return this.http.post(API_DET_ACTA, requestDet);
  }

  eliminarDetActa(idDetActa: number): Observable<any> {
    return this.http.delete<any>(`${API_DET_ACTA}/${idDetActa}`);
  }

  // DETALLE ACTA - OJO CAMBIAR POR SUBACTAS, FALTA API
  crearVentaDeclarada(requestVD: any): Observable<any> {
    return this.http.post(API_VENTA_DECLARADA, requestVD);
  }

  cargarVentaDeclaradaById(idVD: number) {
    return this.http.get<any>(`${API_VENTA_DECLARADA}/${idVD}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  actualizarVentaDeclarada(idVD: number, reqDetActa: any) {
    return this.http.put(`${API_VENTA_DECLARADA}/${idVD}`, reqDetActa);
  }

  eliminarVentaDeclarado(idVD: number): Observable<any> {
    return this.http.delete<any>(`${API_VENTA_DECLARADA}/${idVD}`);
  }

  // CRUD CERTIFICACION
  actualizarCertificacion(idVD: number, reqCert: any) {
    return this.http.put(`${API_CERTIFICACION}/${idVD}`, reqCert);
  }

  crearCertificacion(requestCert: any) {
    return this.http.post(`${API_CERTIFICACION}`, requestCert);
  }

  cargarCertificacionById(idCert: number) {
    return this.http.get<any>(`${API_CERTIFICACION}/${idCert}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  // CRUD DETALLE ACTA - CERTIFICACION
  crearDetalleCertificacion(requestCert: any) {
    return this.http.post(`${API_DET_CERTIFICACION}`, requestCert);
  }

  cargarDetalleCertificacionById(idCert: number) {
    return this.http.get<any>(`${API_DET_CERTIFICACION}/${idCert}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  actualizarDetalleCertificacion(idCert: number, reqCert: any) {
    return this.http.put(`${API_DET_CERTIFICACION}/${idCert}`, reqCert);
  }

  importarActas(formData: FormData) {
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${API_IMPORT_ACTAS}`, formData, {
      headers: headers,
    });
  };

  // CRUD GESTOR SUBSERIVICIO
  crearGestorSubservicio(requestGestor: any) {
    return this.http.post(`${API_GESTOR_SUBS}`, requestGestor);
  }

  cargarGestorSubservicioById(idGestor: number) {
    return this.http.get<any>(`${API_GESTOR_SUBS}/${idGestor}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  actualizarGestorSubservicio(idGestor: number, reqGestor: any) {
    return this.http.put(`${API_GESTOR_SUBS}/${idGestor}`, reqGestor);
  };

  // EXPORTAR DATA ACTA Y VD
  exportarExcel(json: any[], excelFileName: string){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = {
          Sheets    : {'Actas': ws},
          SheetNames: ['Actas']
    };

    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    // Llammamos al metodo - buffer anf filename
    this.guardarArchExcel(excelBuffer, excelFileName)
  }

  guardarArchExcel(buffer: any, fileName: string){
    const EXCEL_TYPE      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx'

    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_'+ new Date().getTime() + EXCEL_EXTENSION);
    }


}
