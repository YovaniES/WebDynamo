import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-estados',
  templateUrl: './modal-estados.component.html',
  styleUrls: ['./modal-estados.component.scss'],
})
export class ModalEstadosComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalEstadosComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_ESTADO: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getUserID();

  if (this.DATA_ESTADO) {
    this.cargarEstadoActaById();
    console.log('DATA_EST_MODAL', this.DATA_ESTADO);
  }
  }

  estadosForm!: FormGroup;
  newForm(){
    this.estadosForm = this.fb.group({
     estado            : ['', Validators.required],
     descripcion       : [''],
     fecha_creacion    : [''],
     eliminacion_logica: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarEstadoActaById(): void{
    this.blockUI.start("Cargando estado...");
    if (this.DATA_ESTADO) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getEstadoActaById(this.DATA_ESTADO.idEstado).subscribe((estado: any) => {
        console.log('DATA_BY_ID_ESTADO', estado);

        this.blockUI.stop();
        this.estadosForm.reset({
          estado        : estado.nombre,
          descripcion   : estado.descripcion,
          fecha_creacion: moment.utc(estado.fecha_creacion).format('YYYY-MM-DD') ,
          eliminacion_logica: estado.eliminacion_logica
        })
        this.estadosForm.controls['fecha_creacion'].disable();
      })
    }
  }

  crearOactualizarEstado(){
    if (this.estadosForm.invalid) {
      return Object.values(this.estadosForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_ESTADO ) {
        console.log('UPD_JEFA');
        this.actualizarEstado();
    } else {
      console.log('CREAR_JEFA');
      this.crearEstado()
    }
  }

  actualizarEstado(){
    const formValues = this.estadosForm.getRawValue();

    const requestEstado = {
      nombre            : formValues.estado,
      descripcion       : formValues.descripcion,
      idUsuarioActualiza: this.userID
    }

    this.liquidacionService.actualizarEstadoActa(this.DATA_ESTADO.idEstado, requestEstado).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar estado!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  crearEstado(): void{
    const formValues = this.estadosForm.getRawValue();

    const request = {
      nombre           : formValues.estado,
      descripcion      : formValues.descripcion,
      idUsuarioCreacion: this.userID,
    }

    this.liquidacionService.crearEstado(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear estado!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })

        this.close(true);
      }
    })
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

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
    if (this.estadosForm.get(campo)?.invalid && this.estadosForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

