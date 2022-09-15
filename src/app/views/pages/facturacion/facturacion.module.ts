import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ActualizarLiquidacionComponent } from './liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';
import { CrearLiquidacionComponent } from './liquidacion/crear-liquidacion/crear-liquidacion.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgregarVentadeclaradaComponent } from './liquidacion/actualizar-liquidacion/agregar-ventadeclarada/agregar-ventadeclarada.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { AgregarCertificacionComponent } from './liquidacion/actualizar-liquidacion/agregar-certificacion/agregar-certificacion.component';
import { ActualizacionMasivaComponent } from './liquidacion/actualizacion-masiva/actualizacion-masiva.component';
import { ReporteLiquidacionComponent } from './liquidacion/reporte-liquidacion/reporte-liquidacion.component';


@NgModule({
  declarations: [
    CrearLiquidacionComponent,
    ActualizarLiquidacionComponent,
    AgregarVentadeclaradaComponent,
    LiquidacionComponent,
    AgregarCertificacionComponent,
    ActualizacionMasivaComponent,
    ReporteLiquidacionComponent
  ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,

    CoreModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
  ]
})
export class FacturacionModule { }
