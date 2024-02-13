import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VisorService } from 'src/app/core/services/visor.service';


@Component({
  selector: 'app-modal-liquidventa',
  templateUrl: './modal-liquidventa.component.html',
  styleUrls: ['./modal-liquidventa.component.scss'],
})
export class ModalLiquidacionVentaComponent implements OnInit {

  constructor(
    private visorService: VisorService,
    public dialogRef: MatDialogRef<ModalLiquidacionVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQ_VENTA: any
   ) {}



  ngOnInit(): void {
    this.getLiquidacionVentaDetalle();
  }

  listDetalleLiquidVenta: any[] = []
  dataDetalle: any[] = [];
  datosAgrupados:  {[key: string]: any[]} = {};;
  getLiquidacionVentaDetalle(){
    this.visorService.getLiquidacionVentaDetalle().subscribe((resp: any) => {
      this.listDetalleLiquidVenta = resp;
      // console.log('LIQ-VENTA-DETALLE', this.listDetalleLiquidVenta);

      this.dataDetalle = this.listDetalleLiquidVenta.filter(x => x.proyecto == this.DATA_LIQ_VENTA.proyecto)

      // console.log('AGRUP_GESTOR', this.dataDetalle);


      this.listDetalleLiquidVenta.filter(x => x.proyecto == this.DATA_LIQ_VENTA.proyecto)
                                 .forEach((item) => {
              // console.log('Iterando, item:', item);

        if (this.datosAgrupados[item.gestor]) {
          this.datosAgrupados[item.gestor].push(item);
        } else {
          this.datosAgrupados[item.gestor] = [item];
        }
      });

      // console.log('DATA-AGRU', this.datosAgrupados);
    })
  }

}

