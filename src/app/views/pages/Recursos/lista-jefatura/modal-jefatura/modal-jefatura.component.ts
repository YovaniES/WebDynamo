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
  selector: 'app-modal-jefatura',
  templateUrl: './modal-jefatura.component.html',
  styleUrls: ['./modal-jefatura.component.scss'],
})
export class ModalJefaturaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalJefaturaComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_JEFATURA: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getUserID();
  this.getAllProyecto();

  if (this.DATA_JEFATURA) {
    this.cargarJefaturaById();
    console.log('DATA_JEFAT_MODAL', this.DATA_JEFATURA);
  }
  }

  jefaturaForm!: FormGroup;
  newForm(){
    this.jefaturaForm = this.fb.group({
     jefatura      : ['', Validators.required],
     descripcion   : [''],
     estado        : [''],
     proyecto      : [''],
     fecha_creacion: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarJefaturaById(): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_JEFATURA.idJefatura > 0) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getJefaturaById(this.DATA_JEFATURA.idJefatura).subscribe((jef: any) => {
        // console.log('DATA_BY_ID_JEFATURA', jef);

        this.blockUI.stop();
        this.jefaturaForm.reset({
          jefatura      : jef.nombre,
          descripcion   : jef.descripcion,
          proyecto      : jef.proyectos,
          estado        : jef.estado.estadoId,
          fecha_creacion: moment.utc(jef.fecha_creacion).format('YYYY-MM-DD'),
        })

        this.jefaturaForm.controls['proyecto'      ].disable();
        this.jefaturaForm.controls['fecha_creacion'].disable();
      })
    }
  }

  crearOactualizarJefatura(){
    if (this.jefaturaForm.invalid) {
      return Object.values(this.jefaturaForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_JEFATURA ) {
        console.log('UPD_JEFA');
        this.actualizarJefatura();
    } else {
      console.log('CREAR_JEFA');
      this.crearJefatura()
    }
  }

  actualizarJefatura(){
    const formValues = this.jefaturaForm.getRawValue();

    const requestJefatura = {
      nombre            : formValues.jefatura,
      descripcion       : formValues.descripcion,
      idUsuarioActualiza: this.userID,
      isActive          : formValues.estado,
    }

    this.liquidacionService.actualizarJefatura(this.DATA_JEFATURA.idJefatura, requestJefatura).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar jefatura!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  crearJefatura(): void{
    const formValues = this.jefaturaForm.getRawValue();

    const request = {
      nombre       : formValues.jefatura,
      descripcion  : formValues.descripcion,
      idUsuarioCrea: this.userID,
    }

    this.liquidacionService.crearJefatura(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear jefatura!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })

        this.close(true);
      }
    })
  }

  listProyectosCombo: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectosCombo = resp;
      console.log('PROY-COMBO', this.listProyectosCombo);
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
    if (this.jefaturaForm.get(campo)?.invalid && this.jefaturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

