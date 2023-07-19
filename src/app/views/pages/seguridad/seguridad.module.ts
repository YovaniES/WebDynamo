import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { IncAbiertasComponent } from './inc-abiertas/inc-abiertas.component';
import { IncCerradasComponent } from './inc-cerradas/inc-cerradas.component';
import { IncJustificadasComponent } from './inc-justificadas/inc-justificadas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    IncAbiertasComponent,
    IncCerradasComponent,
    IncJustificadasComponent,
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
