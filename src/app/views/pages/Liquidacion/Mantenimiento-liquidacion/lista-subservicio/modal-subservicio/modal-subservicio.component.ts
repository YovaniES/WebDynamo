import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
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
               private authService: AuthService,
               private spinner: NgxSpinnerService,
               public dialogRef: MatDialogRef<ModalSubservicioComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_SUBSERV: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllGestor();

  if (this.DATA_SUBSERV) {
    this.cargarSubservicioById(this.DATA_SUBSERV);
    // console.log('MODAL-SUBSERV', this.DATA_SUBSERV);
    }
  }

  subservicioForm!: FormGroup;
  newForm(){
    this.subservicioForm = this.fb.group({
     subservicio   : ['', Validators.required],
     gestor        : ['', Validators.required],
     proyecto      : ['', Validators.required],
     fecha_creacion: [''],
     fecha_ini     : [''],
     fecha_fin     : [''],
     id_estado     : ['']
    })
  }

  crearOactualizarSubservicio(){
    if (this.subservicioForm.invalid) {
      return Object.values(this.subservicioForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_SUBSERV ) {
        console.log('UPD_SUBS');
        this.actualizarSubservicio();
    } else {
      console.log('CREAR_SUBS');
      this.crearSubservicio()
    }
  }

  crearSubservicio(): void{
    const formValues = this.subservicioForm.getRawValue();

    const request = {
      idProyecto    : formValues.proyecto,
      nombre        : formValues.subservicio,
      representante : formValues.gestor,
      idUsuarioCrea : this.userID,
      fechaInicio   : formValues.fecha_ini,
      fechaFin      : formValues.fecha_fin,
    }

    this.liquidacionService.crearSubservicio(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear subservicio!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
  }


  actualizarSubservicio(){}

  actionBtn: string = 'Crear';
  cargarSubservicioById(idGestor: number): void{
    this.blockUI.start("Cargando Subservicio...");
    if (this.DATA_SUBSERV) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getSubserviciosById(this.DATA_SUBSERV.idSubservicio).subscribe((subserv: any) => {
        console.log('DATA_BY_ID_SUBSERV', subserv);
        this.blockUI.stop();

        this.subservicioForm.reset({
          subservicio   : subserv.subservicio,
          gestor        : subserv.representante,
          fecha_ini     : subserv.fechaInicio,
          fecha_creacion: moment.utc(subserv.fechaCreacion).format('YYYY-MM-DD'),
          fecha_fin     : subserv.fechaFin,
          proyecto      : subserv.idProyecto,
          id_estado     : subserv.estado,
        })
      })
    }
  }

  eliminarLiquidacion(id: number){}
  // actualizarFactura(data: any){}

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  listGestores: any[] = [];
  getAllGestor(){
    this.liquidacionService.getAllGestor().subscribe( (resp: any) => {
      this.listGestores = resp
      // console.log('LIST-GESTOR', this.listGestores);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyecto().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY-S', this.listProyectos);
    })
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

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}

