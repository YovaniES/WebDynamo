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
import { ListaEstadosComponent } from './Mantenimiento-liquidacion/lista-estados/lista-estados.component';
import { ModalEstadosComponent } from './Mantenimiento-liquidacion/lista-estados/modal-estados/modal-estados.component';
import { ListaCertificacionesComponent } from './Mantenimiento-liquidacion/lista-certificaciones/lista-certificaciones.component';
import { ModalCertificacionesComponent } from './Mantenimiento-liquidacion/lista-certificaciones/modal-certificaciones/modal-certificaciones.component';
import { SubActasComponent } from './Actas/sub-actas/sub-actas.component';
import { DetalleActasComponent } from './Actas/sub-actas/detalle-actas/detalle-actas.component';
import { VentaDeclaradaComponent } from './Actas/sub-actas/venta-declarada/venta-declarada.component';
import { CrearFacturasComponent } from './Mantenimiento-liquidacion/lista-certificaciones/crear-facturas/crear-facturas.component';
import { ModalCertificacionComponent } from './Actas/sub-actas/detalle-actas/modal-certificacion/modal-certificacion.component';


@NgModule({
  declarations: [
    ActaComponent,
    MantenimientoComponent,
    ModalEditModuleComponent,
    ModalGestorComponent,
    ListaGestorComponent,
    ListaSubservicioComponent,
    ListaOrdencompraComponent,
    ListaEstadosComponent,
    ListaFacturasComponent,
    ModalSubservicioComponent,
    ModalOrdencompraComponent,
    ModalActaComponent,
    ModalFacturasComponent,
    ModalEstadosComponent,
    ListaCertificacionesComponent,
    ModalCertificacionesComponent,
    CrearFacturasComponent,
    SubActasComponent,
    DetalleActasComponent,
    VentaDeclaradaComponent,
    ModalCertificacionComponent
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
