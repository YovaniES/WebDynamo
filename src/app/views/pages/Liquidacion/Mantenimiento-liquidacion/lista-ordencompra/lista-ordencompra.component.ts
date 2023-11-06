import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { ModalOrdencompraComponent } from './modal-ordencompra/modal-ordencompra.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-ordencompra',
  templateUrl: './lista-ordencompra.component.html',
  styleUrls: ['./lista-ordencompra.component.scss'],
})
export class ListaOrdencompraComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalOrdencompra: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaOrdencompraComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getListProyectos();
  this.getListGestores();
  }

  ordencompraForm!: FormGroup;
  newForm(){
    this.ordencompraForm = this.fb.group({
     orden_compra : [''],
     certificacion: [''],
     monto        : [''],
     proyecto     : ['']
    })
  }

  listGestores: any[] = [];
  getListGestores(){
    let parametro: any[] = [{queryId: 102}];

    this.facturacionService.getListGestores(parametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            console.log('GESTORES', resp);
    });
  };


  actionBtn: string = 'Crear';

  listaLiquidacion: any[] = [];

  limpiarFiltro(){}
  getAllOrdenCompra(){}

  eliminarLiquidacion(id: number){}

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('COD_PROY', resp.list);
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

    if (this.totalfiltro != this.totalOrdencompra) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listaLiquidacion = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  abrirModalCrearOactualizar(DATA?: any) {
    // console.log('DATA_G', DATA);
    this.dialog
      .open(ModalOrdencompraComponent, { width: '45%', height:'60%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllOrdenCompra();
        }
      });
  }

}

