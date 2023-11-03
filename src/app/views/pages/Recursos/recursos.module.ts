import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RecursosRoutingModule } from './recursos-routing.module';
import { ListaLiderComponent } from './lista-lider/lista-lider.component';
import { ListaProyectoComponent } from './lista-proyecto/lista-proyecto.component';
import { ModalLiderComponent } from './lista-lider/modal-lider/modal-lider.component';
import { ModalProyectoComponent } from './lista-proyecto/modal-proyecto/modal-proyecto.component';
import { RecursosComponent } from './recursos.component';
import { ListaClienteComponent } from './lista-clientes/lista-cliente.component';
import { ListaJefaturaComponent } from './lista-jefatura/lista-jefatura.component';
import { ModalClienteComponent } from './lista-clientes/modal-clientes/modal-cliente.component';
import { ModalJefaturaComponent } from './lista-jefatura/modal-jefatura/modal-jefatura.component';


@NgModule({
  declarations: [
    RecursosComponent,
    ListaLiderComponent,
    ListaProyectoComponent,
    ListaClienteComponent,
    ListaJefaturaComponent,
    ModalClienteComponent,
    ModalJefaturaComponent,
    ModalLiderComponent,
    ModalProyectoComponent
  ],
  imports: [
    CommonModule,
    RecursosRoutingModule,
    CoreModule,
    MaterialModule,
    MatIconModule,

    NgxPaginationModule,
    NgxSpinnerModule,
  ]
})
export class RecursosModule { }
