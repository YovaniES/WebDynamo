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
  selector: 'app-certificacion-masiva',
  templateUrl: './certificacion-masiva.component.html',
  styleUrls: ['./certificacion-masiva.component.scss'],
})

export class CertificacionMasivaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private actasService: ActasService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<CertificacionMasivaComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_DET_ACTA: any)
            {};

  ngOnInit(): void {
  this.newForm()
  this.getAllCertificacionCombo();
  this.getUserID();
  // this.cargarMontoCertificarRestante();

  if (this.DATA_DET_ACTA > 0) {
    this.cargarDetalleCertificacionById();
    this.getAllEstadosDetActa();
    }
  };

  certificacionForm!: FormGroup;
  newForm(){
    this.certificacionForm = this.fb.group({
    //  idCertificacion   : ['', Validators.required],
     fechaCertificacion   : ['', Validators.required],
     selectIdCertificacion: ['', Validators.required],
    })
  };

  submit() {
    const idCert = this.certificacionForm.controls['selectIdCertificacion'].value
    console.log('Valores seleccionados:',     JSON.stringify(idCert));
    // JSON.stringify(idCert)
    // Aquí puedes enviar los datos a un servidor o manejarlos como necesites
  }


  cargarMontoCertificarRestante(){
    this.certificacionForm.reset({
      monto: this.DATA_DET_ACTA.detalle.precioTotal - this.DATA_DET_ACTA.detalle.certificado,
    })
  }

  crearOactualizarCertificacionMasiva(){
    if (this.certificacionForm.invalid) {
      return Object.values(this.certificacionForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_DET_ACTA > 0) {
      console.log('UPDATE');
      // this.actualizarCertificacionMasiva();
    } else {
      console.log('CREATE');
      this.crearCertificacionMasiva();
    }
  };

  crearCertificacionMasiva(){
    const formValues = this.certificacionForm.getRawValue();
    const idCert = this.certificacionForm.controls['selectIdCertificacion'].value
    console.log('ID_CERT_SELECT:', JSON.stringify(idCert));

    const request = {
      idActa            : this.DATA_DET_ACTA.idActa,
      idCertificacions  : idCert,
      fechaCertificacion: formValues.fechaCertificacion,
      idUsuarioActualiza: this.userID,
    };
    this.liquidacionService.certificacionMasiva(request).subscribe((resp:any) => {
      console.log('REQUEST', request, resp);

      if (resp.success) {
        Swal.fire({
          title: 'Certificación masiva!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.close(true);
      }else{
        Swal.fire({
          title: 'CUIDADO.!',
          text: `${resp.message}`,
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
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
  getAllCertificacionCombo(){
    this.liquidacionService.getAllCertificacionCombo().subscribe(resp => {
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

