import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-certificacion',
  templateUrl: './modal-certificacion.component.html',
  styleUrls: ['./modal-certificacion.component.scss'],
})

export class ModalCertificacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private actasService: ActasService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<ModalCertificacionComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_DET_ACTA: any)
            {};

  ngOnInit(): void {
  this.newForm()
  this.getAllCertificaciones();
  this.getUserID();
  // console.log('DATA_DET_ACTA_CERT', this.DATA_DET_ACTA.detalle);
  // console.log('X-Z', this.DATA_DET_ACTA.detalle.idDetalleCertificacion);
  // console.log('XL', this.DATA_DET_ACTA.detalle.idDetalleActa);
  this.cargarMontoCertificarRestante();

  if (this.DATA_DET_ACTA.detalle.idDetalle > 0) {
    this.cargarDetalleCertificacionById();
    this.getAllEstadosDetActa();
    }
  };

  certificacionForm!: FormGroup;
  newForm(){
    this.certificacionForm = this.fb.group({
     idCertificacion   : ['', Validators.required],
     monto             : ['', Validators.required],
     fechaCertificacion: ['', Validators.required],
     idUsuarioCrea     : [''],
     idEstado          : [''],
    })
  };

  cargarMontoCertificarRestante(){
    this.certificacionForm.reset({
      monto: this.DATA_DET_ACTA.detalle.precioTotal - this.DATA_DET_ACTA.detalle.certificado,
    })
  }

  crearOactualizarDetalleCertificacion(){
    if (this.certificacionForm.invalid) {
      return Object.values(this.certificacionForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_DET_ACTA.detalle.idDetalleCertificacion > 0) {
      console.log('UPDATE');
      this.actualizarDetalleCertificacion();
    } else {
      console.log('CREATE');
      this.crearDetalleCertificacion();
    }
  };

  actualizarDetalleCertificacion(){
    const formValues = this.certificacionForm.getRawValue();

    const requestCert = {
      idDetalleCertificacion : this.DATA_DET_ACTA.detalle.idDetalleCertificacion,
      idDetalle              : this.DATA_DET_ACTA.detalle.idDetalle,
      idCertificacion        : formValues.idCertificacion,
      monto                  : formValues.monto,
      idEstado               : formValues.idEstado,
      fechaCertificacion     : formValues.fechaCertificacion,
      idUsuarioActualiza     : this.userID,
    }
    this.actasService.actualizarDetalleCertificacion(this.DATA_DET_ACTA.detalle.idDetalleCertificacion, requestCert ).subscribe((resp: any) => {
      if (resp.success) {
        Swal.fire({
          title: 'Actualizar detalle certificación!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  };

  crearDetalleCertificacion(){
    const formValues = this.certificacionForm.getRawValue();
    const request = {
      idDetalle         : this.DATA_DET_ACTA.detalle.idDetalleActa,
      idCertificacion   : formValues.idCertificacion,
      monto             : formValues.monto,
      fechaCertificacion: formValues.fechaCertificacion,
      idUsuarioCrea     : this.userID,
    };
    this.actasService.crearDetalleCertificacion(request).subscribe((resp:any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear detalle certificación!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.close(true);
      }
    })
  };

  actionBtn: string = 'Certificar'
  cargarDetalleCertificacionById(): void {
    this.blockUI.start('Cargando detalle certificación ...');

    if (this.DATA_DET_ACTA.detalle.idDetalle > 0) {
      this.actionBtn = 'Actualizar'
      this.actasService.cargarDetalleCertificacionById(this.DATA_DET_ACTA.detalle.idDetalleCertificacion).subscribe((cert:any) => {
        this.blockUI.stop();

        console.log('DET_CERT_BY_ID', cert, );

        this.certificacionForm.reset({
          idCertificacion   : cert.idCertificacion,
          monto             : cert.monto,
          idEstado          : cert.estado,
          fechaCertificacion: moment.utc(cert.fechaCertificacion).format('YYYY-MM-DD'), //2023-12-30
          // fechaCertificacion: this.utilService.generarPeriodo(cert.fechaCertificacion),
        })
        this.certificacionForm.controls['idEstado'].disable();
      })
    }
  };

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.actasService.getAllEstadosDetActa().subscribe(resp => {
      this.listEstadoDetActa = resp;
      console.log('EST_ACTA', this.listEstadoDetActa);
    })
  };

  listCertificaciones: any[] = [];
  getAllCertificaciones(){
    this.liquidacionService.getAllCertificaciones().subscribe(resp => {
      // this.listCertificaciones = resp.filter((x: any) => x.estado.estadoId == 1);
      this.listCertificaciones = resp;
      console.log('CERTIFICACIONES', this.listCertificaciones, this.listCertificaciones.length, resp);
    })
  };

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  };

  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  };

  campoNoValido(campo: string): boolean {
    if (this.certificacionForm.get(campo)?.invalid && this.certificacionForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  };

}

