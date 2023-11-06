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
    this.cargarLiderById(this.DATA_LIDER);
    console.log('DATA_LID_MODAL', this.DATA_LIDER);
  }
  }

  liderForm!: FormGroup;
  newForm(){
    this.liderForm = this.fb.group({
     nombre        : ['', Validators.required],
     apellidos     : ['', Validators.required],
     correo        : ['',],
    //  proyecto      : ['', Validators.required],
     descripcion   : ['',],
     id_estado     : [''],
     fecha_creacion: ['']
    })
  }

  // idLider": 879,
  //       "nombre_apellidos": "Johan Torres",
  //       "correo": "jtorres@indracompany.com",
  //       "descripcion": "no tiene ",
  //       "fecha_creacion": "2023-10-31T18:42:19",
  //       "eliminacion_logica": 1

  actionBtn: string = 'Crear';
  cargarLiderById(idLider: number): void{
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
          id_estado     : lider.eliminacion_logica,
          fecha_creacion: moment.utc(lider.fecha_creacion).format('YYYY-MM-DD'),
        })
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
      idCertificacion : this.DATA_LIDER.idCertificacion,
      idFactura       : this.DATA_LIDER.idFactura,
      idEstado        : this.DATA_LIDER.eliminacion_logica,
      descripcion     : formValues.descripcion,
      usuario         : this.userID
    }

    this.liquidacionService.actualizarLider(this.DATA_LIDER.idCertificacion, requestLider).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar gestor!',
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
      nombre        : formValues.nombre,
      apellidos     : formValues.apellidos,
      correo        : formValues.correo,
      fechaInicio   : formValues.fecha_ini,
      fechaFin      : formValues.fecha_fin,
      idUsuarioCrea : this.userID,
    }

    this.liquidacionService.crearLider(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear gestor!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })

        this.close(true);
      }
    })
  }

  // listLideres: any[] = [];
  // getAllLider(){
  //   this.liquidacionService.getAllLideres().subscribe((resp: any) => {
  //     this.listLideres = resp
  //     console.log('LIST-LIDER', this.listLideres);
  //   })
  // }

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
    if (this.liderForm.get(campo)?.invalid && this.liderForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

