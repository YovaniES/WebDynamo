import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/models/menu.models';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-gestor',
  templateUrl: './modal-gestor.component.html',
  styleUrls: ['./modal-gestor.component.scss'],
})
export class ModalGestorComponent implements OnInit {
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
               public dialogRef: MatDialogRef<ModalGestorComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_GESTOR: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getListProyectos();
  this.getListGestores();

  if (this.DATA_GESTOR) {
    this.cargarGestorById(this.DATA_GESTOR);
  }
  }

  gestorForm!: FormGroup;
  newForm(){
    this.gestorForm = this.fb.group({
     nombre        : ['',],
     apell_pat     : ['',],
     apell_mat     : ['',],
     correo        : ['',],
     fecha_ini     : ['',],
     fecha_fin     : ['',],
     proyectos     : ['',],
     subservicios  : ['',],
     id_estado     : [''],
     fecha_creacion: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarGestorById(idGestor: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_GESTOR) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getGestorById(this.DATA_GESTOR.idGestor).subscribe((gestor: any) => {
        console.log('DATA_BY_ID_GESTOR', gestor);

        this.blockUI.stop();
        this.gestorForm.reset({
          nombre        : gestor.nombres,
          apell_pat     : gestor.apellidos,
          apell_mat     : gestor.apellidos,
          correo        : gestor.correo,
          fecha_ini     : moment.utc(gestor.fecha_inicio).format('YYYY-MM-DD'),
          fecha_fin     : moment.utc(gestor.fecha_fin).format('YYYY-MM-DD'),
          proyectos     : gestor.proyectos,
          subservicios  : gestor.subservicios,
          id_estado     : gestor.estado,
          fecha_creacion: moment.utc(gestor.fecha_facturacion).format('YYYY-MM-DD'),
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
            this.listGestores = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
}

