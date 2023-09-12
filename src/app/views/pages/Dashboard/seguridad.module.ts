import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { IncAbiertasComponent } from './inc-abiertas/inc-abiertas.component';
import { IncCerradasComponent } from './inc-cerradas/inc-cerradas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { HarosComponent } from './Haros/haros.component';

@NgModule({
  declarations: [
    IncAbiertasComponent,
    IncCerradasComponent,
    HarosComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule,
    SeguridadRoutingModule],
})
export class SeguridadModule {}
