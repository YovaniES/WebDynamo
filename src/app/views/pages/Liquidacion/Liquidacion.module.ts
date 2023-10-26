import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LiquidacionRoutingModule } from './Liquidacion-routing.module';
import { ActaComponent } from './Actas/acta.component';
import { MantenimientoComponent } from './Mantenimiento-liquidacion/mantenimiento.component';
import { ModalEditModuleComponent } from './Actas/modal-edit-module/modal-edit-module.component';


@NgModule({
  declarations: [
    ActaComponent,
    MantenimientoComponent,
    ModalEditModuleComponent
  ],
  imports: [
    CommonModule,
    LiquidacionRoutingModule,
    CoreModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    ChartsModule,
  ],
  providers: [DatePipe,],
  bootstrap: []

})
export class LiquidacionModule { }
