import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/models/menu.models';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
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
     nombre      : ['',],
     apell_pat   : ['',],
     apell_mat   : ['',],
     correo      : ['',],
     fecha_ini   : ['',],
     fecha_fin   : ['',],
     proyectos   : ['',],
     subservicios: ['',],
     id_estado   : ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarGestorById(idGestor: number): void{
    // this.blockUI.start("Cargando data...");
    if (this.DATA_GESTOR) {
      this.actionBtn = 'Actualizar'
      this.facturacionService.getLiquidacionById(idGestor).subscribe((resp: any) => {
        console.log('DATA_BY_ID_GESTOR', resp);

        this.gestorForm.reset({
          nombre      : resp.nombre,
          apell_pat   : resp.apell_pat,
          apell_mat   : resp.apell_mat,
          correo      : resp.correo,
          fecha_ini   : resp.fecha_ini,
          fecha_fin   : resp.fecha_fin,
          proyectos   : resp.proyectos,
          subservicios: resp.subservicios,
          id_estado   : resp.id_estado,
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

