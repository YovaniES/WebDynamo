import { Component, OnInit } from '@angular/core';
import { VisorService } from 'src/app/core/services/visor.service';
import { ModalLiquidacionVentaComponent } from './modal-estados/modal-liquidventa.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-liquidacion-venta',
  templateUrl: './liquidacion-venta.component.html',
  styleUrls: ['./liquidacion-venta.component.scss'],
})
export class LiquidacionVentaComponent implements OnInit {
  resultado  : any[] = [];
  resultadoV : any[] = [];
  totalColum : any[]=[];
  resultadoVF: any;
  caspru : any;
  casprux: any;
  closeResult: string = '';



    constructor(private visorServices: VisorService,
                private dialog: MatDialog,
      ) {}

  ngOnInit() {
    this.getDataLiquidacionVenta();
  }

  public dataLiqVenta: any[] = [];
  public displayedColumns: string[] = [];
  getDataLiquidacionVenta(){
    this.visorServices.getLiquidacionVenta().subscribe((resp: any[]) => {
      this.dataLiqVenta = resp;
      this.totalColum = resp;
      console.log('LIQ-VEN', this.dataLiqVenta);

      // this.displayedColumns = ["periodo","proyecto","actas","avance","importe","venta_declarada","certificado","facturado",]

    }, (error) => console.error(error)
    )
  }


  open(content: any, proy: any, periodo: any, origen: any) {
    // this.caspru = null;
    // this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" })
    //   .result.then((result: any) => {this.closeResult = `Closed with: ${result}`;},
    //     (reason: any) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;}
    //   );

    // if (origen == "LI") {
    //   (<HTMLSpanElement>document.getElementById("headertxt")).innerText = "Liquidaciones - " + proy;
    //   this.caspru = this.resultado;
    //   this.caspru = this.caspru.filter((task: any) => task.proyecto == proy);
    // } else {
    //   (<HTMLSpanElement>document.getElementById("headertxt")).innerText =
    //     (origen == "VD"? "Venta Declarada - "
    //       : origen == "CR"? "Certificado - "
    //       : "Facturado - ") + proy;
    //   this.caspru = this.resultadoVF;
    //   this.caspru = this.caspru.filter(
    //     (task: any) => task.proyecto == proy && task.tipo == origen
    //   );
    // }

    // var groups = this.caspru.reduce(function (obj, item) {
    //   obj[item.gestor] = obj[item.gestor] || [];
    //   obj[item.gestor].push(item);
    //   return obj;
    // }, {});
    // var myArray = Object.keys(groups).map(function (key) {
    //   return { torneo: key, requerimientos: groups[key] };
    // });
    // this.casprux = myArray;
    // console.log(this.casprux);

    // return false;
  }

  total(item: number) {
    return item == 1? this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.importe,     0):
           item == 2? this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.venta_declarada, 0):
           item == 3? this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.certificado, 0):
                      this.totalColum.reduce((acumulador:any, valorActual:any) => acumulador + valorActual.facturado,   0);
  }


  abrirDetalleLiquidacion(DATA?: any) {
    console.log('DATA_DET_LIQ', DATA);
    this.dialog
      .open(ModalLiquidacionVentaComponent, { width: '45%', data: DATA, position:{top:'75px', left: '33.3%'} })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getDataLiquidacionVenta();
        }
      });
  }

}


// OJO:
// https://localhost:7197/api/visor/getDataModalLiqVentaVD
// https://localhost:7197/api/visor/getDataModalLiqVentaFacturados
