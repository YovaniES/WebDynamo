import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MantenimientoService } from 'src/app/core/services/mantenimiento.service';
import { ModalCertificacionComponent } from '../actualizar-liquidacion/modal-certificacion/modal-certificacion.component';
import { ModalVentadeclaradaComponent } from '../actualizar-liquidacion/modal-ventadeclarada/modal-ventadeclarada.component';
import { LiquidService } from 'src/app/core/services/liquid.service';

@Component({
    selector: 'app-modal-liquidacion',
    templateUrl: './modal-liquidacion.component.html',
    styleUrls: ['./modal-liquidacion.component.scss'],
})
export class ModalLiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  liquidacion_Id: number = 0;

  loadingItem: boolean = false;
  userID: number = 0;

  constructor(
    private liquidacionService  : LiquidService,
    private mantenimientoService: MantenimientoService,
    private authService         : AuthService,
    private fb                  : FormBuilder,
    public datePipe             : DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalVentadeclaradaComponent>,

    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any
  ){}

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.getListEstados();
    this.getListGestores();
    this.getListProyectos();

    if (this.DATA_LIQUID) {
      this.liquidacion_Id = this.DATA_LIQUID.id_Liquidacion;
      this.cargarLiqById(this.DATA_LIQUID.idFactura);

      // console.log('DATA_MODAL_LIQUID', this.DATA_LIQUID);
      this.getListVentaDeclarada();
      this.getListCertificacion();
      this.getListHistoricoCambios()
    }
  }

  liquidacionForm!: FormGroup;
  newForm(){
    this.liquidacionForm = this.fb.group({
     idFactura      : [''],
     periodo        : ['', [Validators.required]],
     idProyecto     : ['', [Validators.required]],
     idLiquidacion  : ['',], //acta,
     subServicio    : ['', [Validators.required]],
     idGestor       : ['', [Validators.required]],
     venta_declarada: ['', [Validators.required]],
     idEstado       : [''],

     idUsuarioCrea  : ['' ],
     fecha_crea     : ['' ],
     id_reg_proy    : [0]
    })
  }

  crearOactualizarLiq(){
    if (this.liquidacionForm.invalid) {
      return Object.values(this.liquidacionForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    const idFact = this.liquidacionForm.get('idFactura')?.value;

    if (idFact > 0) {
      console.log('A C T',);
      this.actualizarLiquidacion();
    }else {
      console.log('C R E A R');
      this.crearLiquidacion();
    }
  }

  crearLiquidacion(): void{
    const request =  {...this.liquidacionForm.value}

    const fechaActual = new Date();
    request.periodo = request.periodo + '-'+ '01';
    request.idUsuarioCrea = this.userID;
    request.idEstado = 178  //Enviado
    // request.periodo = request.periodo + '-'+ fechaActual.getDay()

    this.liquidacionService.createLiquidacion(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear liquidación!',
          text : `${resp.message}`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      }
    })
  }
  // idUsuarioActualiza
  actualizarLiquidacion(){
    const requestLiq = {...this.liquidacionForm.value}
    requestLiq.periodo = requestLiq.periodo + '-' + '01'
    requestLiq.idUsuarioActualiza = this.userID;
    requestLiq.ventaDeclarada = this.liquidacionForm.controls['venta_declarada'].value
    // requestLiq.idEstado = 180  //MO_CARGADO OJO FALTA EL IDESTADO, PARA QUITARLO

    this.liquidacionService.actualizarLiquidacion(this.DATA_LIQUID.idFactura, requestLiq).subscribe((resp: any) => {
      if (resp.success) {
          Swal.fire({
            title: 'Actualizar liquidación!',
            text : `${resp.message}`,
            icon : 'success',
            confirmButtonText: 'Ok',
          });
          this.close(true);
      }
    })
  }

  actionBtn: string = 'Crear';
  cargarLiqById(idLiq: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_LIQUID) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getLiquidacionById(idLiq).subscribe((resp: any) => {
        console.log('DATA_BY_ID_LIQ', resp);
        this.blockUI.stop();
        this.liquidacionForm.reset({
          idFactura      : resp.idFactura,
          periodo        : resp.periodo,
          idProyecto     : resp.idProyecto,
          idLiquidacion  : resp.idTipoLiquidacion,
          subServicio    : resp.subServicio,
          idGestor       : resp.idGestor,
          venta_declarada: resp.importe,
          idEstado       : resp.idEstado,
          fecha_crea     : resp.fechaCreacion,
          // idUsuarioCrea  : resp.idUsuarioCrea,
          // ver_estado     : resp.ver_estado,
        })
      })
    }
  }

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');
    return mesAndYear[0] + '-' + mesAndYear[1]
  }

  listVentaDeclarada:any[] = [];
  getListVentaDeclarada(){
    // this.blockUI.start('Cargando lista venta declarada...');
    // console.log('ID_LIQ_VD', this.DATA_LIQUID.idFactura);
    const requestId = {
      idFactura : this.DATA_LIQUID.idFactura
    }

    this.liquidacionService.getAllVentaDeclarada(requestId).subscribe((resp: any) => {
      // console.log('DATA_VD', resp, resp.result);
      // this.blockUI.stop();

      this.listVentaDeclarada = [];
      this.listVentaDeclarada = resp.result;
    })
  }

  listCertificacion:any[] = [];
  getListCertificacion(){
    // console.log('ID_LIQ_VD', this.DATA_LIQUID.idFactura);
    const requestId = {
      idFactura : this.DATA_LIQUID.idFactura
    }

    this.liquidacionService.getListCertificacion(requestId).subscribe((resp: any) => {
      console.log('DATA_CERT', resp);

      this.listCertificacion = [];
      this.listCertificacion = resp.result;
    })
  }

  eliminaVentaDeclarada(idVd: number){
    Swal.fire({
      title:'¿Eliminar venta declarada?',
      text: `¿Estas seguro que deseas eliminar la venta declarada?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminaVentaDeclarada(idVd).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar venta declarada',
            text: `${resp.message}, con el ${idVd}`,
            icon: 'success',
          });
          this.getListVentaDeclarada()
        });
      };
    });
  }

  eliminarCertificacion(idCert: number){
    Swal.fire({
      title:'¿Eliminar certificación?',
      text: `¿Estas seguro que deseas eliminar la certificación?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.eliminarCertificacion(idCert).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar certificación',
            text: `${resp.message}, con el ${idCert}`,
            icon: 'success',
          });
          this.getListCertificacion()
        });
      };
    });
  }

  importTotal: number = 0;
  obtenerImporteTotal(): number{
    this.importTotal = 0;

    this.listVentaDeclarada.map(factura => {
      this.importTotal = this.importTotal + factura.importe
      })

    return this.importTotal;
  }

  histCambiosEstado: any[] = [];
  getListHistoricoCambios(){
    this.liquidacionService.getHistLiquidacion(this.DATA_LIQUID.idFactura).subscribe((resp: any) => {
      // console.log('HIST', resp);
      this.histCambiosEstado = resp.result;
    })
  }

   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   };

   listEstados: any[] = [];
   getListEstados(){
     this.mantenimientoService.getAllEstados().subscribe((resp: any) => {
       this.listEstados = resp.result;
       console.log('ESTADOS_LIQ', this.listEstados);

     })
   }

  listGestores: any[] = [];
  getListGestores(){
    this.mantenimientoService.getAllGestores().subscribe((resp: any) => {
      this.listGestores = resp.result;
    })
  }

  listProyectos: any[] = [];
  getListProyectos(){
    this.mantenimientoService.getAllProyectos().subscribe((resp: any) => {
      this.listProyectos = resp.result;
      // console.log('LIQ_PROY', this.listProyectos);
    })
  }


  modalCrearVentaDeclarada(DATA_VD?: any){
    const dialogRef = this.dialog.open(ModalVentadeclaradaComponent, { width:'25%', data: {vdForm: this.liquidacionForm.value, isCreation: true} });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getListVentaDeclarada()
      }
    })
  }

  modalActualizarVentaDeclarada(DATA_VD?: any){
    console.log('X-Z', DATA_VD);

    const dialogRef = this.dialog.open(ModalVentadeclaradaComponent, { width:'25%', data: DATA_VD});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getListVentaDeclarada()
      }
    })
  }

  modalCrearModalCertificacion(){
    this.dialog.open(ModalCertificacionComponent, { width:'35%', data: {certifForm: this.liquidacionForm.value, isCreation: true}}).afterClosed().subscribe(resp => {
      if (resp) {
        this.getListCertificacion();
      }
    })
  };

  modalActualizarModalCertificacion(DATA?: any){
    this.dialog.open(ModalCertificacionComponent, { width:'35%', data: DATA}).afterClosed().subscribe(resp => {
      if (resp) {
        this.getListCertificacion();
      }
    })
  };

  campoNoValido(campo: string): boolean {
    if (this.liquidacionForm.get(campo)?.invalid && this.liquidacionForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}

