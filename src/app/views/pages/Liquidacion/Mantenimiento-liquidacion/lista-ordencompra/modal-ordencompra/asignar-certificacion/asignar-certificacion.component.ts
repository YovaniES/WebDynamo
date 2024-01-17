import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-certificacion',
  templateUrl: './asignar-certificacion.component.html',
  styleUrls: ['./asignar-certificacion.component.scss'],
})
export class AsignarCertificacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private authService: AuthService,
               public dialogRef: MatDialogRef<AsignarCertificacionComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_CERTIF: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllOrdenCombo();
  this.getUserID();
  console.log('MODAL-CERT', this.DATA_CERTIF);
  this.cargarOrdenById();

  if (this.DATA_CERTIF.idCertificacion > 0) {
    this.cargarCertificacionById();
    }
  }

  certificacionForm!: FormGroup;
  newForm(){
    this.certificacionForm = this.fb.group({
        nro_certificacion : ['', Validators.required],
        monto_total       : ['', Validators.required],
        idProyecto        : ['', Validators.required],
        idOrden           : ['', Validators.required],
        isActive          : [''],
    })
  }

  cargarOrdenById(){
    this.certificacionForm.reset({idOrden: this.DATA_CERTIF.idOrden});
    this.certificacionForm.controls['idOrden'].disable();
  };

  crearOactualizarCertificacion(){
    if (this.certificacionForm.invalid) {
      return Object.values(this.certificacionForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_CERTIF.idOrden > 0 ) {
      console.log('CREATE');
      this.asignarCertificacion()
    } else {
      console.log('UPDATE');
      this.actualizarCertificacion();
    }
  }

  asignarCertificacion(): void{
    const formValues = this.certificacionForm.getRawValue();

    const request = {
      nro_certificacion : formValues.nro_certificacion,
      valor             : formValues.monto_total,
      idOrden           : formValues.idOrden,
      idProyecto        : formValues.idProyecto,
      idUsuarioCreacion : this.userID,
    }

    this.liquidacionService.crearCertificacion(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Asignar certificación!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
  }

  actualizarCertificacion(){
    const formValues = this.certificacionForm.getRawValue();

    const requestCertificacion = {
      nro_certificacion  : formValues.nro_certificacion,
      valor              : formValues.monto_total,
      idOrden            : formValues.idOrden,
      idProyecto         : formValues.idProyecto,
      isActive           : formValues.isActive,
      idUsuarioActualiza : this.userID,
    }
    this.liquidacionService.actualizarCertificacion(this.DATA_CERTIF.idCertificacion, requestCertificacion).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar certificación!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  actionBtn: string = 'Asignar';
  cargarCertificacionById(): void{
    // this.blockUI.start("Cargando Certificación...");
    if (this.DATA_CERTIF.idCertificacion > 0) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getCertificacionById(this.DATA_CERTIF.idCertificacion).subscribe((cert: any) => {
        console.log('DATA_BY_ID_CERTIF', cert);
        this.blockUI.stop();

        this.certificacionForm.reset({
          idCertificacion  : this.DATA_CERTIF.idCertificacion,
          nro_certificacion: cert.nro_certificacion,
          monto_total      : cert.valorTotal,
          moneda           : cert.moneda,
          idOrden          : cert.ordenCompra.idOrden,
          idProyecto       : cert.proyecto.idProyecto,
          isActive         : cert.estado.estadoId
        });
        // this.certificacionForm.controls['idOrden'].disable();
      })
    }
  };

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY-S', this.listProyectos);
    })
  }

  listOrdenCombo: any[] = [];
  getAllOrdenCombo(){
    this.liquidacionService.getAllOrdenCombo().subscribe(resp => {
      this.listOrdenCombo = resp;
      console.log('OC-COMBO', this.listOrdenCombo);
    })
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
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }


}

