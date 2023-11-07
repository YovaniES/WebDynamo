import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
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
export class MantenimientoComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  loading = false;
  showingidx = 0;

  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }


  liquidacionForm!: FormGroup;
  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      import             : ['']
    })
  };

  abrirModalGestor( ) {
    this.dialog
      .open(ListaGestorComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
        }
      });
  }


  abrirListaSubservicio( ) {
    this.dialog
      .open(ListaSubservicioComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          // this.getAllSubservicio();
        }
      });
  }


  abrirListaOrdecompra( ) {
    this.dialog
      .open(ListaOrdencompraComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          // this.getAllOrdencompra();
        }
      });
  }

  abrirListaCertificaciones( ) {
    this.dialog
      .open(ListaCertificacionesComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
        }
      });
  }

  abrirListaFacturas( ) {
    this.dialog
      .open(ListaFacturasComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
        }
      });
  }


  abrirListaEstados( ) {
    this.dialog
      .open(ListaEstadosComponent, { width: '60%', data: { } })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
        }
      });
  }
}


