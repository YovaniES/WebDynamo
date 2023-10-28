import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalEditModuleComponent } from './modal-edit-module/modal-edit-module.component';
import { ModalActaComponent } from './modal-actas/modal-acta.component';

@Component({
  selector: 'app-acta',
  templateUrl: './acta.component.html',
  styleUrls: ['./acta.component.scss'],
})
export class ActaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loading = false;

  page = 1;
  totalActas: number = 0;
  pageSize = 5;

  listActas: any[] = [];
  // listActas: Menu[] = [];
  showingidx = 0;

  constructor(
    private facturacionService: FacturacionService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshModules();
    this.newFilfroForm();
    this.getAllActas();
    this.dataMenuPrueba();
    this.getListProyectos();
    this.getListGestores();
    console.log('ABX', this.listActas);
    ;
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

  refreshModules() {
    // this.loading = true;
    // const subs: Subscription = this.permissionService.getAllModules().subscribe((resp:Menu[]) => {
    //     console.log('DATAMENU', resp)

    //     this.listActas = resp;
    //     this.loading = false;
    //     subs.unsubscribe();
    //   });
  }

  // DATA LIQUIDACION OJO


  actasForm!: FormGroup;
  newFilfroForm(){
    this.actasForm = this.fb.group({
      codFact            : [''],
      id_proy            : [''],
      importe            : [''],
      subservicio        : [''],
      f_periodo          : [''],
      periodoActual      : [true],
      import             : [''],
      estado             : ['']
    })
  };

  crearLiquidacion(){

  }

  listaLiquidacion: any[] = [];
  getAllActas(){
  }

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('COD_PROY', resp.list);
    });
  };


  listGestores: any[] = [];
  getListGestores(){
    let parametro: any[] = [{queryId: 102}];

    this.facturacionService.getListGestores(parametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            // console.log('GESTORES', resp);
    });
  };


  limpiarFiltro() {
    this.actasForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.getAllActas();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalActas) {
      // this.facturacionService.getAllActas(offset.toString()).subscribe( (resp: any) => {
      //       this.listaLiquidacion = resp.list;
      //       this.spinner.hide();
      //     });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }



  modificarMes(mes: any) {
    var date1 = new Date() //new Date('2023/04/03'); Ejm
    var date = new Date( date1.getFullYear().toString() + '/'+ (date1.getMonth()+1).toString() + '/' + '01');
    // console.log('DATE-2023', date1.getFullYear().toString(), (date1.getMonth()+1).toString()); //2023-9

    /* Javascript recalculará la fecha si el mes es menor de 0 (enero) o mayor de 11 (diciembre) */
    date.setMonth(date.getMonth() + mes);
    // console.log('TOTAL-CORR',this.modificarMes(-1)); //2023-08
    return date.toISOString().substring(0, 7); /* Obtenemos la fecha en formato YYYY-mm */
  }

  openEditDialog( idx: number, module:any, ismodule: boolean, isnew: boolean, modulename: any) {
    this.dialog
      .open(ModalEditModuleComponent, { data: { module, ismodule, isnew, modulename } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.showingidx = idx;
          this.refreshModules();
        }
      });
  }

  abrirModalCrearOactualizar(DATA?: any) {
    console.log('DATA_ACTAS', DATA);
    this.dialog
      .open(ModalActaComponent, { width: '70%', height:'60%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllActas();
        }
      });
  }


}
