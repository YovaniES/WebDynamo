import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantenimientoComponent } from './Mantenimiento-liquidacion/mantenimiento.component';
import { ActaComponent } from './Actas/acta.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'actas', component: ActaComponent },
      { path: 'mantenimiento', component: MantenimientoComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidacionRoutingModule {}
