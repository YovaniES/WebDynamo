import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VentaDeclaradaComponent } from '../modal-actas/venta-declarada/venta-declarada.component';
import { DetalleActasComponent } from '../modal-actas/detalle-actas/detalle-actas.component';

@Component({
  selector: 'app-sub-actas',
  templateUrl: './sub-actas.component.html',
  styleUrls: ['./sub-actas.component.scss'],
})
export class SubActasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;
  loadingItem: boolean = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private actasService: ActasService,
               private utilService: UtilService,
               private liquidacionService: LiquidacionService,
               public dialogRef: MatDialogRef<SubActasComponent>,
               private dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public DATA_ACTA: any
  ) {}

  ngOnInit(): void {
    this.newFilfroForm()
    this.getUserID();
    this.getListGestorCombo();
    this.getAllProyecto();
    this.getAllSubserviciosCombo();
    this.getAllEstadosDetActa();
    // console.log('DATA_ACTA', this.DATA_ACTA);

    if (this.DATA_ACTA) {
      this.cargarActaById();
      }
  }

  subActasForm!: FormGroup;
  newFilfroForm(){
    this.subActasForm = this.fb.group({
      subservicio  : [''],
      idProyecto   : [''],
      gestor       : [''],
      idGestor     : [''],
      venta_total  : [''],
      declarado    : [''],
      f_periodo    : [''],
      periodo      : [''],
      enlace       : [''],
      idEstado     : [''],
      comentario   : [''],
    })
  };

  crearOactualizarSubActa(){
    if (this.subActasForm.invalid) {
      return Object.values(this.subActasForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    if (this.DATA_ACTA ) {
        console.log('UPD_SUB_ACTA');
        this.actualizarSubActa();
    } else {
      console.log('CREAR_SUB_ACTA');
      // this.crearSubActa()
    }
  }

  actualizarSubActa(){
    const formValues = this.subActasForm.getRawValue();

    const requestSubActa = {
      idActa       : this.DATA_ACTA.idActa,
      idGestor     : formValues.idGestor,
      idProyecto   : formValues.idProyecto,
      idSubservicio: formValues.subservicio,
      periodo      : this.utilService.generarPeriodo(formValues.periodo),
      venta_total  : formValues.venta_total,
      comentario   : formValues.comentario,
      idEstado     : formValues.idEstado,
      enlace_acta  : formValues.enlace,
      idUsuario    : this.userID,
    }

    this.actasService.actualizarActa(this.DATA_ACTA.idActa, requestSubActa).subscribe((resp: any) => {

      if (resp.success) {
        Swal.fire({
          title: 'Actualizar Acta.!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  };

  eliminarDetalleActa(detalle: any){
    console.log('DEL_DET_ACTA', detalle);

    Swal.fire({
      title: '¿Eliminar detalle acta?',
      text: `¿Estas seguro que deseas eliminar el detalle acta: ${detalle.idDetalleActaConcat}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actasService.eliminarDetActa(detalle.idDetalleActa).subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar detalle acta',
              text: `${detalle.idDetalleActaConcat}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.cargarActaById();
          });
      }
    });
  }

  eliminarVentaDeclarada(declarado: any) {
    console.log('DEL_VD', declarado);

    Swal.fire({
      title: '¿Eliminar venta declarada?',
      text: `¿Estas seguro que deseas eliminar la venta declarada: ${declarado.montoDeclarado}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#5ac9b3',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actasService.eliminarVentaDeclarado(declarado.idDeclarado).subscribe((resp) => {
            Swal.fire({
              title: 'Eliminar venta declarada',
              text: `${declarado.montoDeclarado}: ${resp.message} exitosamente`,
              icon: 'success',
            });
            this.cargarActaById();
          });
      }
    });
  };

  listDetActas  : any[] = [];
  listDeclarados: any[] = [];
  actionBtn: string = 'Crear';
  cargarActaById(): void{
    this.blockUI.start("Cargando acta y su detalle...");
    if (this.DATA_ACTA) {
      this.actionBtn = 'Actualizar'
      this.actasService.getActaById(this.DATA_ACTA.idActa).subscribe((acta: any) => {
        this.blockUI.stop();
        console.log('DATA_BY_ID_ACTA', acta);

        this.listDetActas   = acta.detalleActas;
        this.listDeclarados = acta.actaDeclarados;

        this.subActasForm.reset({
          comentario        : acta.comentario,
          declarado         : acta.declaradoTotalActa,
          enlace            : acta.enlaceActa,
          facturadoTotalActa: acta.facturadoTotalActa,
          gestor            : acta.gestor,
          idActa            : acta.idActa,
          idEstado          : acta.idEstado,
          idGestor          : acta.idGestor,
          idProyecto        : acta.idProyecto,
          subservicio       : acta.idSubservicio,
          pendiente         : acta.pendiente,
          periodo           : acta.periodo,
          venta_total       : acta.ventaTotalActa,
        })

        // this.subActasForm.controls['idGestor'  ].disable();
        // this.subActasForm.controls['idProyecto' ].disable();
        this.subActasForm.controls['declarado'  ].disable();
        // this.subActasForm.controls['venta_total'].disable();
        // this.subActasForm.controls['periodo'   ].disable();
      })
    }
  };

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.liquidacionService.getAllEstadosActa().subscribe(resp => {
      this.listEstadoDetActa = resp;
      console.log('EST_ACTA', this.listEstadoDetActa);
    })
  };

  listGestoresCombo: any[] = [];
  getListGestorCombo(){
    this.liquidacionService.getAllGestorCombo().subscribe((resp: any) => {
      this.listGestoresCombo = resp;
    })
  };

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
   })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectosCombo().subscribe(resp => {
      this.listProyectos = resp;
    })
  }

  listSubserviciosCombo:any[] = [];
  getAllSubserviciosCombo(){
    this.liquidacionService.getAllSubserviciosCombo().subscribe( (resp: any) => {
      this.listSubserviciosCombo = resp;
      // console.log('SUBSER-COMBDO', this.listSubserviciosCombo);

    });
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
    if (this.subActasForm.get(campo)?.invalid && this.subActasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  crearOactualizarDetActa(DATA?: any) {
    console.log('DATA_DET_ACTA', DATA);
    this.dialog
      .open(DetalleActasComponent, { width: '55%', data: DATA })
      .afterClosed().subscribe((resp) => {
        console.log('RESP_DET_ACT', resp);
        if (resp) {
          this.cargarActaById();
        }
      });
  }

  abrirVentaDeclarada(ACTA?: any) {
    console.log('DATA_ACTA', ACTA);
    this.dialog
      .open(VentaDeclaradaComponent, { width: '55%', data: {ACTA, sub: this.subActasForm.getRawValue() } })
      .afterClosed().subscribe((resp) => {
        console.log('RESP_ACT_DECL', resp);
        if (resp) {
          this.cargarActaById();
          // this.actualizarSubActa();
        }
      });
  }

}

