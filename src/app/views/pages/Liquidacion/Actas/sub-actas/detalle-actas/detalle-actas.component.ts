import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActasService } from 'src/app/core/services/actas.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-detalle-actas',
  templateUrl: './detalle-actas.component.html',
  styleUrls: ['./detalle-actas.component.scss'],
})
export class DetalleActasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private actasService: ActasService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<DetalleActasComponent>,
               @Inject(MAT_DIALOG_DATA) public DATA_DET_ACTAS: any
  ) {}

  ngOnInit(): void {
  this.newForm()
  this.getAllProyecto();
  this.getAllEstadosDetActa();

  // console.log('ID_DET_ACTA', this.DATA_DET_ACTAS.idActa);
  console.log('DATA_DET_ACTAS', this.DATA_DET_ACTAS);
  console.log('DATA_DET_ACTAS=>ID', this.DATA_DET_ACTAS.idActa);

  if (this.DATA_DET_ACTAS.idDetalleActa) {
    this.cargarDetActaById();
    console.log('DETALLE_ACTA', this.DATA_DET_ACTAS);
    }
  }

  detalleactasForm!: FormGroup;
  newForm(){
    this.detalleactasForm = this.fb.group({
     analista    : ['', Validators.required],
     perfil      : ['', Validators.required],
     precio      : ['', Validators.required],
     cantidad    : ['', Validators.required],
     venta_total : [''],
    //  categoria_1: ['', Validators.required],
     importe     : [''],
     observacion : [''],
     comentario  : [''],
     idEstado    : [''],
     unidad      : ['']
    })
  }

  crearOactualizarDetActa(){
    if (this.detalleactasForm.invalid) {
      return Object.values(this.detalleactasForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    if (this.DATA_DET_ACTAS.idDetalleActa > 0) {
      console.log('UPD_DET');
      this.actualizarDetActa();
    } else {
      console.log('CREATE_DET_ACTA');
      this.crearDetActa();
    }
  }

  actualizarDetActa(){
    const formValues = this.detalleactasForm.getRawValue();

    const requestDetActa = {
      idDetalleActa: this.DATA_DET_ACTAS.idDetalleActa,
      idActa       : this.DATA_DET_ACTAS.idActa,
      idEstado     : formValues.idEstado,
      nombre       : formValues.analista,
      unidades     : formValues.cantidad,
      precio_unidad: formValues.precio,
      precio_total : formValues.venta_total,
      perfil       : formValues.perfil,
      declarado    : 0,
      facturado    : 0,
      observacion  : formValues.observacion,
      unidad       : formValues.unidad,
      comentario   : formValues.comentario
    }

    this.actasService.actualizarDetActa(this.DATA_DET_ACTAS.idDetalleActa, requestDetActa ).subscribe((resp: any) => {
      if (resp.success) {
        Swal.fire({
          title: 'Actualizar detalle acta!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  }

  crearDetActa(){
    const formValues = this.detalleactasForm.getRawValue();

    const request = {
      idActa       : this.DATA_DET_ACTAS.idActa,
      nombre       : formValues.analista,
      unidades     : formValues.cantidad,
      precio_unidad: formValues.precio,
      precio_total : formValues.precio_total,
      perfil       : formValues.perfil,
      observacion  : formValues.observacion,
      unidad       : formValues.unidad,
      comentario   : formValues.comentario
    }

    this.actasService.crearDetalleActa(request).subscribe((resp:any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear detalle acta!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })

  }
  // precioTotal
  listCertificaciones: any[] = [];
  actionBtn: string = 'Crear'
  cargarDetActaById(): void {
    this.blockUI.start('Cargando detalle ...');

    if (this.DATA_DET_ACTAS) {
      this.actionBtn = 'Actualizar'
      this.actasService.getDetActaById(this.DATA_DET_ACTAS.idDetalleActa).subscribe((detalle:any) => {
        this.blockUI.stop();
        console.log('DET_ACTA_BY_ID', detalle);

        this.listCertificaciones = detalle.detalleActaCertificacions;
        this.detalleactasForm.reset({
          analista   : detalle.nombre,
          perfil     : detalle.perfil,
          observacion: detalle.observacion,
          importe    : detalle.importe,
          venta_total: detalle.precioTotal,
          cantidad   : detalle.unidades,
          precio     : detalle.precioUnidad,
          comentario : detalle.comentario,
          unidad     : detalle.unidad,
          idEstado   : detalle.idEstado,
        })
      })
    }
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.actasService.getAllEstadosDetActa().subscribe(resp => {
      this.listEstadoDetActa = resp;
      console.log('EST_DET_ACTA', this.listEstadoDetActa);
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
    if (this.detalleactasForm.get(campo)?.invalid && this.detalleactasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

}

