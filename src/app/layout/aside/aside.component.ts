import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ROLES_ENUM } from 'src/app/core/constants/rol.constants';
import { PERMISSION } from 'src/app/core/routes/internal.routes';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  @Output() generalfixedAside = new EventEmitter<Boolean>();
  fixedAside = true; //OBS: Verificar
  menuList = [
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

    // {
    //   id: 2,
    //   code: 'MAN',
    //   text: 'MANTENIMIENTO',
    //   order: 1,
    //   icon: 'settings_suggest',
    //   type: 'PAREN',
    //   link: 'mantenimiento',
    //   enable: false,
    //   module: 'administrador',
    //   displayed: false,
    //   roles: PERMISSION.MENU_MANTENIMIENTO,
    //   submenus: [
    //     {
    //       code: 'PAS-001',
    //       text: 'Entidad',
    //       order: 3,
    //       icon: 'grid_view',
    //       type: 'PAREN',
    //       link: 'mantenimiento/entidad',
    //       enable: false,
    //       module: 'PAS',
    //       displayed: false,
    //       roles: PERMISSION.SUBMENU_ENTIDAD,
    //     },
    //   ],
    // },

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
        // {
        //   code: 'PAS-001',
        //   text: 'Incidencias Cerradas',
        //   order: 3,
        //   icon: 'lock',
        //   type: 'PAREN',
        //   link: 'dashboard/cerradas',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_HAROS,
        // },
        // {
        //   code: 'PAS-001',
        //   text: 'Incidencias Sustentadas',
        //   order: 3,
        //   icon: 'security_update_good',
        //   type: 'PAREN',
        //   link: 'dashboard/sustentadas',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_HAROS,
        // },
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
        // {
        //   code: 'FAC-001',
        //   text: 'Lista productos',
        //   order: 3,
        //   icon: 'paid',
        //   type: 'PAREN',
        //   link: 'factura/products',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_LIQUIDACION,
        // },
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
          text: 'Liquidación venta',
          order: 3,
          icon: 'bar_chart',
          type: 'PAREN',
          link: 'factura/liquidacionVenta',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
        // {
        //   code: 'FAC-003',
        //   text: 'Ventas declaradas',
        //   order: 3,
        //   icon: 'stacked_bar_chart',
        //   type: 'PAREN',
        //   link: 'factura/visorDeclarado',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_VISOR,
        // },
        {
          code: 'FAC-003',
          text: 'Facturados',
          order: 3,
          icon: 'show_chart',
          type: 'PAREN',
          link: 'factura/visorFacturados',
          enable: false,
          module: 'PAS',
          displayed: false,
          roles: PERMISSION.SUBMENU_VISOR,
        },
        // {
        //   code: 'FAC-003',
        //   text: 'Liquidaciones activas',
        //   order: 3,
        //   icon: 'pie_chart',
        //   type: 'PAREN',
        //   link: 'factura/visoract',
        //   enable: false,
        //   module: 'PAS',
        //   displayed: false,
        //   roles: PERMISSION.SUBMENU_VISOR,
        // },
      ],
    },
    // {
    //   id: 4,
    //   code: 'ADM',
    //   text: 'ADMINISTRACIÓN',
    //   order: 1,
    //   icon: 'admin_panel_settings',
    //   type: 'PAREN',
    //   link: 'administracion',
    //   enable: true,
    //   module: 'administrador4',
    //   displayed: false,
    //   roles: PERMISSION.MENU_FACTURACION,
    //   submenus: [
    //     {
    //       code: 'ADM-001',
    //       text: 'Usuarios',
    //       order: 1,
    //       icon: 'person',
    //       type: 'PAREN',
    //       link: 'administracion/usuarios',
    //       enable: true,
    //       module: 'ADM',
    //       displayed: true
    //     },
    //     {
    //       code: 'ADM-002',
    //       text: 'Permisos',
    //       order: 2,
    //       icon: 'https',
    //       type: 'PAREN',
    //       link: 'administracion/permisos',
    //       enable: false,
    //       module: 'ADM',
    //       displayed: false
    //     },
    //     {
    //       code: 'ADM-003',
    //       text: 'Módulos de config.',
    //       order: 3,
    //       icon: 'menu_open',
    //       type: 'PAREN',
    //       link: 'administracion/modulos',
    //       enable: true,
    //       module: 'ADM',
    //       displayed: false
    //     },
    //     {
    //       code: 'ADM-004',
    //       text: 'Menú',
    //       order: 20,
    //       icon: 'check',
    //       type: 'PAREN',
    //       link: 'administracion/menu',
    //       enable: true,
    //       module: 'ADM',
    //       displayed: false
    //     }
    //   ]
    // },

    {
      id: 5,
      code: 'LIQ',
      text: 'LIQUIDACIÓN',
      order: 1,
      icon: 'account_tree',
      type: 'PAREN',
      link: 'liquidacion',
      enable: true,
      module: 'liquidacion',
      displayed: false,
      roles: PERMISSION.MENU_FACTURACION,
      submenus: [
        {
          code: 'LIQ-001',
          text: 'Actas',
          order: 1,
          icon: 'motion_photos_auto',
          type: 'PAREN',
          link: 'liquidacion/actas',
          enable: true,
          module: 'LIQ',
          displayed: true
        },
        {
          code: 'LIQ-002',
          text: 'Mant. Actas',
          order: 2,
          icon: 'dashboard_customize',
          type: 'PAREN',
          link: 'liquidacion/mantenimiento',
          enable: false,
          module: 'LIQ',
          displayed: false
        },
        // {
        //   code: 'LIQ-003',
        //   text: 'Módulos de config.',
        //   order: 3,
        //   icon: 'menu_open',
        //   type: 'PAREN',
        //   link: 'liquidacion/modulos',
        //   enable: true,
        //   module: 'LIQ',
        //   displayed: false
        // },
        // {
        //   code: 'LIQ-004',
        //   text: 'Menú',
        //   order: 20,
        //   icon: 'check',
        //   type: 'PAREN',
        //   link: 'liquidacion/menu',
        //   enable: true,
        //   module: 'LIQ',
        //   displayed: false
        // }
      ]
    },
    {
      id: 6,
      code: 'MAN',
      text: 'MANTENIMIENTO',
      order: 1,
      icon: 'admin_panel_settings',
      type: 'PAREN',
      link: 'recursos',
      enable: true,
      module: 'recursos',
      displayed: false,
      roles: PERMISSION.MENU_FACTURACION,
      submenus: [
        {
          code: 'LIQ-001',
          text: 'Módulos',
          order: 1,
          icon: 'rule_folder',
          type: 'PAREN',
          link: 'recursos/modulos',
          enable: true,
          module: 'LIQ',
          displayed: true
        },
        // {
        //   code: 'LIQ-002',
        //   text: 'Lider',
        //   order: 2,
        //   icon: 'perm_identity',
        //   type: 'PAREN',
        //   link: 'recursos/lider',
        //   enable: false,
        //   module: 'LIQ',
        //   displayed: false
        // },

      ]
    },
  ];

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getRolID()
  }

  rolID: number = 0;
  getRolID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.rolID   = resp.user.rolId;
      // console.log('ROL_ID_USER', this.rolID);
    })
   }

  hasPermission(r: ROLES_ENUM[]): boolean {
    if (r) {
      return this.authService.hasAccessToModule(r)
    }
    return true;
  }

  clickLinkMenu() {
    this.menuList.forEach((item) => {
      item.displayed = false;
    });
  }

  clickToggleMenu(item: any) {
    const final = !item.displayed;
    if (!(this.fixedAside == false && final == false)) {
      this.menuList.map((item) => {
        item.displayed = false;
      });
      item.displayed = final;
    }
    this.toggleAside(true);
  }

  toggleAside(e: boolean) {
    this.fixedAside = e;
    this.generalfixedAside.emit(this.fixedAside);
  }
}
