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
  selector: 'app-modal-facturas',
  templateUrl: './modal-facturas.component.html',
  styleUrls: ['./modal-facturas.component.scss'],
})
export class ModalFacturasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalFacturasComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_FACTURA: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getUserID();
  this.getAllProyecto();

  if (this.DATA_FACTURA) {
    this.cargarFacturaById(this.DATA_FACTURA);
    console.log('FACTURA_MODAL', this.DATA_FACTURA);
  }
  }

  facturaForm!: FormGroup;
  newForm(){
    this.facturaForm = this.fb.group({
     nombre        : ['', Validators.required],
     apellidos     : ['', Validators.required],
     correo        : ['',],
     proyecto      : ['', Validators.required],
     descripcion   : ['',],
     id_estado     : [''],
     fecha_creacion: ['']
    })
  }

  actionBtn: string = 'Crear';
  cargarFacturaById(idLider: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_FACTURA) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getLiderById(this.DATA_FACTURA.idFactura).subscribe((lider: any) => {

        this.blockUI.stop();
        this.facturaForm.reset({
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

  crearOactualizarFactura(){
    if (this.facturaForm.invalid) {
      return Object.values(this.facturaForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_FACTURA ) {
        this.actualizarFactura();
    } else {
      this.crearFactura()
    }
  }

  actualizarFactura(){
    const formValues = this.facturaForm.getRawValue();

    const requestLider = {
      idCertificacion : this.DATA_FACTURA.idCertificacion,
      idFactura       : this.DATA_FACTURA.idFactura,
      idEstado        : this.DATA_FACTURA.eliminacion_logica,
      descripcion     : formValues.descripcion,
      usuario         : this.userID
    }

    this.liquidacionService.actualizarFactura(this.DATA_FACTURA.idCertificacion, requestLider).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar factura!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  crearFactura(): void{
    const formValues = this.facturaForm.getRawValue();

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

    this.liquidacionService.crearFactura(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear factura!',
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
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

