import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LiquidacionRoutingModule } from './Liquidacion-routing.module';
import { ActaComponent } from './Actas/acta.component';
import { MantenimientoComponent } from './Mantenimiento-liquidacion/mantenimiento.component';
import { ModalEditModuleComponent } from './Actas/modal-edit-module/modal-edit-module.component';
import { ListaGestorComponent } from './Mantenimiento-liquidacion/lista-gestor/lista-gestor.component';
import { ModalGestorComponent } from './Mantenimiento-liquidacion/lista-gestor/modal-gestor/modal-gestor.component';
import { ListaSubservicioComponent } from './Mantenimiento-liquidacion/lista-subservicio/lista-subservicio.component';
import { ModalSubservicioComponent } from './Mantenimiento-liquidacion/lista-subservicio/modal-subservicio/modal-subservicio.component';
import { ListaOrdencompraComponent } from './Mantenimiento-liquidacion/lista-ordencompra/lista-ordencompra.component';
import { ModalOrdencompraComponent } from './Mantenimiento-liquidacion/lista-ordencompra/modal-ordencompra/modal-ordencompra.component';
import { ModalActaComponent } from './Actas/modal-actas/modal-acta.component';
import { ListaFacturasComponent } from './Mantenimiento-liquidacion/lista-facturas/lista-facturas.component';
import { ModalFacturasComponent } from './Mantenimiento-liquidacion/lista-facturas/modal-facturas/modal-facturas.component';


@NgModule({
  declarations: [
    ActaComponent,
    MantenimientoComponent,
    ModalEditModuleComponent,
    ModalGestorComponent,
    ListaGestorComponent,
    ListaSubservicioComponent,
    ListaOrdencompraComponent,
    ListaFacturasComponent,
    ModalSubservicioComponent,
    ModalOrdencompraComponent,
    ModalActaComponent,
    ModalFacturasComponent
  ],
  imports: [
    CommonModule,
    LiquidacionRoutingModule,
    CoreModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ChartsModule,
  ],
  providers: [DatePipe,],
  bootstrap: []

})
export class LiquidacionModule { }
