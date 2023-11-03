import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-ordencompra',
  templateUrl: './modal-ordencompra.component.html',
  styleUrls: ['./modal-ordencompra.component.scss'],
})
export class ModalOrdencompraComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private spinner: NgxSpinnerService,
               public dialogRef: MatDialogRef<ModalOrdencompraComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_ORDENCOMPRA: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getListProyectos();
  this.getListGestores();

  if (this.DATA_ORDENCOMPRA) {
    this.cargarGestorById(this.DATA_ORDENCOMPRA);
  }
  }

  ordencompraForm!: FormGroup;
  newForm(){
    this.ordencompraForm = this.fb.group({
     orden_compra : ['',],
     monto        : ['',],
     certificacion: ['',],
    })
  }

  actionBtn: string = 'Crear';
  cargarGestorById(idGestor: number): void{
    // this.blockUI.start("Cargando data...");
    if (this.DATA_ORDENCOMPRA) {
      this.actionBtn = 'Actualizar'
      this.facturacionService.getLiquidacionById(idGestor).subscribe((resp: any) => {
        console.log('DATA_BY_ID_OC', resp);

        this.ordencompraForm.reset({
          orden_compra : resp.orden_compra,
          monto        : resp.monto,
          certificacion: resp.certificacion,
        })
      })
    }
  }

  listGestores: any[] = [];
  getListGestores(){
    let parametro: any[] = [{queryId: 102}];

    this.facturacionService.getListGestores(parametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            console.log('GESTORES', resp);
    });
  };

  limpiarFiltro(){}
  getAllGestor(){}

  eliminarLiquidacion(id: number){}

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            console.log('COD_PROY', resp.list);
    });
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }


  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.ordencompraForm.get(campo)?.invalid && this.ordencompraForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listGestores = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
}

