import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { VisorDpfComponent } from './dpf-facturacion/visor-dpf-alo/visor-dpf.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { VisorDeclaradaComponent } from './dpf-facturacion/visor-venta-decl/visor-declarada.component';
import { VisorFacturadosComponent } from './dpf-facturacion/visor-facturados/visor-facturados.component';
import { LiquidacionVentaComponent } from './dpf-facturacion/visor-liquidacion-venta/liquidacion-venta.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'liquidacion', component: LiquidacionComponent },
      { path: 'products', component: ListProductsComponent },
      { path: 'visordpf', component: VisorDpfComponent },
      { path: 'visorDeclarado', component: VisorDeclaradaComponent },
      { path: 'visorFacturados', component: VisorFacturadosComponent },
      { path: 'liquidacionVenta', component: LiquidacionVentaComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturacionRoutingModule {}
