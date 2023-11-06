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

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalGestorComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_GESTOR: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getUserID();
  this.getAllProyecto();
  this.getAllSubservicios();

  if (this.DATA_GESTOR) {
    this.cargarGestorById(this.DATA_GESTOR);
    console.log('DATA_G_MODAL', this.DATA_GESTOR);
  }
  }

  gestorForm!: FormGroup;
  newForm(){
    this.gestorForm = this.fb.group({
     nombre        : ['', Validators.required],
     apellidos     : ['', Validators.required],
     correo        : [''],
     fecha_ini     : [''],
     fecha_fin     : [''],
     proyectos     : [''],
     subservicios  : [''],
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
        // console.log('DATA_BY_ID_GESTOR', gestor, gestor.proyectos[0].idProyecto);

        this.blockUI.stop();
        this.gestorForm.reset({
          nombre        : gestor.nombres,
          apellidos     : gestor.apellidos,
          correo        : gestor.correo,
          fecha_ini     : moment.utc(gestor.fecha_inicio).format('YYYY-MM-DD'),
          fecha_fin     : moment.utc(gestor.fecha_fin).format('YYYY-MM-DD'),
          proyectos     : gestor.proyectos[0].idProyecto,
          subservicios  : gestor.subservicios[0].idSubservicio,
          id_estado     : gestor.estado,
          fecha_creacion: moment.utc(gestor.fechaCreacion).format('YYYY-MM-DD'),
        })
      })
    }
  }

  crearOactualizarGestor(){
    if (this.gestorForm.invalid) {
      return Object.values(this.gestorForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_GESTOR ) {
        console.log('UPD_GESTOR');
        this.actualizarGestor();
    } else {
      console.log('CREAR_SUBS');
      this.crearGestor()
    }
  }

  actualizarGestor(){
    const formValues = this.gestorForm.getRawValue();

    const requestGestor = {
      idCertificacion : this.DATA_GESTOR.idCertificacion,
      idFactura       : this.DATA_GESTOR.idFactura,
      fechaFacturacion: formValues.fechaFact,
      importe         : formValues.importe,
      orden_compra    : formValues.ordenCompra,
      certificacion   : formValues.certificacion,
      idEstado        : 663,
      factura         : formValues.factura,
      comentario      : formValues.comentario,
      usuario         : this.userID
    }

    this.liquidacionService.actualizarGestor(this.DATA_GESTOR.idCertificacion, requestGestor).subscribe((resp: any) => {
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

  crearGestor(): void{
    const formValues = this.gestorForm.getRawValue();

    const request = {
      nombres    : formValues.nombre,
      apellidos  : formValues.apellidos,
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

    this.liquidacionService.crearGestor(request).subscribe((resp: any) => {
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

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  eliminarLiquidacion(id: number){}
  // actualizarFactura(data: any){}

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);

    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    // const request = this.gestorForm.value;
    const request = {
      idGestor     : '',
      idProyecto   : '',
      idSubservicio: this.gestorForm.controls['subservicios'].value,
    }

    this.liquidacionService.getAllSubservicios(request).subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      console.log('SUBS', this.listSubservicios);
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
    if (this.gestorForm.get(campo)?.invalid && this.gestorForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

