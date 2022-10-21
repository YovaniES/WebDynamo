import { Component } from '@angular/core';

@Component({
  selector: 'app-reporte-liquidacion',
  templateUrl: './reporte-liquidacion.component.html',
  styleUrls: ['./reporte-liquidacion.component.scss']

})
export class ReporteLiquidacionComponent {
  isExpanded = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

}
