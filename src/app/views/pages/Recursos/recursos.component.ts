import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ListaLiderComponent } from './lista-lider/lista-lider.component';
import { ListaProyectoComponent } from './lista-proyecto/lista-proyecto.component';
import { ListaJefaturaComponent } from './lista-jefatura/lista-jefatura.component';
import { ListaClienteComponent } from './lista-clientes/lista-cliente.component';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss'],
})
export class RecursosComponent {
  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  abrirModalLider( ) {
    this.dialog
      .open(ListaLiderComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe();
  }


  abrirListaProyecto( ) {
    this.dialog
      .open(ListaProyectoComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe();
  }

  abrirListaJefaturas( ) {
    this.dialog
      .open(ListaJefaturaComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe();
  }

  abrirListaClientes( ) {
    this.dialog
      .open(ListaClienteComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe();
  }
}


