import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';
import { DetalleActasComponent } from './detalle-actas/detalle-actas.component';
import { ActasService } from 'src/app/core/services/actas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VentaDeclaradaComponent } from './venta-declarada/venta-declarada.component';

@Component({
  selector: 'app-sub-actas',
  templateUrl: './sub-actas.component.html',
  styleUrls: ['./sub-actas.component.scss'],
})
export class SubActasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;

  loadingItem: boolean = false;

  showingidx = 0;

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
  this.getListGestor();
  this.getAllProyecto();
  this.getAllSubservicios();
  this.getAllEstadosDetActa();
  // console.log('DATA_ACTA', this.DATA_ACTA);


  if (this.DATA_ACTA) {
    this.cargarActaById();

    this.listProyectos = this.DATA_ACTA.proyectos;
    // console.log('PROYEC*', this.listProyectos);
  }
  }

  subActasForm!: FormGroup;
  newFilfroForm(){
    this.subActasForm = this.fb.group({
      subservicio    : [''],
      idProyecto     : [''],
      gestor         : [''],
      idGestor       : [''],
      importe        : [''],
      declarado      : [''],
      f_periodo      : [''],
      periodoActual  : [true],
      periodo        : [''],
      idEstado       : [''],
      comentario     : [''],
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
      venta_total  : formValues.importe,
      comentario   : formValues.comentario,
      idEstado     : formValues.idEstado,
      enlace_acta  : '',
      idUsuario    : this.userID,
    }

    this.actasService.actualizarActa(this.DATA_ACTA.idActa, requestSubActa).subscribe((resp: any) => {

      if (resp.success) {
        Swal.fire({
          title: 'Actualizar SubActa!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  }


  eliminarDetalleActa(idDetActa: number){

  }

  eliminarVentaDeclarada(idDeclarado: number){}

  // listProyectos: any[] = []
  listDetActas: any[] = [];
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
          enlaceActa        : acta.enlaceActa,
          facturadoTotalActa: acta.facturadoTotalActa,
          gestor            : acta.gestor,
          idActa            : acta.idActa,
          idEstado          : acta.idEstado,
          idGestor          : acta.idGestor,
          idProyecto        : acta.idProyecto,
          subservicio       : acta.idSubservicio,
          pendiente         : acta.pendiente,
          periodo           : acta.periodo,
          importe           : acta.ventaTotalActa,
        })

        this.subActasForm.controls['idGestor'  ].disable();
        this.subActasForm.controls['idProyecto'].disable();
        // this.subActasForm.controls['idEstado'  ].disable();
        this.subActasForm.controls['periodo'   ].disable();
      })
    }
  };

  listEstadoDetActa: any[] = [];
  getAllEstadosDetActa(){
    this.actasService.getAllEstadosDetActa().subscribe(resp => {
      this.listEstadoDetActa = resp;
      console.log('EST_DET_ACTA', this.listEstadoDetActa);
    })
  };

  listGestores: any[] = [];
  getListGestor(){
    this.liquidacionService.getAllGestores().subscribe((resp: any) => {
      this.listGestores = resp;
    })
  };

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
    //  console.log('ID-USER', this.userID);
   })
  }
  // listProyectos: any[] = this.DATA_ACTA.proyectos;

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      // console.log('PROY', this.listProyectos);
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    this.liquidacionService.getAllSubservicios().subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
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

  limpiarFiltro() {
    this.subActasForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    // this.getAllDetalleActas();
  }

  crearOactualizarDetActa(DATA?: any) {
    console.log('DATA_DET_ACTA', DATA);
    this.dialog
      // .open(DetalleActasComponent, { width: '55%', data: this.subActasForm.value })
      .open(DetalleActasComponent, { width: '55%', data: DATA })
      .afterClosed().subscribe((resp) => {
        console.log('RESP_DET_ACT', resp);

        if (resp) {
          // this.getAllDetalleActas();
        }
      });
  }

  abrirVentaDeclarada(ACTA?: any) {
    console.log('DATA_ACTA', ACTA);
    this.dialog
      // .open(DetalleActasComponent, { width: '55%', data: this.subActasForm.value })
      .open(VentaDeclaradaComponent, { width: '55%', data: ACTA })
      .afterClosed().subscribe((resp) => {
        console.log('RESP_ACT_DECL', resp);

        if (resp) {
          // this.getAllActasDeclarados();
        }
      });
  }

}

