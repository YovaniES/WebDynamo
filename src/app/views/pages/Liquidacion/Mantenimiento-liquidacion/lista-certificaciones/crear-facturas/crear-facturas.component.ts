import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-facturas',
  templateUrl: './crear-facturas.component.html',
  styleUrls: ['./crear-facturas.component.scss'],
})
export class CrearFacturasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<CrearFacturasComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_FACTURA: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getUserID();
  this.getAllCertificaciones();
  this.getListEstadoCertificacion();
  if (this.DATA_FACTURA) {
    // this.cargarFacturaById(this.DATA_FACTURA);
    // console.log('FACTURA_MODAL', this.DATA_FACTURA);
    }
  }

  facturaForm!: FormGroup;
  newForm(){
    this.facturaForm = this.fb.group({
      nro_factura       : ['', Validators.required],
      idEstado          : ['', Validators.required],
      idCertificacion   : ['', Validators.required],
      fecha_facturacion : [''],
      factura_tgs       : [''],
      factura_adquira   : [''],
      fecha_creacion    : [''],
      idUsuarioCreacion : [''],
    })
  }

  actionBtn: string = 'Crear';
  cargarFacturaById(idLider: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_FACTURA) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getLiderById(this.DATA_FACTURA.idFactura).subscribe((cert: any) => {

        this.blockUI.stop();
        this.facturaForm.reset({
          nombre        : cert.nombre,
          apellidos     : cert.apellidos,
          correo        : cert.correo,
          descripcion   : cert.descripcion,
          id_estado     : cert.eliminacion_logica,
          fecha_creacion: moment.utc(cert.fecha_creacion).format('YYYY-MM-DD'),
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

  // {
  //   "nro_factura": "F-0101011",
  //   "idEstado": 1,
  //   "idCertificacion": 18,
  //   "fecha_facturacion": "2023-12-19",
  //   "factura_tgs": "",
  //   "factura_adquira": "",
  // }
  //   "idUsuarioCreacion": 474

  crearFactura(): void{
    const formValues = this.facturaForm.getRawValue();

    const request = {

      nro_factura       : formValues.nro_factura,
      idEstado          : formValues.idEstado,
      idCertificacion   : formValues.idCertificacion,
      fecha_facturacion : formValues.fecha_facturacion,
      factura_tgs       : formValues.factura_tgs,
      factura_adquira   : formValues.factura_adquira,
      idUsuarioCreacion : formValues.idUsuarioCreacion,
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

  listEstadoDetalleActa:any[] = [];
  getListEstadoCertificacion(){
    this.liquidacionService.getAllEstados().subscribe(resp => {
      this.listEstadoDetalleActa = resp.filter((x:any) => x.idEstado != 2);
      console.log('EST-CERT', this.listEstadoDetalleActa);

    })
  }

  listCertificaciones: any[] = [];
  getAllCertificaciones(){
    this.liquidacionService.getAllCertificaciones().subscribe(resp => {
      this.listCertificaciones = resp;
      console.log('CERTIFICACIONES', this.listCertificaciones);
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

