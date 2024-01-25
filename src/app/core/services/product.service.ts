import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ProductModel } from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  private API_PRODUCT: string = 'http://localhost:8080/product/';

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.API_PRODUCT}/GetProductById/${id}`).pipe(
      map((resp: any) => {
        console.log('DATA_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  createProduct(product: ProductModel[]): Observable<any> {
    return this.http.post(this.API_PRODUCT, product);
  }

  updateProduct(id: number, requestProduct: any) {
    return this.http.put<any>(`${this.API_PRODUCT}/${id}`, requestProduct);
  }

  getAllCategories() {
    return this.http.get(`${this.API_PRODUCT}/categories`);
  }

  deleteProduct(idProduct: number): Observable<any> {
    return this.http.delete<any>(`${this.API_PRODUCT}/${idProduct}`);
  }

  getAllStates() {
    return this.http.get(`${this.API_PRODUCT}/state`);
  }

  getAllProducts(listActas: any) {
    return this.http.post(this.API_PRODUCT, listActas).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  // EXPORTAR DATA PRODUCT
  exportarExcel(json: any[], excelFileName: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = {
      Sheets: { Actas: ws },
      SheetNames: ['Actas'],
    };

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.guardarArchExcel(excelBuffer, excelFileName);
  }

  guardarArchExcel(buffer: any, fileName: string) {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
