import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-acta',
  templateUrl: './acta.component.html',
  styleUrls: ['./acta.component.scss'],
})
export class ActaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  loading = false;
  listActas: any[] = [];
  // listActas: Menu[] = [];
  showingidx = 0;

  constructor(
    private facturacionService: FacturacionService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshModules();
    this.newFilfroForm();
    this.cargarOBuscarLiquidacion();
    this.dataMenuPrueba();
    console.log('ABX', this.listActas);
    ;
  }

      //   {
    //     id: 1,
    //     code: 'GES',
    //     text: 'GESTIÓN PERSONAL',
    //     order: 1,
    //     icon: 'people',
    //     type: 'PAREN',
    //     link: 'gestion',
    //     enable: false,
    //     module: 'Reporte',
    //     displayed: false,
    //     roles: PERMISSION.MENU_PERSONAS,
    //     submenus: [

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

  openEditDialog( idx: number, module:any, ismodule: boolean, isnew: boolean, modulename: any) {
    // this.dialog
    //   .open(ModalEditModuleComponent, { data: { module, ismodule, isnew, modulename } })
    //   .afterClosed()
    //   .subscribe((resp) => {
    //     if (resp) {
    //       this.showingidx = idx;
    //       this.refreshModules();
    //     }
    //   });
  }




  // DATA LIQUIDACION OJO


  liquidacionForm!: FormGroup;
  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      codFact            : [''],
      id_proy            : [''],
      id_liquidacion     : [''],
      id_estado          : [''],
      fechaRegistroInicio: [''],
      fechaRegistroFin   : [''],
      id_gestor          : [''],
      importe            : [''],
      subservicio        : [''],
      f_periodo          : [''],
      periodoActual      : [true],
      import             : ['']
    })
  };


  listaLiquidacion: any[] = [];
  cargarOBuscarLiquidacion(){
    this.blockUI.start("Cargando liquidaciones...");
    const formValues = this.liquidacionForm.getRawValue();

    let parametro: any[] = [{
      "queryId": 118,
      "mapValue": {
          cod_fact       : formValues.codFact,
          id_proy        : formValues.id_proy,
          id_liquidacion : formValues.id_liquidacion,
          id_estado      : formValues.id_estado,
          id_gestor      : formValues.id_gestor,
          importe        : formValues.importe,
          per_actual     : formValues.periodoActual? this.modificarMes(-1): '',
          subservicio    : formValues.subservicio,
          f_periodo      : formValues.f_periodo,
          inicio         : this.datepipe.transform(formValues.fechaRegistroInicio,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(formValues.fechaRegistroFin,"yyyy/MM/dd"),
      }
    }];
    this.facturacionService.cargarOBuscarLiquidacion(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

    //  console.log('Lista-Liquidaciones', resp.list, resp.list.length);
      this.listaLiquidacion = [];
      this.listaLiquidacion = resp.list;

      // this.spinner.hide();
    });
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


}
