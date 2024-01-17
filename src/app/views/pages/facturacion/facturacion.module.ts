import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { ModalComentarioComponent } from './liquidacion/modal-comentario/modal-comentario.component';
import { VisorDpfComponent } from './dpf-facturacion/visor-dpf-alo/visor-dpf.component';
import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ActualizarLiquidacionComponent } from './liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';
import { ActualizacionMasivaComponent } from './liquidacion/actualizacion-masiva/actualizacion-masiva.component';
import { ModalDpfPendienteComponent } from './dpf-facturacion/visor-dpf-alo/modal-dpf-pendiente/modal-dpf-pendiente.component';
import { ModalLiquidacionComponent } from './liquidacion/modal-liquidacion/modal-liquidacion.component';
import { ModalVentadeclaradaComponent } from './liquidacion/actualizar-liquidacion/modal-ventadeclarada/modal-ventadeclarada.component';
import { ModalCertificacionComponent } from './liquidacion/actualizar-liquidacion/modal-certificacion/modal-certificacion.component';


@NgModule({
  declarations: [
    ActualizarLiquidacionComponent,
    LiquidacionComponent,
    ActualizacionMasivaComponent,
    VisorDpfComponent,
    ModalComentarioComponent,
    ModalDpfPendienteComponent,
    ModalLiquidacionComponent,
    ModalCertificacionComponent,
    ModalVentadeclaradaComponent,
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
