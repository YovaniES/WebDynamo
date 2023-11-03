import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
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
export class RecursosComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  loading = false;
  showingidx = 0;

  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}


  liquidacionForm!: FormGroup;
  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      import             : ['']
    })
  };

  // getAllLider(){};
  // getAllProyecto(){};

  abrirModalLider( ) {
    this.dialog
      .open(ListaLiderComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          // this.getAllLider();
        }
      });
  }


  abrirListaProyecto( ) {
    this.dialog
      .open(ListaProyectoComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          // this.getAllProyecto();
        }
      });
  }


  abrirListaJefaturas( ) {
    this.dialog
      .open(ListaJefaturaComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
        }
      });
  }

  abrirListaClientes( ) {
    this.dialog
      .open(ListaClienteComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
        }
      });
  }
}


