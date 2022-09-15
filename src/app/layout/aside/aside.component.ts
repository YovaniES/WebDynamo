import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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
        },
        {
          code: 'MAN-002',
          text: 'Registro vacaciones',
          order: 20,
          icon: 'surfing',
          type: 'PAREN',
          link: 'gestion/vacaciones',
          enable: false,
          module: 'MAN',
          displayed: false,
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
      submenus: [
        {
          code: 'PAS-001',
          text: 'Entidad',
          order: 3,
          icon: 'dashboard_customize',
          type: 'PAREN',
          link: 'mantenimiento/entidad',
          enable: false,
          module: 'PAS',
          displayed: false,
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
      link: 'facturacion',
      enable: false,
      module: 'administrador',
      displayed: false,
      submenus: [
        {
          code: 'FAC-001',
          text: 'Liquidación',
          order: 3,
          icon: 'paid',
          type: 'PAREN',
          link: 'facturacion/ventas',
          enable: false,
          module: 'PAS',
          displayed: false,
        },
        {
          code: 'FAC-002',
          text: 'Reporte',
          order: 3,
          icon: 'bar_chart',
          type: 'PAREN',
          link: 'facturacion/reporte',
          enable: false,
          module: 'PAS',
          displayed: false,
        }
      ],
    },
  ];


  constructor() {}

  ngOnInit(): void { }


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
