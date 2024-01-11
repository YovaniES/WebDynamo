import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/models/menu.models';
import { ModalEditModuleComponent } from '../modal-edit-module/modal-edit-module.component';
import { PERMISSION } from 'src/app/core/routes/internal.routes';

@Component({
  selector: 'app-module-menus',
  templateUrl: './module-menus.component.html',
  styleUrls: ['./module-menus.component.scss'],
})
export class ModuleMenusComponent implements OnInit {
  loading = false;
  listmodules: any[] = [];
  // listmodules: Menu[] = [];
  showingidx = 0;

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshModules()
    this.dataMenuPrueba()
    console.log('ABX', this.listmodules);
    ;
  }


  dataMenuPrueba(){
    this.loading = true;
    this.listmodules = [
      {
        id: 1,
        code: 'GES',
        text: 'GESTIÓN PERSONAL',
        order: 1,
        icon: 'people',
        type: 'PAREN',
        link: 'gestion',
        enable: false,
        module: 'Reporte',
        displayed: false,
        roles: PERMISSION.MENU_PERSONAS,
        submenus: [
          {
            code: 'MAN-001',
            text: 'Personal',
            order: 0,
            icon: 'how_to_reg',
            type: 'ALONE',
            link: 'gestion/personas',
            enable: false,
            module: 'MAN',
            displayed: false,
            roles: PERMISSION.SUBMENU_PERSONAS,
          },
          {
            code: 'MAN-002',
            text: 'Lista vacaciones',
            order: 20,
            icon: 'surfing',
            type: 'PAREN',
            link: 'gestion/vacaciones',
            enable: false,
            module: 'MAN',
            displayed: false,
            roles: PERMISSION.SUBMENU_VACACIONES,
          },
          {
            code: 'MAN-003',
            text: 'Recurso Hardware',
            order: 20,
            icon: 'phonelink',
            type: 'PAREN',
            link: 'gestion/hardware',
            enable: false,
            module: 'MAN',
            displayed: false,
            roles: PERMISSION.SUBMENU_HARDWARE,
          },
          {
            code: 'MAN-004',
            text: 'Recurso Cuenta',
            order: 20,
            icon: 'lock_clock',
            type: 'PAREN',
            link: 'gestion/cuentas',
            enable: false,
            module: 'MAN',
            displayed: false,
            roles: PERMISSION.SUBMENU_CUENTA,
          },
        ],
      },

      {
        id: 2,
        code: 'MAN',
        text: 'MANTENIMIENTO',
        order: 1,
        icon: 'settings_suggest',
        type: 'PAREN',
        link: 'mantenimiento',
        enable: false,
        module: 'administrador',
        displayed: false,
        roles: PERMISSION.MENU_MANTENIMIENTO,
        submenus: [
          {
            code: 'PAS-001',
            text: 'Entidad',
            order: 3,
            icon: 'grid_view',
            type: 'PAREN',
            link: 'mantenimiento/entidad',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_ENTIDAD,
          },
        ],
      },

      {
        id: 2,
        code: 'DAS',
        text: 'DASHBOARD',
        order: 1,
        icon: 'dashboard_customize',
        type: 'PAREN',
        link: 'dashboard',
        enable: false,
        module: 'administrador',
        displayed: false,
        roles: PERMISSION.MENU_DASHBOARD,
        submenus: [
          {
            code: 'DAS-001',
            text: 'Haros',
            order: 3,
            icon: 'lock_open',
            type: 'PAREN',
            link: 'dashboard/haros',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_HAROS,
          },
        ],
      },

      {
        id: 3,
        code: 'FAC',
        text: 'FACTURACIÓN',
        order: 1,
        icon: 'currency_exchange',
        type: 'PAREN',
        link: 'factura',
        enable: false,
        module: 'administrador',
        displayed: false,
        roles: PERMISSION.MENU_FACTURACION,
        submenus: [
          {
            code: 'FAC-001',
            text: 'Liquidación',
            order: 3,
            icon: 'paid',
            type: 'PAREN',
            link: 'factura/liquidacion',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_LIQUIDACION,
          },
          {
            code: 'FAC-004',
            text: 'DPF/ALO',
            order: 3,
            icon: 'manage_history',
            type: 'PAREN',
            link: 'factura/visordpf',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_VISOR,
          },
          {
            code: 'FAC-003',
            text: 'Liquidaciones proyecto',
            order: 3,
            icon: 'bar_chart',
            type: 'PAREN',
            link: 'factura/visorcierre',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_VISOR,
          },
          {
            code: 'FAC-003',
            text: 'Ventas declaradas',
            order: 3,
            icon: 'stacked_bar_chart',
            type: 'PAREN',
            link: 'factura/visordec',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_VISOR,
          },
          {
            code: 'FAC-003',
            text: 'Facturados',
            order: 3,
            icon: 'show_chart',
            type: 'PAREN',
            link: 'factura/visorfact',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_VISOR,
          },
          {
            code: 'FAC-003',
            text: 'Liquidaciones activas',
            order: 3,
            icon: 'pie_chart',
            type: 'PAREN',
            link: 'factura/visoract',
            enable: false,
            module: 'PAS',
            displayed: false,
            roles: PERMISSION.SUBMENU_VISOR,
          },
        ],
      },
      {
        id: 4,
        code: 'ADM',
        text: 'ADMINISTRACIÓN',
        order: 1,
        icon: 'admin_panel_settings',
        type: 'PAREN',
        link: 'administracion',
        enable: true,
        module: 'administrador4',
        displayed: false,
        roles: PERMISSION.MENU_FACTURACION,
        submenus: [
          {
            code: 'ADM-001',
            text: 'Usuarios',
            order: 1,
            icon: 'person',
            type: 'PAREN',
            link: 'administracion/usuarios',
            enable: true,
            module: 'ADM',
            displayed: true
          },
          {
            code: 'ADM-002',
            text: 'Permisos',
            order: 2,
            icon: 'https',
            type: 'PAREN',
            link: 'administracion/permisos',
            enable: false,
            module: 'ADM',
            displayed: false
          },
          {
            code: 'ADM-003',
            text: 'Módulos de config.',
            order: 3,
            icon: 'menu_open',
            type: 'PAREN',
            link: 'administracion/modulos',
            enable: true,
            module: 'ADM',
            displayed: false
          },
          {
            code: 'ADM-004',
            text: 'Menú',
            order: 20,
            icon: 'check',
            type: 'PAREN',
            link: 'administracion/menu',
            enable: true,
            module: 'ADM',
            displayed: true
          }
        ]
      },
    ];

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
}
