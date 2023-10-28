import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { ModalSubservicioComponent } from './modal-subservicio/modal-subservicio.component';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-lista-subservicio',
  templateUrl: './lista-subservicio.component.html',
  styleUrls: ['./lista-subservicio.component.scss'],
})
export class ListaSubservicioComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 5;

  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               private dialog: MatDialog,
               public dialogRef: MatDialogRef<ListaSubservicioComponent>,
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getListProyectos();
  this.getListGestores();
  this.getAllSubservicios()
  }

  gestorForm!: FormGroup;
  newForm(){
    this.gestorForm = this.fb.group({
     nombre_apell: [''],
     subservicios: [''],
     proyectos   : ['']
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

  listSubservicios: any[] = [];
  getAllSubservicios(){
    this.liquidacionService.getAllSubservicios().subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      console.log('DATA_SUBSERV', this.listSubservicios);

    })
  }


  actionBtn: string = 'Crear';

  listaLiquidacion: any[] = [];

  limpiarFiltro(){}
  getAllGestor(){}

  eliminarLiquidacion(id: number){}
  // actualizarFactura(data: any){}

  save() {
    this.blockUI.start('Guardando...');
    // MÓDULOS
    // if (this.data.ismodule) {
    //   this.menu.module = this.data.isnew ? 'ADD' : 'EDT';
    //   const sub: Subscription = this.permissionService
    //     .postModule(this.menu)
    //     .subscribe((resp: any) => {
    //       this.blockUI.stop();
    //       if (resp.status) this.dialogRef.close(this.menu);
    //       else this.showAlertError(resp.message);
    //       sub.unsubscribe();
    //     });

    //   // MENÚS
    // } else {
    //   this.menu.module = this.modecode;
    //   const sub: Subscription = this.permissionService
    //     .postMenu(this.menu)
    //     .subscribe((resp: any) => {
    //       this.blockUI.stop();
    //       if (resp.status) this.dialogRef.close(this.menu);
    //       else this.showAlertError(resp.message);
    //       sub.unsubscribe();
    //     });
    // }
  }


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
    if (this.gestorForm.get(campo)?.invalid && this.gestorForm.get(campo)?.touched ) {
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
      .open(ModalSubservicioComponent, { width: '45%', height:'45%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllGestor();
        }
      });
  }

}

