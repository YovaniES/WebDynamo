import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-subservicio',
  templateUrl: './modal-subservicio.component.html',
  styleUrls: ['./modal-subservicio.component.scss'],
})
export class ModalSubservicioComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  modecode = '';
  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               public dialogRef: MatDialogRef<ModalSubservicioComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_SUBSERV: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getListProyectos();
  this.getListGestores();

  if (this.DATA_SUBSERV) {
    this.cargarSubservicioById(this.DATA_SUBSERV);
    console.log('MODAL-SUBSERV', this.DATA_SUBSERV);

  }
  }

  subservicioForm!: FormGroup;
  newForm(){
    this.subservicioForm = this.fb.group({
     subservicio: ['',],
     gestor     : ['',],
     fecha_ini  : ['',],
     fecha_fin  : ['',],
     proyecto   : ['',],
     id_estado  : ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarSubservicioById(idGestor: number): void{
    this.blockUI.start("Cargando Subservicio...");
    if (this.DATA_SUBSERV) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getSubserviciosById(this.DATA_SUBSERV.idSubservicio).subscribe((subserv: any) => {
        console.log('DATA_BY_ID_SUBSERV', subserv);
        this.blockUI.stop();

        this.subservicioForm.reset({
          subservicio: subserv.subservicio,
          gestor     : subserv.representante,
          fecha_ini  : subserv.fechaCreacion,
          fecha_fin  : subserv.fecha_fin,
          proyecto   : subserv.proyecto,
          id_estado  : subserv.estado,
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
  // actualizarFactura(data: any){}

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
    if (this.subservicioForm.get(campo)?.invalid && this.subservicioForm.get(campo)?.touched ) {
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

