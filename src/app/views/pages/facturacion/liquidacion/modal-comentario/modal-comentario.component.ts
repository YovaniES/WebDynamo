import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturaService } from 'src/app/core/services/factura.service';

@Component({
    selector: 'app-modal-comentario',
    templateUrl: './modal-comentario.component.html',
    styleUrls: ['./modal-comentario.component.scss'],
})
export class ModalComentarioComponent implements OnInit {
  loadingItem: boolean = false;

  constructor(
    private facturaService: FacturaService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public ID_FACTURA: any
  ) {
  }

  ngOnInit(): void {
    // this.listaComentarioByID();
    console.log('ID_FACTURA', this.ID_FACTURA);

  }

  gestorReg: string = '';
  proyectoReg: string = '';
  listcomentario: any[] = [];
  // listaComentarioByID(){
  //   this.spinner.show();

  //   let parametro:any[] = [{
  //     "queryId": 153,
  //     "MapValue": {
  //       "p_idFactura": this.ID_FACTURA
  //     }
  //   }];
  //   this.facturaService.listaComentarioByID(parametro[0]).subscribe((resp: any) => {
  //     this.listcomentario = resp.list;
  //     this.gestorReg = resp.list[0].gestor;
  //     this.proyectoReg = resp.list[0].proyecto;
  //     // this.idFactura = resp.list[0].idFactura;

  //    console.log("comentario_regularizacion", resp.list);
  //   //  console.log("comentario_title", this.idFactura);
  //     this.spinner.hide();
  //   });
  // }
}
