import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { VisorActComponent } from './liquidacion/reporte-liquidacion/visor-act/visor-act.component';
import { VisorCierreComponent } from './liquidacion/reporte-liquidacion/visor-cierre/visor-cierre.component';
import { VisorDeclaradaComponent } from './liquidacion/reporte-liquidacion/visor-declarada/visor-declarada.component';
import { VisorFactComponent } from './liquidacion/reporte-liquidacion/visor-fact/visor-fact.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'liquidacion', component: LiquidacionComponent },
      { path: 'visoract', component: VisorActComponent },
      { path: 'visorfact', component: VisorFactComponent },
      { path: 'visorcierre', component: VisorCierreComponent },
      { path: 'visordec', component: VisorDeclaradaComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturacionRoutingModule {}
