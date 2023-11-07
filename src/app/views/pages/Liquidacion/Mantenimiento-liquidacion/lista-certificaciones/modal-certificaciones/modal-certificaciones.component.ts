import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-modal-certificaciones',
  templateUrl: './modal-certificaciones.component.html',
  styleUrls: ['./modal-certificaciones.component.scss'],
})
export class ModalCertificacionesComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private authService: AuthService,
               public dialogRef: MatDialogRef<ModalCertificacionesComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_CERTIF: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllGestor();
  this.getUserID();

  if (this.DATA_CERTIF) {
    this.cargarSubservicioById(this.DATA_CERTIF);
    // console.log('MODAL-SUBSERV', this.DATA_CERTIF);
    }
  }

  subservicioForm!: FormGroup;
  newForm(){
    this.subservicioForm = this.fb.group({
    certificacion : ['', Validators.required],
    monto         : ['', Validators.required],
    moneda        : [''],
    proyecto      : ['', Validators.required],
    ordenCompra   : ['', Validators.required],
    fecha_creacion: [''],
    estado        : ['']
    })
  }

  crearOactualizarSubservicio(){
    if (this.subservicioForm.invalid) {
      return Object.values(this.subservicioForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_CERTIF ) {
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
      idProyecto      : formValues.proyecto,
      nombre          : formValues.subservicio,
      idRepresentante : formValues.gestor,
      idUsuarioCrea   : this.userID,
      fechaInicio     : formValues.fecha_ini,
      fechaFin        : formValues.fecha_fin,
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

  actualizarSubservicio(){
    const formValues = this.subservicioForm.getRawValue();

    const requestSubservicio = {
      idProyecto   : formValues.proyecto,
      nombre       : formValues.subservicio,
      representante: formValues.gestor,
      idUsuarioCrea: this.userID,
      fechaInicio  : formValues.fecha_ini,
      fechaFin     : formValues.fecha_fin,
    }
    this.liquidacionService.actualizarSubservicio(this.DATA_CERTIF.idSubservicio, requestSubservicio).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar subservicio!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  actionBtn: string = 'Crear';
  cargarSubservicioById(idGestor: number): void{
    this.blockUI.start("Cargando Subservicio...");
    if (this.DATA_CERTIF) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getSubserviciosById(this.DATA_CERTIF.idSubservicio).subscribe((subserv: any) => {
        console.log('DATA_BY_ID_SUBSERV', subserv);
        this.blockUI.stop();

        this.subservicioForm.reset({
          subservicio   : subserv.subservicio,
          gestor        : subserv.representante.idGestor,
          fecha_ini     : subserv.fechaInicio,
          fecha_creacion: moment.utc(subserv.fechaCreacion).format('YYYY-MM-DD'),
          fecha_fin     : subserv.fechaFin,
          proyecto      : subserv.idProyecto,
          id_estado     : subserv.estado,
        })
      })
    }
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  }

  listGestores: any[] = [];
  getAllGestor(){
    // const idGestor = this.subservicioForm.controls['gestor'].value;
    console.log('id_Gestor', this.subservicioForm.controls['gestor'].value );

    const request = {
      idGestor   : this.subservicioForm.controls['gestor'].value,
      proyecto   : '',
      subservicio: '',
      estado     : ''
    }
    this.liquidacionService.getAllGestor(request).subscribe( (resp: any) => {
      this.listGestores = resp
      // console.log('LIST-GESTOR', this.listGestores);
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
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

