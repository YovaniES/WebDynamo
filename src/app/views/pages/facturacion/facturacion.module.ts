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
import { ReporteLiquidacionComponent } from './liquidacion/reporte-liquidacion/reporte-liquidacion.component';
import { VisorActComponent } from './liquidacion/reporte-liquidacion/visor-act/visor-act.component';
import { HomeVisorComponent } from './liquidacion/home-visor/home-visor.component';
import { VisorFactComponent } from './liquidacion/reporte-liquidacion/visor-fact/visor-fact.component';
import { VisorDeclaradaComponent } from './liquidacion/reporte-liquidacion/visor-declarada/visor-declarada.component';
import { VisorCierreComponent } from './liquidacion/reporte-liquidacion/visor-cierre/visor-cierre.component';


@NgModule({
  declarations: [
    CrearLiquidacionComponent,
    ActualizarLiquidacionComponent,
    AgregarVentadeclaradaComponent,
    LiquidacionComponent,
    AgregarCertificacionComponent,
    ActualizacionMasivaComponent,
    ReporteLiquidacionComponent,
    HomeVisorComponent,
    VisorActComponent,
    VisorCierreComponent,
    VisorFactComponent,
    VisorDeclaradaComponent
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
