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
  selector: 'app-modal-lider',
  templateUrl: './modal-lider.component.html',
  styleUrls: ['./modal-lider.component.scss'],
})
export class ModalLiderComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  modecode = '';
  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalLiderComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_LIDER: any
  ) {}

  ngOnInit(): void {
    this.newForm()
    this.getUserID();
    this.getAllProyecto();

    if (this.DATA_LIDER) {
      this.cargarLiderById();
      console.log('DATA_LID_MODAL', this.DATA_LIDER);
      }
  }

  liderForm!: FormGroup;
  newForm(){
    this.liderForm = this.fb.group({
     nombre        : ['', Validators.required],
     apellidos     : ['', Validators.required],
     correo        : [''],
     descripcion   : [''],
     proyectos     : [''],
     id_estado     : [''],
     fecha_creacion: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarLiderById(): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_LIDER) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getLiderById(this.DATA_LIDER.idLider).subscribe((lider: any) => {
        // console.log('DATA_BY_ID_lider', lider, lider.proyectos[0].idProyecto);

        this.blockUI.stop();
        this.liderForm.reset({
          nombre        : lider.nombre,
          apellidos     : lider.apellidos,
          correo        : lider.correo,
          descripcion   : lider.descripcion,
          proyectos     : lider.proyectos,
          id_estado     : lider.estado.estadoId,
          fecha_creacion: moment.utc(lider.fecha_creacion).format('YYYY-MM-DD'),
        })
        this.liderForm.controls['proyectos'     ].disable();
        this.liderForm.controls['fecha_creacion'].disable();
      })
    }
  }

  crearOactualizarLider(){
    if (this.liderForm.invalid) {
      return Object.values(this.liderForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_LIDER ) {
        console.log('UPD_LIDER');
        this.actualizarLider();
    } else {
      console.log('CREAR_LIDER');
      this.crearLider()
    }
  }

  actualizarLider(){
    const formValues = this.liderForm.getRawValue();

    const requestLider = {
        nombre             : formValues.nombre,
        apellidos          : formValues.apellidos,
        correo             : formValues.correo,
        descripcion        : formValues.descripcion,
        idUsuarioActualiza : this.userID,
        isActive           : formValues.id_estado
    }

    this.liquidacionService.actualizarLider(this.DATA_LIDER.idLider, requestLider).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar líder!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
        this.close(true);
      }
    })
  }

  crearLider(): void{
    const formValues = this.liderForm.getRawValue();

    const request = {
      nombre           : formValues.nombre,
      apellidos        : formValues.apellidos,
      correo           : formValues.correo,
      descripcion      : formValues.descripcion,
      idUsuarioCreacion: this.userID,
    }

    this.liquidacionService.crearLider(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear líder!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY-S', this.listProyectos);
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
    if (this.liderForm.get(campo)?.invalid && this.liderForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

