import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecursosComponent } from './recursos.component';

const routes: Routes = [
  {
    path: '', children: [
      { path:'modulos', component: RecursosComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecursosRoutingModule { }
