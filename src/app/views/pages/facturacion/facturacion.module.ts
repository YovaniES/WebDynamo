import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ActualizarLiquidacionComponent } from './liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';
import { CrearLiquidacionComponent } from './liquidacion/crear-liquidacion/crear-liquidacion.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgregarVentadeclaradaComponent } from './liquidacion/actualizar-liquidacion/agregar-ventadeclarada/agregar-ventadeclarada.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { AgregarCertificacionComponent } from './liquidacion/actualizar-liquidacion/agregar-certificacion/agregar-certificacion.component';
import { ActualizacionMasivaComponent } from './liquidacion/actualizacion-masiva/actualizacion-masiva.component';
import { VisorActComponent } from './dashboard-facturacion/visor-liquid-activas/visor-act.component';
import { VisorFactComponent } from './dashboard-facturacion/visor-facturados/visor-fact.component';
import { VisorDeclaradaComponent } from './dashboard-facturacion/visor-venta-decl/visor-declarada.component';
import { VisorActByProyComponent } from './dashboard-facturacion/visor-act-by-proy/visor-actbyproy.component';
import { VisorDpfComponent } from './dashboard-facturacion/visor-dpf-alo/visor-dpf.component';
import { ModalComentarioComponent } from './liquidacion/modal-comentario/modal-comentario.component';


@NgModule({
  declarations: [
    CrearLiquidacionComponent,
    ActualizarLiquidacionComponent,
    AgregarVentadeclaradaComponent,
    LiquidacionComponent,
    AgregarCertificacionComponent,
    ActualizacionMasivaComponent,
    VisorActComponent,
    VisorActByProyComponent,
    VisorFactComponent,
    VisorDeclaradaComponent,
    VisorDpfComponent,
    ModalComentarioComponent
    ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,
    CoreModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ChartsModule,
  ],
  providers: [DatePipe,],
  bootstrap: [LiquidacionComponent]

})
export class FacturacionModule { }
