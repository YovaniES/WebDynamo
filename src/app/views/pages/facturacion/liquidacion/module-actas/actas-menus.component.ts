import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-actas-menus',
  templateUrl: './actas-menus.component.html',
  styleUrls: ['./actas-menus.component.scss'],
})
export class ModuleActasComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  loading = false;
  listmodules: any[] = [];
  // listmodules: Menu[] = [];
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
    console.log('ABX', this.listmodules);
    ;
  }


  dataMenuPrueba(){
    this.loading = true;
    // this.listmodules = [
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
    //       {
    //         code: 'MAN-001',
    //         text: 'Personal',
    //         order: 0,
    //         icon: 'how_to_reg',
    //         type: 'ALONE',
    //         link: 'gestion/personas',
    //         enable: false,
    //         module: 'MAN',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_PERSONAS,
    //       },
    //       {
    //         code: 'MAN-002',
    //         text: 'Lista vacaciones',
    //         order: 20,
    //         icon: 'surfing',
    //         type: 'PAREN',
    //         link: 'gestion/vacaciones',
    //         enable: false,
    //         module: 'MAN',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_VACACIONES,
    //       },
    //       {
    //         code: 'MAN-003',
    //         text: 'Recurso Hardware',
    //         order: 20,
    //         icon: 'phonelink',
    //         type: 'PAREN',
    //         link: 'gestion/hardware',
    //         enable: false,
    //         module: 'MAN',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_HARDWARE,
    //       },
    //       {
    //         code: 'MAN-004',
    //         text: 'Recurso Cuenta',
    //         order: 20,
    //         icon: 'lock_clock',
    //         type: 'PAREN',
    //         link: 'gestion/cuentas',
    //         enable: false,
    //         module: 'MAN',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_CUENTA,
    //       },
    //     ],
    //   },

    //   {
    //     id: 2,
    //     code: 'MAN',
    //     text: 'MANTENIMIENTO',
    //     order: 1,
    //     icon: 'settings_suggest',
    //     type: 'PAREN',
    //     link: 'mantenimiento',
    //     enable: false,
    //     module: 'administrador',
    //     displayed: false,
    //     roles: PERMISSION.MENU_MANTENIMIENTO,
    //     submenus: [
    //       {
    //         code: 'PAS-001',
    //         text: 'Entidad',
    //         order: 3,
    //         icon: 'grid_view',
    //         type: 'PAREN',
    //         link: 'mantenimiento/entidad',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_ENTIDAD,
    //       },
    //     ],
    //   },

    //   {
    //     id: 2,
    //     code: 'DAS',
    //     text: 'DASHBOARD',
    //     order: 1,
    //     icon: 'dashboard_customize',
    //     type: 'PAREN',
    //     link: 'dashboard',
    //     enable: false,
    //     module: 'administrador',
    //     displayed: false,
    //     roles: PERMISSION.MENU_DASHBOARD,
    //     submenus: [
    //       {
    //         code: 'DAS-001',
    //         text: 'Haros',
    //         order: 3,
    //         icon: 'lock_open',
    //         type: 'PAREN',
    //         link: 'dashboard/haros',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_HAROS,
    //       },
    //     ],
    //   },

    //   {
    //     id: 3,
    //     code: 'FAC',
    //     text: 'FACTURACIÓN',
    //     order: 1,
    //     icon: 'currency_exchange',
    //     type: 'PAREN',
    //     link: 'factura',
    //     enable: false,
    //     module: 'administrador',
    //     displayed: false,
    //     roles: PERMISSION.MENU_FACTURACION,
    //     submenus: [
    //       {
    //         code: 'FAC-001',
    //         text: 'Liquidación',
    //         order: 3,
    //         icon: 'paid',
    //         type: 'PAREN',
    //         link: 'factura/liquidacion',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_LIQUIDACION,
    //       },
    //       {
    //         code: 'FAC-004',
    //         text: 'DPF/ALO',
    //         order: 3,
    //         icon: 'manage_history',
    //         type: 'PAREN',
    //         link: 'factura/visordpf',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_VISOR,
    //       },
    //       {
    //         code: 'FAC-003',
    //         text: 'Liquidaciones proyecto',
    //         order: 3,
    //         icon: 'bar_chart',
    //         type: 'PAREN',
    //         link: 'factura/visorcierre',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_VISOR,
    //       },
    //       {
    //         code: 'FAC-003',
    //         text: 'Ventas declaradas',
    //         order: 3,
    //         icon: 'stacked_bar_chart',
    //         type: 'PAREN',
    //         link: 'factura/visordec',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_VISOR,
    //       },
    //       {
    //         code: 'FAC-003',
    //         text: 'Facturados',
    //         order: 3,
    //         icon: 'show_chart',
    //         type: 'PAREN',
    //         link: 'factura/visorfact',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_VISOR,
    //       },
    //       {
    //         code: 'FAC-003',
    //         text: 'Liquidaciones activas',
    //         order: 3,
    //         icon: 'pie_chart',
    //         type: 'PAREN',
    //         link: 'factura/visoract',
    //         enable: false,
    //         module: 'PAS',
    //         displayed: false,
    //         roles: PERMISSION.SUBMENU_VISOR,
    //       },
    //     ],
    //   },
    //   {
    //     id: 4,
    //     code: 'ADM',
    //     text: 'ADMINISTRACIÓN',
    //     order: 1,
    //     icon: 'admin_panel_settings',
    //     type: 'PAREN',
    //     link: 'administracion',
    //     enable: true,
    //     module: 'administrador4',
    //     displayed: false,
    //     roles: PERMISSION.MENU_FACTURACION,
    //     submenus: [
    //       {
    //         code: 'ADM-001',
    //         text: 'Usuarios',
    //         order: 1,
    //         icon: 'person',
    //         type: 'PAREN',
    //         link: 'administracion/usuarios',
    //         enable: true,
    //         module: 'ADM',
    //         displayed: true
    //       },
    //       {
    //         code: 'ADM-002',
    //         text: 'Permisos',
    //         order: 2,
    //         icon: 'https',
    //         type: 'PAREN',
    //         link: 'administracion/permisos',
    //         enable: false,
    //         module: 'ADM',
    //         displayed: false
    //       },
    //       {
    //         code: 'ADM-003',
    //         text: 'Módulos de config.',
    //         order: 3,
    //         icon: 'menu_open',
    //         type: 'PAREN',
    //         link: 'administracion/modulos',
    //         enable: true,
    //         module: 'ADM',
    //         displayed: false
    //       },
    //       {
    //         code: 'ADM-004',
    //         text: 'Menú',
    //         order: 20,
    //         icon: 'check',
    //         type: 'PAREN',
    //         link: 'administracion/menu',
    //         enable: true,
    //         module: 'ADM',
    //         displayed: true
    //       }
    //     ]
    //   },
    // ];




    this.listmodules = [
      {
        id_acta: 1,
        gestor: 'Alberto Regalado',
        proyecto: 'TQACOR',
        subservicio: 'H DE SERV- H DE Testing Hispam',
        estado: 'Pendiente',
        importe: '20000',
        periodo: 'gestion',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'jysantiago',
        // fecha_crea: '08-10-2023',
        // fecha_act: 23-10-2023,
        // usu_crea: 441,
        // eliminacion_logica: 1,
        detalle_acta: [
          {
            id_det: 101,
            proyecto: 'TQACOR',
            gestor: 'Alexandra Rodriguez',
            categoria: 'Analista de calidad',
            anlistas: 'AREDO NEIRA, LINA JANET',
            costo: '181,45',
            jornadas: '25,46',
            observaciones: 'comentario prueba',
            declarado:'10000',
            facturado:'10000',
            estado:'completado'
          },
          {
            id_det: 102,
            proyecto: 'TQACOR',
            gestor: 'Alexandra Rodriguez',
            categoria: 'Analista de calidad',
            anlistas: 'ACOSTA RAMIREZ, LUCY NATALY ',
            costo: '181,45',
            jornadas: '25,46',
            observaciones: 'comentario prueba',
            declarado:'4000',
            facturado:'3000',
            estado:'pendiente'
        },
        {
            id_det: 103,
            proyecto: 'TQACOR',
            gestor: 'Alexandra Rodriguez',
            categoria: 'Analista de calidad',
            anlistas: 'CHUNGA SULLON, DASS AMER               ',
            costo: '181,45',
            jornadas: '25,46',
            observaciones: 'comentario prueba',
            declarado:'6000',
            facturado:'6000',
            estado:'completado'
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
        periodo: 'gestion',
        comentario: 'No hay presupuesto suficiente',
        usu_act: 'rxayala',
        detalle_acta: [
          {
            id_det: 101,
            proyecto: 'TQACOR',
            gestor: 'Bedwer Hernandez',
            categoria: 'Analista de calidad',
            anlistas: 'SOTELO GUTIERREZ, FRANCISCO            ',
            costo: '181,45',
            jornadas: '25,46',
            observaciones: 'Mes completo',
            declarado:'10000',
            facturado:'10000',
            estado:'completado'
          },
          {
            id_det: 102,
            proyecto: 'TQACOR',
            gestor: 'Bedwer Hernandez',
            categoria: 'Analista de calidad',
            anlistas: 'FERNANDEZ PEREZ, LUCERO MADELEY         ',
            costo: '181,45',
            jornadas: '25,46',
            observaciones: 'Vacaciones del 11 al 17',
            declarado:'2000',
            facturado:'2000',
            estado:'completado'
        }
       ]
      }
    ]

    this.loading = false;
  }

  refreshModules() {
    // this.loading = true;
    // const subs: Subscription = this.permissionService.getAllModules().subscribe((resp:Menu[]) => {
    //     console.log('DATAMENU', resp)

    //     this.listmodules = resp;
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
