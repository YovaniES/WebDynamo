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


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

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
     fecha_creacion: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarJefaturaById(): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_JEFATURA) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getJefaturaById(this.DATA_JEFATURA.idJefatura).subscribe((jef: any) => {
        console.log('DATA_BY_ID_JEFATURA', jef);

        this.blockUI.stop();
        this.jefaturaForm.reset({
          jefatura      : jef.Jefatura,
          descripcion   : jef.descripcion,
          estado        : jef.eliminacion_logica,
          fecha_creacion: moment.utc(jef.fecha_creacion).format('YYYY-MM-DD'),
          // usuarioActualiza
        })
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
      idCertificacion : this.DATA_JEFATURA.idCertificacion,
      idFactura       : this.DATA_JEFATURA.idFactura,
      idEstado        : this.DATA_JEFATURA.eliminacion_logica,
      descripcion     : formValues.descripcion,
      usuario         : this.userID
    }

    this.liquidacionService.actualizarJefatura(this.DATA_JEFATURA.idCertificacion, requestJefatura).subscribe((resp: any) => {
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
      nombres    : formValues.nombre,
      apellidos  : formValues.apell_pat,
      correo     : formValues.correo,
      fechaInicio: formValues.fecha_ini,
      fechaFin   : formValues.fecha_fin,
      gestorSubservicio:[
        {
          idSubservicio: formValues.subservicios,
          idProyecto   : formValues.proyectos,
        }
      ],
      idUsuarioCrea  : this.userID,
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

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
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

  eliminarLiquidacion(id: number){}
  // actualizarFactura(data: any){}

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

