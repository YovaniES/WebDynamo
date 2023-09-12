import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncAbiertasComponent } from './inc-abiertas/inc-abiertas.component';
import { IncCerradasComponent } from './inc-cerradas/inc-cerradas.component';
import { HarosComponent } from './Haros/haros.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'cerradas', component: IncCerradasComponent},
      { path: 'abiertas', component: IncAbiertasComponent},
      { path: 'haros', component: HarosComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
