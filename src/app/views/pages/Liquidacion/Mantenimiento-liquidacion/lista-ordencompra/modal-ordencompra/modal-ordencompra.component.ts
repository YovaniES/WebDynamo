import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-ordencompra',
  templateUrl: './modal-ordencompra.component.html',
  styleUrls: ['./modal-ordencompra.component.scss'],
})
export class ModalOrdencompraComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;


  page = 1;
  totalFacturas: number = 0;
  pageSize = 10;

  constructor( private fb: FormBuilder,
               private liquidacionService: LiquidacionService,
               private authService: AuthService,
               private spinner: NgxSpinnerService,
               public dialogRef: MatDialogRef<ModalOrdencompraComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_ORDENCOMPRA: any
  ) {}

  ngOnInit(): void {
  this.newForm();
  this.getUserID();

  if (this.DATA_ORDENCOMPRA) {
    this.cargarOrdenCompraById();
    console.log('DATA_OC', this.DATA_ORDENCOMPRA);

  }
  }

  ordencompraForm!: FormGroup;
  newForm(){
    this.ordencompraForm = this.fb.group({
     nro_orden       : ['', Validators.required],
     monto           : ['', Validators.required],
     certificaciones : [''],
     fecha_creacion  : [''],
     id_estado       : ['']
    })
  };


  crearOactualizarOrdenCompra(){
    if (this.ordencompraForm.invalid) {
      return Object.values(this.ordencompraForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_ORDENCOMPRA ) {
        this.actualizarOrdenCompra();
    } else {
      this.crearOrdenCompra()
    }
  }

  actualizarOrdenCompra(){
    const formValues = this.ordencompraForm.getRawValue();

    const requestOrden = {
      idOrden            : this.DATA_ORDENCOMPRA.idOrden,
      nroOrden           : formValues.nro_orden,
      monto              : formValues.monto,
      idUsuarioActualiza : this.userID
    }

    this.liquidacionService.actualizarOrdenCompra(this.DATA_ORDENCOMPRA.idOrden, requestOrden).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar orden de compra!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  crearOrdenCompra(){

  }

  // "nroOrden": "string",
  // "monto": 0,
  // "idUsuarioCreacion": 0,
  // "certificacions": [
  //   {
  //     "nro_certificacion": "string",
  //     "valor": 0,
  //     "moneda": "string",
  //     "idOrden": 0,
  //     "idProyecto": 0,
  //     "idUsuarioCreacion": 0
  //   }

  actionBtn: string = 'Crear';
  cargarOrdenCompraById(): void{
    this.blockUI.start("Cargando Orden de Compra...");
    if (this.DATA_ORDENCOMPRA) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getOrdenCompraById(this.DATA_ORDENCOMPRA.idOrden).subscribe((oc: any) => {
        console.log('DATA_BY_ID_OC', oc);

        this.blockUI.stop();
        this.ordencompraForm.reset({
          idOrden        : this.DATA_ORDENCOMPRA.idOrden,
          nro_orden      : oc.nro_orden,
          monto          : oc.monto,
          fecha_creacion : moment.utc(oc.fecha_creacion).format('YYYY-MM-DD'),
          certificaciones: oc.certificacions,
          id_estado      : oc.estado
          // certificacionList : [
          //     {
          //         "idCertificacion": 9,
          //         "nro_certificacion": "5040513931",
          //         "valor": 4.07,
          //         "moneda": "PEN"
          //     }
          //   ]
        });

        this.ordencompraForm.controls['fecha_creacion'].disable();
        this.ordencompraForm.controls['id_estado'     ].disable();
      })
    }
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }


  limpiarFiltro(){}

  eliminarLiquidacion(id: number){}

  showAlertError(message: string) {
    Swal.fire({
      title: 'Error',
      icon : 'error',
      text : message,
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.ordencompraForm.get(campo)?.invalid && this.ordencompraForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  };


  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.liquidacionService.getAllOrdenCompra().subscribe( (resp: any) => {
            // this.listGestores = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
}

