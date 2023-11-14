import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import Swal from 'sweetalert2';
import { DetalleActasComponent } from './detalle-actas/detalle-actas.component';

export interface changeResponse {
  message: string;
  status: boolean;
  previous?: string;
}

@Component({
  selector: 'app-sub-actas',
  templateUrl: './sub-actas.component.html',
  styleUrls: ['./sub-actas.component.scss'],
})
export class SubActasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;

  loadingItem: boolean = false;
  listActas: any[] = [];


  page = 1;
  totalActas: number = 0;
  pageSize = 10;

  showingidx = 0;

  constructor( private fb: FormBuilder,
               private facturacionService: FacturacionService,
               private liquidacionService: LiquidacionService,
               private spinner: NgxSpinnerService,
               public dialogRef: MatDialogRef<SubActasComponent>,
               private dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public DATA_SUBACTA: any
  ) {}

  ngOnInit(): void {
  this.newFilfroForm()
  this.dataMenuPrueba();
  this.getAllProyecto();
  this.getAllSubActas();
  this.getAllSubservicios();
  console.log('SUBACTAS', this.listActas);

  if (this.DATA_SUBACTA) {
    this.cargarGestorById(this.DATA_SUBACTA);
  }
  }

  listSubActas: any[] = [];

  subActasForm!: FormGroup;
  newFilfroForm(){
    this.subActasForm = this.fb.group({
      idSubacta    : [''],
     subservicio   : ['',],
      proyecto     : [''],
      gestor       : [''],
      importe      : [''],
      declarado    : [''],
      f_periodo    : [''],
      periodoActual: [true],
      periodo      : [''],
      estado       : [''],
      comentario   : ['']
    })
  };

  crearOactualizarSubActa(){

  }

  abrirModalCrearOactualizar(){

  }

  eliminarDetalleActa(){}

  actionBtn: string = 'Crear';
  cargarGestorById(idGestor: number): void{
    this.blockUI.start("Cargando data...");
    if (this.DATA_SUBACTA) {
      this.actionBtn = 'Actualizar'
      this.facturacionService.getLiquidacionById(idGestor).subscribe((resp: any) => {
        this.blockUI.stop();
        console.log('DATA_BY_ID_GESTOR', resp);

        this.subActasForm.reset({
          proyecto     : resp.proyecto,
          subservicio  : resp.subservicio,
          gestor       : resp.gestor,
          importe      : resp.importe,
          fecha_periodo: resp.fecha_periodo,
          comentario   : resp.comentario,
        })
      })
    }
  }

  listGestores: any[] = [];
  getAllSubActas(){
    // this.blockUI.start('Cargando lista Gestores...');
    // const request: FiltroGestorModel = this.subActasForm.value;
    // this.liquidacionService.getAllSubActas(request).subscribe((resp: any) => {
    //   this.blockUI.stop();

    //   this.listGestores = resp
    //   console.log('LIST-GESTOR', this.listGestores);
    // })
  }

  listProyectos: any[] = [];
  getAllProyecto(){
    this.liquidacionService.getAllProyectos().subscribe(resp => {
      this.listProyectos = resp;
      console.log('PROY', this.listProyectos);
    })
  }

  listSubservicios:any[] = [];
  getAllSubservicios(){
    const request = {
      idGestor     : '',
      idProyecto   : '',
      idSubservicio: this.subActasForm.controls['subservicio'].value,
    }

    this.liquidacionService.getAllSubservicios(request).subscribe( (resp: any) => {
      this.listSubservicios = resp.result;
      console.log('SUBS', this.listSubservicios);
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
    if (this.subActasForm.get(campo)?.invalid && this.subActasForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalActas) {
      this.facturacionService.cargarOBuscarLiquidacion(offset.toString()).subscribe( (resp: any) => {
            this.listGestores = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }


  limpiarFiltro() {
    this.subActasForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    // this.getAllActas();
  }

  abrirDetalleActas(DATA?: any) {
    console.log('DATA_SUB_ACTAS', DATA);
    this.dialog
      .open(DetalleActasComponent, { width: '55%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllSubActas();
        }
      });
  }

  dataMenuPrueba(){
    this.loading = true;
    this.listActas = [
      {
        id_acta: 1,
        gestor: 'Alberto Regalado',
        proyecto: 'TQACOR',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '20000',
        periodo: '09-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'jysantiago',
        icon: 'settings_suggest',
        enable: true,
        detalle_acta: [
          {
            id_det: 101,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
          },
          {
            id_det: 102,
            acta: 'TQAFAB-A0012',
            proyecto: 'TQACOR',
            subservicio: 'COM',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
          },
          {
            id_det: 103,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: '-',
            icon:'delete',
            enable: false,
          }
        ],
      },

      {
        id_acta: 2,
        gestor: 'Bedwer Hernandez',
        proyecto: 'TQACOR',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'completado',
        importe: '12000',
        periodo: '08-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        icon: 'grid_view',
        enable: false,
        detalle_acta: [
          {
            id_det: 201,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            // gestor: 'Bedwer Hernandez',
            // categoria: 'Analista de calidad',
            // analista: 'SOTELO GUTIERREZ, FRANCISCO            ',
            // jornadas: '25,46',
            icon:'delete',
            enable: false,
          },
          {
            id_det: 202,
            acta: 'TQACOR-A0017',
            proyecto: 'TQACOR',
            subservicio: 'Tren Post Venta',
            estado:'completado',
            venta_total: '181,45',
            declarado:'10000',
            facturado:'10000',
            pendiente:'10000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
        }
       ]
      },

      {
        id_acta: 3,
        gestor: 'Bedwer Hernandez',
        proyecto: 'TQACOM',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '13000',
        periodo: '09-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        icon: 'currency_exchange',
        enable: false,
        detalle_acta: [
          {
            id_det: 301,
            acta: 'TRATDP-A00212',
            proyecto: 'TQACOR',
            subservicio: 'Averías',
            estado:'completado',
            venta_total: '8000',
            declarado:'8000',
            facturado:'6000',
            pendiente: '1',
            comentario: 'Cantidad total 1',
            icon:'delete',
            enable: false,

          },
          {
            id_det: 302,
            acta: 'TDPNEG-A00110',
            proyecto: 'TQACOR',
            subservicio: 'Chatbot',
            estado:'completado',
            venta_total: '5000',
            declarado:'3000',
            facturado:'20000',
            pendiente:'20000',
            comentario: 'Cantidad total 2',
            icon:'delete',
            enable: false,
        }
       ]
      },

      {
        id_acta: 4,
        gestor: 'Bedwer Hernandez',
        proyecto: 'TRAPRO',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '12000',
        periodo: '10-2023',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        icon: 'currency_exchange',
        enable: true,
        detalle_acta: [  ]
      }
    ]

    this.loading = false;
  }

}

