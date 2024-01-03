import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ListaGestorComponent } from './lista-gestor/lista-gestor.component';
import { ListaSubservicioComponent } from './lista-subservicio/lista-subservicio.component';
import { ListaOrdencompraComponent } from './lista-ordencompra/lista-ordencompra.component';
import { ListaFacturasComponent } from './lista-facturas/lista-facturas.component';
import { ListaEstadosComponent } from './lista-estados/lista-estados.component';
import { ListaCertificacionesComponent } from './lista-certificaciones/lista-certificaciones.component';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss'],
})
export class MantenimientoComponent {

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  abrirModalGestor() {
    this.dialog
      .open(ListaGestorComponent, { width: '60%', data: {} })
      .afterClosed()
      .subscribe();
  }

  abrirListaSubservicio() {
    this.dialog
      .open(ListaSubservicioComponent, { width: '60%', data: {} })
      .afterClosed()
      .subscribe();
  }

  abrirListaOrdecompra() {
    this.dialog
      .open(ListaOrdencompraComponent, { width: '60%', data: {} })
      .afterClosed()
      .subscribe();
  }

  abrirListaCertificaciones() {
    this.dialog
      .open(ListaCertificacionesComponent, { width: '60%', data: {} })
      .afterClosed()
      .subscribe();
  }

  abrirListaFacturas() {
    this.dialog
      .open(ListaFacturasComponent, { width: '60%', data: {} })
      .afterClosed()
      .subscribe();
  };

  abrirListaEstados() {
    this.dialog
      .open(ListaEstadosComponent, { width: '60%', data: {} })
      .afterClosed()
      .subscribe();
  }
}
