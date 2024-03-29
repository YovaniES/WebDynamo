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
import { ModalProductComponent } from './list-products/modal-product/modal-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { VisorDeclaradaComponent } from './dpf-facturacion/visor-venta-decl/visor-declarada.component';
import { VisorFacturadosComponent } from './dpf-facturacion/visor-facturados/visor-facturados.component';
import { LiquidacionVentaComponent } from './dpf-facturacion/visor-liquidacion-venta/liquidacion-venta.component';
import { ModalLiquidacionVentaComponent } from './dpf-facturacion/visor-liquidacion-venta/modal-estados/modal-liquidventa.component';


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

    ListProductsComponent,
    ModalProductComponent,
    VisorDeclaradaComponent,
    VisorFacturadosComponent,
    LiquidacionVentaComponent,
    ModalLiquidacionVentaComponent
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
