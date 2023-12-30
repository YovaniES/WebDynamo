import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

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
  this.getListOrdenCompraCombo();

  if (this.DATA_FACTURA) {
    this.cargarFacturaById();
    console.log('FACTURA_MODAL', this.DATA_FACTURA);
    this.getListaEstadosFactura();
    }
  }

  facturaForm!: FormGroup;
  newForm(){
    this.facturaForm = this.fb.group({
      nro_factura       : [''],
      idEstado          : [''],
      // proyecto          : [''],
      ordenCompra       : [''],
      idCertificacion   : [''],
      fecha_facturacion : [''],
      tgs               : [''],
      adquira           : [''],
      total             : [''],
      factura_tgs       : [''],
      factura_adquira   : [''],
      idUsuarioCreacion : [''],
      fecha_creacion    : [''],
    })
  }

  actionBtn: string = 'Crear';
  cargarFacturaById(): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_FACTURA) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getFacturaById(this.DATA_FACTURA.idFactura).subscribe((fact: any) => {

        this.blockUI.stop();
        this.facturaForm.reset({
          idFactura        : this.DATA_FACTURA.idFactura,
          nro_factura      : fact.nro_factura,
          // proyecto         : fact.proyecto,
          idEstado         : fact.estado.idEstado,
          ordenCompra      : fact.ordenCompra.idOrdenCompra,
          fecha_facturacion: fact.fecha_facturacion,
          tgs              : fact.tgs,
          adquira          : fact.adquira,
          total            : fact.total,
          factura_tgs      : fact.factura_tgs,
          factura_adquira  : fact.factura_adquira,
          fecha_creacion   : moment.utc(fact.fecha_creacion).format('YYYY-MM-DD'),
          usuarioActualiza : this.userID,
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
      nro_factura       : formValues.nro_factura,
      idEstado          : formValues.idEstado,
      idCertificacion   : formValues.idCertificacion,
      fecha_facturacion : formValues.fecha_facturacion,
      factura_tgs       : formValues.factura_tgs,
      factura_adquira   : formValues.factura_adquira,
      idUsuarioCreacion : this.userID,
    }

    this.liquidacionService.crearFactura(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear factura!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.close(true);
      }
    })
  }

  listEstadoFacturas: any[] = [];
  getListaEstadosFactura() {
    this.liquidacionService.getListaEstadosFactura().subscribe((resp) => {
      this.listEstadoFacturas = resp;
      console.log('EST_FACTURA', this.listEstadoFacturas);
    });
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY-S', this.listProyectos);
    })
  }

  listOrdenCompraCombo: any[] = [];
  getListOrdenCompraCombo(){
    this.liquidacionService.getAllOrdenCompraCombo().subscribe(resp => {
      this.listOrdenCompraCombo = resp;
      console.log('OC-COMBO', this.listOrdenCompraCombo);
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

